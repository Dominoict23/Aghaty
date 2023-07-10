const { serverErrs } = require("../middleware/customError");
const { deliveryRef, notifications } = require("../firebaseConfig");
const {
  OrderDelivery,
  Delivery,
  Order,
  FinancialRecord,
} = require("../models");
const { calculateDistance } = require("../utils/calculateDistance");
const { Op } = require("sequelize");
// const testFCM = require("../utils/testFCM");

const refreshDeliveryOrders = async () => {
  const delivers = await Delivery.findAll({ order: [["id", "ASC"]] });
  delivers.map(async (delivery) => {
    if (delivery.status === "waiting") {
      await delivery.update({ status: "free" });
    }
  });
  const orderDeliveries = await OrderDelivery.findAll({
    where: { status: "PENDING" },
    order: [["id", "DESC"]],
  });

  await Promise.all(
    orderDeliveries.map(async (order) => {
      if (order.DeliveryId !== null) {
        const rejectedDeliveries = order.rejectedDeliveries;
        if (!rejectedDeliveries.includes(order.DeliveryId)) {
          rejectedDeliveries.push(order.DeliveryId);
          await order.update({ DeliveryId: null, rejectedDeliveries });
        }
      } else {
        await order.update({ rejectedDeliveries: [] });
      }
      await putNearestDeliveryID(order, delivers);
    })
  );
};

const putNearestDeliveryID = async (order, delivers) => {
  const snapshot = await deliveryRef.once("value");

  const deliveries = {};

  snapshot.forEach((childSnapshot) => {
    const { lat, long, fcmToken } = childSnapshot.val();
    const deliveryId = childSnapshot.key;
    // console.log(
    //   delivers[deliveryId - 1].status === "free" &&
    //     delivers[deliveryId - 1].type === order.type &&
    //     !order.rejectedDeliveries.includes(deliveryId) &&
    //     fcmToken !== ""
    // );
    if (
      delivers[deliveryId - 1].status === "free" &&
      delivers[deliveryId - 1].type === order.type &&
      !order.rejectedDeliveries.includes(deliveryId) &&
      fcmToken !== ""
    ) {
      const distance = calculateDistance(
        order.startLat,
        order.startLong,
        lat,
        long
      );
      deliveries[distance] = deliveryId;
    }
  });

  const distances = Object.keys(deliveries).map(Number);

  const minDistance = Math.min(...distances);

  const DeliveryId = deliveries[minDistance];
  // console.log({ DeliveryId }, { OrderId: order.id });
  // TODO: delete the condition if not needed
  if (DeliveryId) {
    await delivers[DeliveryId - 1].update({ status: "waiting" });
    // await Delivery.update({ status: "busy" }, { where: { id: DeliveryId } });
    await order.update({ DeliveryId });
    await sendNotification(DeliveryId, order);
  }
};

const sendNotification = async (DeliveryId, order) => {
  try {
    // const dbDelivery = await Delivery.findOne({ where: { id: DeliveryId } });
    const delivery = await deliveryRef.child(DeliveryId).once("value");

    const { fcmToken } = delivery.val();

    const { distance, price, startLong, startLat, endLong, endLat } = order;

    const message = {
      notification: {
        title: "New Order",
      },
      data: {
        distance,
        price: `${price}`,
        startLong: `${startLong}`,
        startLat: `${startLat}`,
        endLong: `${endLong}`,
        endLat: `${endLat}`,
      },
      token: fcmToken,
    };

    // console.log({ message });

    // await testFCM(message);
    const notificationSuccess = await notifications.send(message);
    // console.log({ notificationSuccess });
  } catch (error) {
    throw serverErrs.BAD_REQUEST("Failed to send notification", error);
  }
};

// deliveryRef.on("child_changed", async (snapshot) => {
//   await determineNearestDelivery();
//   const deliveryId = snapshot.key;
//   const deliveryData = snapshot.val();
//   const delivery = await Delivery.findOne({ where: { id: deliveryId } });
//   if (delivery.status === "free") {
//     const orders = await OrderDelivery.findAll({
//       status: "PENDING",
//       type: delivery.type,
//       DeliveryId: delivery.id,
//     });
//     await deliveryRef.child(deliveryId).set({ ...deliveryData, orders });
//   }
// });

// // TODO: call this function once every change in all data

// const determineNearestDelivery = async () => {
//   let orders = await OrderDelivery.findAll({ where: { status: "PENDING" } }); // TODO: status might be rejected
// await Promise.all(
//   orders.map(async (order) => {
//     if (order.DeliveryId !== null) {
//       const rejectedDeliveries = order.rejectedDeliveries;
//       if (!rejectedDeliveries.includes(order.DeliveryId)) {
//         rejectedDeliveries.push(order.DeliveryId);
//         await order.update({ DeliveryId: null, rejectedDeliveries });
//       }
//     }
//     await putNearestDeliveryID(order);
//   })
// );
// };

const acceptDeliveryOrder = async (req, res) => {
  const { OrderId } = req.body;
  const orderDelivery = await OrderDelivery.findOne({
    where: { id: OrderId, status: "PENDING", DeliveryId: req.user.userId },
  });

  const delivery = await Delivery.findOne({ where: { id: req.user.userId } });

  if (!orderDelivery || !delivery)
    throw serverErrs.BAD_REQUEST("order or delivery not exist");

  await orderDelivery.update({ status: "IN_PROGRESS" });

  await delivery.update({ status: "busy" });

  if (orderDelivery.OrderId) {
    const order = await Order.findOne({ where: { id: orderDelivery.OrderId } });
    await order.update({ status: "IN_PROGRESS" });
  }

  res.send({
    status: 201,
    msg: "successful delivery accept order",
  });
};

const rejectDeliveryOrder = async (req, res) => {
  const { OrderId } = req.body;

  const orderDelivery = await OrderDelivery.findOne({
    where: { id: OrderId, status: "PENDING", DeliveryId: req.user.userId },
  });

  const delivery = await Delivery.findOne({ where: { id: req.user.userId } });

  if (!orderDelivery || !delivery)
    throw serverErrs.BAD_REQUEST("order or delivery not exist");

  const rejectedDeliveries = orderDelivery.rejectedDeliveries;

  if (!rejectedDeliveries.includes(orderDelivery.DeliveryId)) {
    rejectedDeliveries.push(orderDelivery.DeliveryId);
    await orderDelivery.update({ rejectedDeliveries });
  }

  res.send({
    status: 201,
    msg: "successful delivery reject order",
  });
};

//TODO: save delivery financial report
const confirmDeliveryOrder = async (req, res) => {
  const { OrderId } = req.body;

  const orderDelivery = await OrderDelivery.findOne({
    where: { id: OrderId, DeliveryId: req.user.userId },
  });

  const delivery = await Delivery.findOne({ where: { id: req.user.userId } });

  if (!orderDelivery || !delivery)
    throw serverErrs.BAD_REQUEST("order or delivery not exist");

  if (orderDelivery.status !== "IN_PROGRESS")
    throw serverErrs.BAD_REQUEST("Order not accepted");

  await orderDelivery.update({ status: "DELIVERED" });

  await delivery.update({ status: "free" });

  if (orderDelivery.OrderId) {
    const order = await Order.findOne({ where: { id: orderDelivery.OrderId } });
    await order.update({ status: "DELIVERED" });
    await FinancialRecord.create({
      DeliveryId: req.user.userId,
      OrderDeliveryId: orderDelivery.id,
      OrderId: orderDelivery.OrderId,
    });
  } else {
    await FinancialRecord.create({
      DeliveryId: req.user.userId,
      OrderDeliveryId: orderDelivery.id,
    });
  }

  res.send({
    status: 201,
    msg: "successful delivery confirm order",
  });
};

const getAllDeliveredOrders = async (req, res) => {
  const orders = await OrderDelivery.findAll({
    where: { DeliveryId: req.user.userId, status: "DELIVERED" },
  });

  res.send({
    status: 200,
    data: orders,
  });
};

module.exports = {
  refreshDeliveryOrders,
  acceptDeliveryOrder,
  rejectDeliveryOrder,
  confirmDeliveryOrder,
  getAllDeliveredOrders,
};

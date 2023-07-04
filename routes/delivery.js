const express = require("express");

const deliveryRouter = express.Router();

const errorCatcher = require("../middleware/errorCatcher");

const verifyToken = require("../middleware/verifyToken");

const checkUserAuth = require("../middleware/checkUserAuth");

const {
  refreshDeliveryOrders,
  acceptDeliveryOrder,
  rejectDeliveryOrder,
} = require("../controllers/delivery");

setInterval(async () => {
  await refreshDeliveryOrders();
}, 60000);

deliveryRouter.post(
  "/Order/accept",
  verifyToken,
  checkUserAuth("delivery"),
  errorCatcher(acceptDeliveryOrder)
);

deliveryRouter.post(
  "/Order/reject",
  verifyToken,
  checkUserAuth("delivery"),
  errorCatcher(rejectDeliveryOrder)
);

module.exports = deliveryRouter;

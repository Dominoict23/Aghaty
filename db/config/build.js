const sequelize = require("./connection");

const {
  // seller,
  // category,
  // subCategory,
  // products,
  // posts,
  // stories,
  // services,
  admin,
  messages,
  // deliveries,
} = require("./fakeData");

const {
  // Seller,
  // Category,
  // SubCategory,
  // Product,
  // Post,
  // Story,
  Image,
  // Service,
  Admin,
  Message,
  // Delivery,
} = require("../../models");

const insertDB = async () => {
  await sequelize.sync({ force: true });
  await Admin.bulkCreate(admin).then(() =>
    console.log("Admin data have been saved")
  );
  await Message.bulkCreate(messages).then(() =>
    console.log("Messages data have been saved")
  );
  // await Category.bulkCreate(category).then(() =>
  //   console.log("Category data have been saved")
  // );
  // await Seller.bulkCreate(seller).then(() =>
  //   console.log("Seller data have been saved")
  // );
  // await Delivery.bulkCreate(deliveries).then(() =>
  //   console.log("Delivery data have been saved")
  // );
  // await SubCategory.bulkCreate(subCategory).then(() =>
  //   console.log("SubCategory data have been saved")
  // );
  // await Story.bulkCreate(stories).then(() =>
  //   console.log("Story data have been saved")
  // );
  // products.forEach(async (product, ind) => {
  //   const {
  //     nameAR,
  //     nameEN,
  //     nameKUR,
  //     description,
  //     price,
  //     availableAmount,
  //     limitAmount,
  //     discountPrice,
  //     image,
  //     SubCategoryId,
  //     SellerId,
  //   } = product;
  //   await Product.bulkCreate([
  //     {
  //       nameAR,
  //       nameEN,
  //       nameKUR,
  //       description,
  //       price,
  //       availableAmount,
  //       limitAmount,
  //       discountPrice,
  //       SubCategoryId,
  //       SellerId,
  //     },
  //   ]).then(() => console.log("Product data have been saved"));
  //   await Image.bulkCreate([{ image, ProductId: ind + 1 }]).then(() =>
  //     console.log("Product image data have been saved")
  //   );
  // });

  // posts.forEach(async (post, ind) => {
  //   const { text, image, SellerId } = post;
  //   await Post.bulkCreate([
  //     {
  //       text,
  //       SellerId,
  //     },
  //   ]).then(() => console.log("Post data have been saved"));
  //   await Image.bulkCreate([{ image, PostId: ind + 1 }]).then(() =>
  //     console.log("Post image data have been saved")
  //   );
  // });

  // services.forEach(async (service, ind) => {
  //   const {
  //     nameAR,
  //     nameEN,
  //     nameKUR,
  //     description,
  //     priceFrom,
  //     priceTo,
  //     image,
  //     SellerId,
  //   } = service;
  //   await Service.bulkCreate([
  //     {
  //       nameAR,
  //       nameEN,
  //       nameKUR,
  //       description,
  //       priceFrom,
  //       priceTo,
  //       SellerId,
  //     },
  //   ]).then(() => console.log("Service data have been saved"));
  //   await Image.bulkCreate([{ image, ServiceId: ind + 1 }]).then(() =>
  //     console.log("Service image data have been saved")
  //   );
  // });
};

if (process.env.SEED) {
  insertDB();
}

module.exports = insertDB;

const express = require("express");

const sellerRouter = express.Router();

const {
  addProduct,
  addStory,
  addPost,
  addLike,
  addComment,
  editAvatar,
  editCover,
  editProduct,
  deleteProduct,
  getSellerProducts,
  editStory,
  deleteStory,
  editPost,
  deletePost,
  getAllPosts,
  getAllStories,
  deleteLike,
  editComment,
  getAllSubCategory,
  getSellerStories,
  getSinglePosts,
  getProductOrders,
  getProductsOrder,
  getPendingProductOrders,
  acceptProductOrder,
  rejectProductOrder,
  dirname,
} = require("../controllers/productSeller");

const errorCatcher = require("../middleware/errorCatcher");

const verifyToken = require("../middleware/verifyToken");

const checkUserAuth = require("../middleware/checkUserAuth");

sellerRouter.get(
  "/dirname",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(dirname)
);

sellerRouter.post(
  "/addProduct/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(addProduct)
);

sellerRouter.post(
  "/addStory/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(addStory)
);

sellerRouter.post(
  "/addPost/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(addPost)
);

sellerRouter.post(
  "/addLike",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(addLike)
);

sellerRouter.post(
  "/addComment",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(addComment)
);

sellerRouter.put(
  "/editAvatar/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(editAvatar)
);

sellerRouter.put(
  "/editCover/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(editCover)
);

sellerRouter.put(
  "/editProduct/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(editProduct)
);

sellerRouter.put(
  "/editStory/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(editStory)
);

sellerRouter.put(
  "/editPost/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(editPost)
);

sellerRouter.put(
  "/editComment",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(editComment)
);

sellerRouter.delete(
  "/deleteProduct/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(deleteProduct)
);

sellerRouter.delete(
  "/deleteStory/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(deleteStory)
);

sellerRouter.delete(
  "/deletePost/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(deletePost)
);

sellerRouter.delete(
  "/deleteLike",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(deleteLike)
);

sellerRouter.get(
  "/allSellerProducts/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getSellerProducts)
);

sellerRouter.get(
  "/allStories",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getAllStories)
);

sellerRouter.get(
  "/allStories/me",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getSellerStories)
);

sellerRouter.get(
  "/allPosts/:SellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getAllPosts)
);

sellerRouter.get(
  "/singlePost/:PostId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getSinglePosts)
);

sellerRouter.get(
  "/AllSubCategory",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getAllSubCategory)
);

sellerRouter.post(
  "/orders/all",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getProductOrders)
);

sellerRouter.get(
  "/orders/single/:OrderId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getProductsOrder)
);

sellerRouter.get(
  "/orders/pending",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getPendingProductOrders)
);

sellerRouter.post(
  "/Order/product/accept",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(acceptProductOrder)
);

sellerRouter.post(
  "/Order/product/reject",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(rejectProductOrder)
);

module.exports = sellerRouter;

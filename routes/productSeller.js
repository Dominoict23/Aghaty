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
} = require("../controllers/productSeller");

const errorCatcher = require("../middleware/errorCatcher");

const verifyToken = require("../middleware/verifyToken");

const checkUserAuth = require("../middleware/checkUserAuth");

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

sellerRouter.post("/addLike", errorCatcher(addLike));

sellerRouter.post("/addComment", errorCatcher(addComment));

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

sellerRouter.put("/editComment", errorCatcher(editComment));

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

sellerRouter.delete("/deleteLike", errorCatcher(deleteLike));

sellerRouter.get(
  "/allSellerProducts/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getSellerProducts)
);

sellerRouter.get(
  "/allStories/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getAllStories)
);

sellerRouter.get(
  "/allPosts/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(getAllPosts)
);

module.exports = sellerRouter;

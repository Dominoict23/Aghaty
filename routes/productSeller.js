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

sellerRouter.delete(
  "/deleteProduct/:ProductSellerId",
  verifyToken,
  checkUserAuth("productSeller"),
  errorCatcher(deleteProduct)
);

module.exports = sellerRouter;

const express = require("express");

const sellerRouter = express.Router();

const {
  addService,
  addStory,
  addPost,
  addLike,
  addComment,
  editAvatar,
  editCover,
  editService,
  deleteService,
  editStory,
  editPost,
  editComment,
  deleteStory,
  deletePost,
  deleteLike,
  getSellerServices,
  getAllStories,
  getAllPosts,
  getAllSubCategory,
  getSellerStories,
} = require("../controllers/serviceSeller");

const errorCatcher = require("../middleware/errorCatcher");

const verifyToken = require("../middleware/verifyToken");

const checkUserAuth = require("../middleware/checkUserAuth");

sellerRouter.post(
  "/addService/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(addService)
);

sellerRouter.post(
  "/addStory/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(addStory)
);

sellerRouter.post(
  "/addPost/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(addPost)
);

sellerRouter.post("/addLike", errorCatcher(addLike));

sellerRouter.post("/addComment", errorCatcher(addComment));

sellerRouter.put(
  "/editAvatar/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(editAvatar)
);

sellerRouter.put(
  "/editCover/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(editCover)
);

sellerRouter.put(
  "/editService/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(editService)
);

sellerRouter.put(
  "/editStory/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(editStory)
);

sellerRouter.put(
  "/editPost/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(editPost)
);

sellerRouter.put("/editComment", errorCatcher(editComment));

sellerRouter.delete(
  "/deleteService/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(deleteService)
);

sellerRouter.delete(
  "/deleteStory/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(deleteStory)
);

sellerRouter.delete(
  "/deletePost/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(deletePost)
);

sellerRouter.delete("/deleteLike", errorCatcher(deleteLike));

sellerRouter.get(
  "/allSellerServices/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(getSellerServices)
);

sellerRouter.get(
  "/allStories",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(getAllStories)
);

sellerRouter.get(
  "/allStories/me",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(getSellerStories)
);

sellerRouter.get(
  "/allPosts/:SellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(getAllPosts)
);

sellerRouter.get(
  "/AllSubCategory",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(getAllSubCategory)
);

module.exports = sellerRouter;

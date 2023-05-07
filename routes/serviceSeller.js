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

sellerRouter.delete(
  "/deleteService/:ServiceSellerId",
  verifyToken,
  checkUserAuth("serviceSeller"),
  errorCatcher(deleteService)
);

module.exports = sellerRouter;

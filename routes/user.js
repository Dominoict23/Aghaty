const express = require("express");

const userRouter = express.Router();

const errorCatcher = require("../middleware/errorCatcher");

const verifyToken = require("../middleware/verifyToken");

const checkUserAuth = require("../middleware/checkUserAuth");

const {
  signup,
  editAvatar,
  editCover,
  getAllStories,
  getAllBanners,
  getAllPosts,
  addLike,
  deleteLike,
  editComment,
  addComment,
  getSinglePosts,
  getAllCategory,
  getAllSubCategories,
  getHighRateSellers,
  nearestSellers,
  getProductsBySubId,
  addToCart,
  showCart,
} = require("../controllers/user");

// Auth routers
userRouter.post("/signup", errorCatcher(signup));

// User profile routers
userRouter.patch(
  "/editAvatar",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(editAvatar)
);
userRouter.patch(
  "/editCover",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(editCover)
);

// Story router
userRouter.get(
  "/allStories",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getAllStories)
);

// Banner router
userRouter.get(
  "/allBanners",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getAllBanners)
);

// Post router
userRouter.get(
  "/allPosts",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getAllPosts)
);

userRouter.get(
  "/singlePost/:PostId",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getSinglePosts)
);

// Like routers
userRouter.post(
  "/addLike",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(addLike)
);
userRouter.delete(
  "/deleteLike",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(deleteLike)
);

// Comment routers
userRouter.post(
  "/addComment",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(addComment)
);
userRouter.patch(
  "/editComment",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(editComment)
);

// Category router
userRouter.get(
  "/allCategories",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getAllCategory)
);

// SubCategory router
userRouter.get(
  "/allSubCategories/:CategoryId",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getAllSubCategories)
);

// Sellers router
userRouter.get(
  "/sellers/highestRate/:CategoryId",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getHighRateSellers)
);
userRouter.post(
  "/sellers/nearest/:CategoryId",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(nearestSellers)
);

// Products router
userRouter.get(
  "/products/:SubCategoryId",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getProductsBySubId)
);

// Cart router
userRouter.post(
  "/cart/addProducts",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(addToCart)
);
userRouter.get(
  "/cart/show",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(showCart)
);

module.exports = userRouter;

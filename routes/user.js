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
  getSellerSubCategories,
  decreaseQuantity,
  increaseQuantity,
  deleteCartProduct,
  getSocialMedia,
  createLocation,
  editLocation,
  deleteLocation,
  getLocations,
  createMessage,
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
userRouter.get(
  "/sellerSubCategories/:SellerId",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getSellerSubCategories)
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

// CartProduct routers
userRouter.patch(
  "/cartProduct/decreaseQuantity",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(decreaseQuantity)
);
userRouter.patch(
  "/cartProduct/increaseQuantity",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(increaseQuantity)
);
userRouter.delete(
  "/cartProduct/delete",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(deleteCartProduct)
);

//Social media routers
userRouter.get(
  "/SocialMedia/get",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getSocialMedia)
);

//Message routers
userRouter.post(
  "/Message/create",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(createMessage)
);

// Location routers
userRouter.post(
  "/Location/create",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(createLocation)
);
userRouter.patch(
  "/Location/edit",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(editLocation)
);
userRouter.delete(
  "/Location/delete",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(deleteLocation)
);
userRouter.get(
  "/Location/get",
  verifyToken,
  checkUserAuth("user"),
  errorCatcher(getLocations)
);

module.exports = userRouter;

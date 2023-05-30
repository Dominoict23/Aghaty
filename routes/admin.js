const express = require("express");

const adminRouter = express.Router();

const errorCatcher = require("../middleware/errorCatcher");

const verifyToken = require("../middleware/verifyToken");

const checkUserAuth = require("../middleware/checkUserAuth");

const {
  login,
  addSeller,
  addCategory,
  editSeller,
  deleteSeller,
  editCategory,
  deleteCategory,
  getAllCategory,
  getAllSellers,
  addSubCategory,
  editSubCategory,
  deleteSubCategory,
  getAllSubCategory,
  addDiscountCode,
  editDiscountCode,
  deleteDiscountCode,
  getAllDiscountCode,
  getAllMessages,
  getAllDeliveries,
  addDelivery,
  editDelivery,
  deleteDelivery,
  getAllBanners,
  deleteBanner,
  editBanner,
  addBanner,
  deleteSocialMedia,
  editSocialMedia,
  createSocialMedia,
  getSocialMedia,
} = require("../controllers/admin");

adminRouter.post("/login", errorCatcher(login));

// Sellers requests
adminRouter.post(
  "/addSeller",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(addSeller)
);
adminRouter.patch(
  "/editSeller",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(editSeller)
);
adminRouter.delete(
  "/deleteSeller",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(deleteSeller)
);
adminRouter.get(
  "/allSellers",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getAllSellers)
);

// Category requests
adminRouter.post(
  "/addCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(addCategory)
);
adminRouter.patch(
  "/editCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(editCategory)
);
adminRouter.delete(
  "/deleteCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(deleteCategory)
);
adminRouter.get(
  "/allCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getAllCategory)
);

// SubCategory requests
adminRouter.post(
  "/addSubCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(addSubCategory)
);
adminRouter.patch(
  "/editSubCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(editSubCategory)
);
adminRouter.delete(
  "/deleteSubCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(deleteSubCategory)
);
adminRouter.get(
  "/allSubCategory",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getAllSubCategory)
);

// DiscountCode requests
adminRouter.post(
  "/addDiscountCode",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(addDiscountCode)
);
adminRouter.patch(
  "/editDiscountCode",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(editDiscountCode)
);
adminRouter.delete(
  "/deleteDiscountCode",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(deleteDiscountCode)
);
adminRouter.get(
  "/allDiscountCode",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getAllDiscountCode)
);

// Messages requests
adminRouter.get(
  "/allMessages",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getAllMessages)
);

// Deliveries requests
adminRouter.post(
  "/addDelivery",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(addDelivery)
);
adminRouter.patch(
  "/editDelivery",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(editDelivery)
);
adminRouter.delete(
  "/deleteDelivery",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(deleteDelivery)
);
adminRouter.get(
  "/allDeliveries",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getAllDeliveries)
);

// Banners requests
adminRouter.post(
  "/addBanner",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(addBanner)
);
adminRouter.patch(
  "/editBanner",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(editBanner)
);
adminRouter.delete(
  "/deleteBanner",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(deleteBanner)
);
adminRouter.get(
  "/allBanners",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getAllBanners)
);

// Social Media routers
adminRouter.post(
  "/SocialMedia/create",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(createSocialMedia)
);
adminRouter.patch(
  "/SocialMedia/edit",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(editSocialMedia)
);
adminRouter.delete(
  "/SocialMedia/delete",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(deleteSocialMedia)
);
adminRouter.get(
  "/SocialMedia/get",
  verifyToken,
  checkUserAuth("admin"),
  errorCatcher(getSocialMedia)
);

module.exports = adminRouter;

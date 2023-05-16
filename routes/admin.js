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

module.exports = adminRouter;

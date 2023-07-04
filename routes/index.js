const express = require("express");

const adminRouter = require("./admin");
const userRouter = require("./user");
const productSellerRouter = require("./productSeller");
const serviceSellerRouter = require("./serviceSeller");
const deliveryRouter = require("./delivery");

const login = require("../middleware/login");

const errorCatcher = require("../middleware/errorCatcher");

const router = express.Router();

/* routers */
router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/productSeller", productSellerRouter);
router.use("/serviceSeller", serviceSellerRouter);
router.use("/delivery", deliveryRouter);

router.post("/login", errorCatcher(login));

module.exports = router;

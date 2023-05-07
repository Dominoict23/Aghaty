const express = require("express");

const productSellerRouter = require("./productSeller");
const serviceSellerRouter = require("./serviceSeller");

const login = require("../middleware/login");

// const logout = require("../middleware/logout"); //TODO: later

const errorCatcher = require("../middleware/errorCatcher");

const router = express.Router();

/* routers */
router.use("/productSeller", productSellerRouter);
router.use("/serviceSeller", serviceSellerRouter);

router.post("/login", errorCatcher(login));

module.exports = router;

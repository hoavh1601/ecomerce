const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.route");
const productRoutes = require("./product.route");
// const orderRoutes = require('./order.route');
const statisticRoutes = require("./statistics.route");
const categories = require("./category.route");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
// router.use('/orders', orderRoutes);
router.use("/statistics", statisticRoutes);
router.use("/categories", categories);
const adminRoutes = require("./admin.route");
router.use("/admin", adminRoutes);

module.exports = router;

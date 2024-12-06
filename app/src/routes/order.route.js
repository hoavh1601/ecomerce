const router = require("express").Router();
const {
  authenticate,
  authorize,
  checkOwnership,
} = require("../middleware/auth.middleware");
const orderController = require("../controllers/order.controller");

router.use(authenticate);

router.post("/create", authorize("BUYER"), orderController.createOrder);

router.get("/my-orders", authorize("BUYER"), orderController.getOrders);

router.get("/seller-orders", authorize("SELLER"), orderController.getOrders);

router.put(
  "/:id/status",
  authorize("SELLER"),
  checkOwnership("order"),
  orderController.updateOrderStatus
);

router.get("/all", authorize("ADMIN"), orderController.getOrders);

module.exports = router;

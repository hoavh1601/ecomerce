const router = require("express").Router();
const adminController = require("../controllers/admin.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");

router.use(authenticate, authorize("ADMIN"));

router.get("/users", adminController.getUsers);
router.patch("/users/:id/status", adminController.updateUserStatus);

router.get("/categories", adminController.getCategories);
router.post("/categories", adminController.createCategory);
router.put("/categories/:id", adminController.updateCategory);

router.get("/orders", adminController.getOrders);
router.get("/products", adminController.getProducts);

module.exports = router;

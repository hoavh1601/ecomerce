const router = require("express").Router();
const {
  authenticate,
  authorize,
  checkOwnership,
} = require("../middleware/auth.middleware");
const productController = require("../controllers/product.controller");
const upload = require("../middleware/upload.middleware");

// Public routes
router.get("/", productController.getProducts);
// router.get("/:id", productController.getProduct);

// Protected routes
router.get("/public", productController.getPublicProducts);
router.use(authenticate);

// Routes cho SELLER
router.post(
  "/",
  authorize("SELLER", "ADMIN"),
  upload.array("images", 5),
  productController.createProduct
);

router.put(
  "/:id",
  authorize("SELLER"),
  checkOwnership("product"),
  upload.array("images", 5),
  productController.updateProduct
);

router.delete(
  "/:id",
  authorize("SELLER", "ADMIN"),
  checkOwnership("product"),
  productController.deleteProduct
);

module.exports = router;

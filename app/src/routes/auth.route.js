const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  registerValidation,
  loginValidation,
} = require("../utils/validation.util");
const validate = require("../middleware/validate.middleware");
const { authenticate } = require('../middleware/auth.middleware');

router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

router.post("/login", loginValidation, validate, authController.login);
router.get("/profile", authenticate,  authController.getProfile);
router.put("/profile", authenticate, authController.updateProfile);
router.put("/change-password", authController.changePassword);

module.exports = router;

const router = require("express").Router();
const categoryController = require("../controllers/categories.controller");

router.get("/", categoryController.getCategories);

module.exports = router;

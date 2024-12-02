const catchAsync = require("../utils/catchAsync");
const categoryService = require("../services/category.service");

const categoryController = {
  getCategories: catchAsync(async (req, res) => {
    const result = await categoryService.getCategories();
    console.log("result", result);
    res.json({
      status: "success",
      data: result || [],
      pagination: result.pagination,
    });
  }),
};

module.exports = categoryController;

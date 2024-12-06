const catchAsync = require("../utils/catchAsync");
const productService = require("../services/product.service");

const productController = {
  createProduct: catchAsync(async (req, res) => {
    const sellerId = req.user._id;
    const product = await productService.createProduct(
      sellerId,
      req.body,
      Array.from(req.files)
    );
    res.status(201).json({
      status: "success",
      data: product,
    });
  }),

  getProducts: catchAsync(async (req, res) => {
    const result = await productService.getProducts(
      req.query,
      req.query?.sellerId
    );
    res.json({
      status: "success",
      data: result.data || [],
      pagination: result.pagination,
    });
  }),

  getProduct: catchAsync(async (req, res) => {
    res.json({
      status: "success",
      data: product,
    });
  }),

  updateProduct: catchAsync(async (req, res) => {
    const { id } = req.params;
    const product = await productService.updateProduct(id, req.body, req.files);

    res.json({
      status: "success",
      data: product,
    });
  }),

  deleteProduct: catchAsync(async (req, res) => {
    const { id } = req.params;
    const sellerId = req.user.id;
    const result = await productService.deleteProduct(id, sellerId);

    res.json({
      status: "success",
      message: result.message,
    });
  }),

  getSellerProducts: catchAsync(async (req, res) => {
    const sellerId = req.user.id;
    const result = await productService.getSellerProducts(sellerId, req.query);

    res.json({
      status: "success",
      data: result.products,
      pagination: result.pagination,
    });
  }),

  getPublicProducts: async (req, res) => {
    try {
      const products = await productService.getPublicProducts(req.query);
      res.json({
        status: "success",
        ...products,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = productController;

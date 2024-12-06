// src/controllers/admin.controller.js
const AdminService = require("../services/admin.service");

const adminController = {
  // Users
  getUsers: async (req, res) => {
    try {
      const users = await AdminService.getUsers(req.query);
      res.json({
        status: "success",
        ...users,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  getProducts: async (req, res) => {
    try {
      const products = await AdminService.getProducts(req.query);
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

  updateUserStatus: async (req, res) => {
    try {
      const user = await AdminService.updateUserStatus(
        req.params.id,
        req.body.status
      );
      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Categories
  getCategories: async (req, res) => {
    try {
      const categories = await AdminService.getCategories();
      res.json({
        status: "success",
        data: categories,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  createCategory: async (req, res) => {
    try {
      const category = await AdminService.createCategory(req.body);
      res.status(201).json({
        status: "success",
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const category = await AdminService.updateCategory(
        req.params.id,
        req.body
      );
      res.json({
        status: "success",
        data: category,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  // Orders
  getOrders: async (req, res) => {
    try {
      const orders = await AdminService.getOrders(req.query);
      res.json({
        status: "success",
        ...orders,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = adminController;

const OrderService = require("../services/order.service");

const orderController = {
  createOrder: async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        userId: req.user._id,
      };
      const order = await OrderService.createOrder(orderData);
      res.status(201).json({
        status: "success",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  getOrders: async (req, res) => {
    try {
      const orders = await OrderService.getOrders(
        req.user._id,
        req.user.role,
        req.query
      );
      res.json({
        status: "success",
        data: orders,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const order = await OrderService.updateOrderStatus(
        req.params.id,
        req.body.status,
        req.user._id,
        req.user.role
      );
      res.json({
        status: "success",
        data: order,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = orderController;

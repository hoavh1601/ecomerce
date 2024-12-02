const StatisticsService = require("../services/statistics.service");

const statisticsController = {
  getDashboard: async (req, res) => {
    try {
      const stats = await StatisticsService.getDashboardStats();
      res.json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  getRevenueStats: async (req, res) => {
    try {
      const stats = await StatisticsService.getRevenueStats(req.query.period);
      res.json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  getTopProducts: async (req, res) => {
    try {
      const products = await StatisticsService.getTopProducts(
        parseInt(req.query.limit) || 10
      );
      res.json({
        status: "success",
        data: products,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = statisticsController;

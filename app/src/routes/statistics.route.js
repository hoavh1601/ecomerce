const router = require('express').Router();
const statisticsController = require('../controllers/statistics.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/dashboard', statisticsController.getDashboard);
router.get('/revenue', statisticsController.getRevenueStats);
router.get('/top-products', statisticsController.getTopProducts);

module.exports = router;
const router = require('express').Router();
const { authenticate, authorize, checkOwnership } = require('../middleware/auth.middleware');
const orderController = require('../controllers/order.controller');

router.use(authenticate);

// Routes cho BUYER
router.post('/',
    authorize('BUYER'),
    orderController.createOrder
);

router.get('/my-orders',
    authorize('BUYER'),
    orderController.getOrders
);

// Routes cho SELLER
router.get('/seller-orders',
    authorize('SELLER'),
    orderController.getSellerOrders
);

router.put('/:id/status',
    authorize('SELLER'),
    checkOwnership('order'),
    orderController.updateOrderStatus
);

// Routes cho ADMIN
router.get('/all',
    authorize('ADMIN'),
    orderController.getAllOrders
);

module.exports = router;
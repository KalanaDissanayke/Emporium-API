const express = require('express');
const { getOrders, getOrder, createOrder } = require('../controllers/orders');

const Order = require('../models/Order');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(protect, authorize('admin'), advancedResults(Order, 'cart'), getOrders);

router.route('/:id').get(protect, authorize('admin'), getOrder);

router.route('/payhere/notify').post(createOrder);

module.exports = router;

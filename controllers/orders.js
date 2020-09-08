const Order = require('../models/Order');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc            Get all orders
// @route           GET /api/v1/orders
// @access          Private
exports.getOrders = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @desc            Get single order
// @route           GET /api/v1/order/:id
// @access          Private
exports.getOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('cart');

    if (!order) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: order });
});

// @desc            Process payhere notification and create order
// @route           POST /api/v1/orders/payhere/notify
// @access          Public
exports.createOrder = asyncHandler(async (req, res, next) => {
    const { order_id, payment_id, payhere_amount, payhere_currency, status_code, md5sig } = req.body;

    if (status_code !== '2' || !md5sig) {
        return next(new ErrorResponse(`Payment Failure`, 422));
    }

    await Order.create({
        transactionId: payment_id,
        amount: parseFloat(payhere_amount),
        currency: payhere_currency,
        cart: order_id,
    });

    res.status(200).json({ success: true, data: {} });
});

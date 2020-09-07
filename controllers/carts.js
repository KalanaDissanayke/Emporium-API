const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc      Get carts
// @route     GET /api/v1/carts
// @access    Public
exports.getCarts = asyncHandler(async (req, res, next) => {
    if (req.user.role === 'admin') {
        return res.status(200).json(res.advancedResults);
    }

    // Check for user carts
    const userCarts = await Cart.find({ user: req.user.id, status: 'IN PROGRESS' }).populate({
        path: 'products.product',
        select: 'name description photo unitPrice',
    });

    res.status(200).json({
        success: true,
        count: userCarts.length,
        data: userCarts,
    });
});

// @desc      Get single cart
// @route     GET /api/v1/carts/:id
// @access    Public
exports.getCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findById(req.params.id).populate({
        path: 'products.product',
        select: 'name description',
    });

    if (!cart) {
        return next(new ErrorResponse(`No cart found with the id of ${req.params.id}`, 404));
    }

    // Make sure cart belongs to user or user is admin
    if (cart.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to access cart`, 401));
    }

    res.status(200).json({
        success: true,
        data: cart,
    });
});

// @desc      Add cart
// @route     POST /api/v1/carts
// @access    Private
exports.addCart = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    // Check for user carts
    const userCarts = await Cart.findOne({ user: req.user.id, status: 'IN PROGRESS' });

    // If the user is not an admin, they can only have one IN PROGRESS cart
    if (userCarts && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`The user with ID ${req.user.id} already have a cart with the status 'IN PROGRESS'`, 400),
        );
    }

    const productIds = Array.from(req.body.products).map((p) => p.product);
    let products = await Product.find({ _id: { $in: productIds } }).select('stock.quantity unitPrice');

    if (productIds.length !== products.length) {
        return next(new ErrorResponse(`Cannot find the products`, 404));
    }

    const productsWithStockCheck = Array.from(req.body.products).map((p) => {
        const dbProduct = products.find((product) => p.product == product._id);
        p.remainingQty = dbProduct ? dbProduct.stock.quantity - p.quantity : 0;
        p.subTotal = dbProduct ? dbProduct.unitPrice * p.quantity : 0;
        console.log(dbProduct);
        return p;
    });

    if (
        Math.min.apply(
            null,
            productsWithStockCheck.map((p) => p.remainingQty),
        ) < 1
    ) {
        return next(new ErrorResponse(`Stock is not enough`, 400));
    }

    const cart = await Cart.create(req.body);

    res.status(201).json({
        success: true,
        data: cart,
    });
});

// @desc      Update cart
// @route     PUT /api/v1/carts/:id
// @access    Private
exports.updateCart = asyncHandler(async (req, res, next) => {
    let cart = await Cart.findById(req.params.id);

    if (!cart) {
        return next(new ErrorResponse(`No cart with the id of ${req.params.id}`, 404));
    }

    // Make sure cart belongs to user or user is admin
    if (cart.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update cart`, 401));
    }

    const productIds = Array.from(req.body.products).map((p) => p.product);
    let products = await Product.find({ _id: { $in: productIds } }).select('stock.quantity unitPrice');

    if (productIds.length !== products.length) {
        return next(new ErrorResponse(`Cannot find the products`, 404));
    }

    const productsWithStockCheck = Array.from(req.body.products).map((p) => {
        const dbProduct = products.find((product) => p.product == product._id);
        p.remainingQty = dbProduct ? dbProduct.stock.quantity - p.quantity : 0;
        p.subTotal = dbProduct ? dbProduct.unitPrice * p.quantity : 0;
        console.log(dbProduct);
        return p;
    });

    if (
        Math.min.apply(
            null,
            productsWithStockCheck.map((p) => p.remainingQty),
        ) < 1
    ) {
        return next(new ErrorResponse(`Stock is not enough`, 400));
    }

    cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    cart.save();

    res.status(200).json({
        success: true,
        data: cart,
    });
});

// @desc      Delete cart
// @route     DELETE /api/v1/carts/:id
// @access    Private
exports.deleteCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findById(req.params.id);

    if (!cart) {
        return next(new ErrorResponse(`No cart with the id of ${req.params.id}`, 404));
    }

    // Make sure cart belongs to user or user is admin
    if (cart.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update cart`, 401));
    }

    await cart.remove();

    res.status(200).json({
        success: true,
        data: {},
    });
});

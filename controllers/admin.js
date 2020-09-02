const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc            Get all products
// @route           GET /api/v1/admin/products
// @route           GET /api/v1/categories/:categoryId/admin/products
// @access          Private
exports.getProducts = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId) {
        const products = await Product.find({ category: req.params.categoryId });

        res.status(200).json({ success: true, count: products.length, data: products });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc            Get single products
// @route           GET /api/v1/admin/products/:id
// @access          Private
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: product });
});

// @desc            Update product
// @route           PUT /api/v1/admin/products/:id
// @access          Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!product) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: product });
});

// @desc            Delete product
// @route           DELETE /api/v1/admin/products/:id
// @access          Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: {} });
});


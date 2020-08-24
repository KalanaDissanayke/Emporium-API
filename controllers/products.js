const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc            Get all products
// @route           GET /api/v1/products
// @access          Public
exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc            Get single products
// @route           GET /api/v1/products/:id
// @access          Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc            Create new product
// @route           POST /api/v1/products
// @access          Private
exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc            Update product
// @route           PUT /api/v1/products/:id
// @access          Private
exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!product) {
            return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc            Delete product
// @route           DELETE /api/v1/products/:id
// @access          Private
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

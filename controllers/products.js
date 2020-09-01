const path = require('path');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc            Get all products
// @route           GET /api/v1/products
// @route           GET /api/v1/categories/:categoryId/products
// @access          Public
exports.getProducts = asyncHandler(async (req, res, next) => {
    if (req.params.categoryId) {
        const products = await Product.find({ category: req.params.categoryId });

        res.status(200).json({ success: true, count: products.length, data: products });
    } else {
        res.status(200).json(res.advancedResults);
    }
});

// @desc            Get single products
// @route           GET /api/v1/products/:id
// @access          Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({ success: true, data: product });
});

// @desc            Create new product
// @route           POST /api/v1/categories/:categoryId/products
// @access          Private
exports.createProduct = asyncHandler(async (req, res, next) => {
    req.body.category = req.params.categoryId;
    req.body.user = req.user.id;

    const category = await Category.findById(req.params.categoryId);

    if (!category) {
        return next(new ErrorResponse(`No category with the id of ${req.params.id}`, 404));
    }

    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
});

// @desc            Update product
// @route           PUT /api/v1/products/:id
// @access          Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, data: product });
});

// @desc            Delete product
// @route           DELETE /api/v1/products/:id
// @access          Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
    }

    await product.remove();

    res.status(200).json({ success: true, data: {} });
});

// @desc            Upload photo for product
// @route           PUT /api/v1/products/:id/photo
// @access          Private
exports.productPhotoUpload = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404));
    }

    // Make sure user is product owner
    if (product.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this product`, 401));
    }

    if (!req.files) {
        return next(new ErrorResponse(`Please upload a file`, 400));
    }

    const file = req.files.file;

    // Validate file is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD / 1000000} MB`, 400),
        );
    }

    // Create custom file name
    file.name = `photo_${product._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }

        await Product.findByIdAndUpdate(req.params.id, { photo: file.name });

        res.status(200).json({ success: true, data: file.name });
    });
});

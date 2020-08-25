const Category = require('../models/Category');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc            Get all categories
// @route           GET /api/v1/categories
// @access          Public
exports.getCategories = asyncHandler(async (req, res, next) => {
    let query;

    query = Category.find();

    const categories = await query;

    res.status(200).json({ success: true, count: categories.length, data: categories });
});

const express = require('express');
const {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categories');

const Category = require('../models/Category');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const productsRouter = require('./products');

const router = express.Router();

// Re-route into other resource routers
router.use('/:categoryId/products', productsRouter);

router.route('/').get(advancedResults(Category, 'products'), getCategories).post(createCategory);

router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory);

module.exports = router;

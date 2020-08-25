const express = require('express');
const { getCategories, getCategory, createCategory } = require('../controllers/categories');

// Include other resource routers
const productsRouter = require('./products');

const router = express.Router();

// Re-route into other resource routers
router.use('/:categoryId/products', productsRouter);

router.route('/').get(getCategories).post(createCategory);

router.route('/:id').get(getCategory);

module.exports = router;

const express = require('express');
const { getCarts, getCart, addCart, updateCart, deleteCart } = require('../controllers/carts');

const Cart = require('../models/Cart');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(
        protect,
        authorize('admin'),
        advancedResults(Cart, {
            path: 'products.product',
            select: 'name description',
        }),
        getCarts,
    )
    .post(protect, authorize('user', 'admin'), addCart);

router
    .route('/:id')
    .get(protect, authorize('user', 'admin'), getCart)
    .put(protect, authorize('user', 'admin'), updateCart)
    .delete(protect, authorize('user', 'admin'), deleteCart);

module.exports = router;

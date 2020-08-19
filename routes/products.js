const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');

const router = express.Router();



router.route('/')
/**
 * @swagger
 * path:
 *  /api/v1/products:
 *    get:
 *      summary: Get all products
 *      tags: [Products]
 *      responses:
 *        "200":
 *          description: An array of products
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 */
.get(getProducts)

/**
 * @swagger
 * path:
 *  /api/v1/products:
 *    post:
 *      summary: Create a new product
 *      tags: [Products]
 *      responses:
 *        "201":
 *          description: An product object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/Product'
 */
.post(createProduct);

router.route('/:id').get(getProduct).put(updateProduct).delete(deleteProduct);

module.exports = router;

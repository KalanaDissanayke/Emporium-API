const express = require('express');
const {
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/admin');

const Product = require('../models/Product');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    /**
     * @swagger
     * path:
     *  /admin/products:
     *    get:
     *      summary: Get all products
     *      tags: [Admin]
     *      responses:
     *        "200":
     *          description: An array of products
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Product'
     */
    .get(advancedResults(Product, { path: 'category', select: 'name slug' }), getProducts)

router
    .route('/:id')

    /**
     * @swagger
     * path:
     *  /admin/products/{id}:
     *    get:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the product to get details
     *      summary: Get product by id
     *      tags: [Admin]
     *      responses:
     *         "200":
     *           description: A product
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
    .get(getProduct)

    /**
     * @swagger
     * path:
     *  /admin/products/{id}:
     *    put:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the product to update
     *      requestBody:
     *        required: true
     *        content:
     *         application/json:
     *          schema:
     *            $ref: '#/components/schemas/Product'
     *      summary: update product by id
     *      tags: [Admin]
     *      responses:
     *         "200":
     *           description: A product
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
    .put(protect, authorize('admin'), updateProduct)

    /**
     * @swagger
     * path:
     *  /admin/products/{id}:
     *    delete:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the product to delete
     *      summary: delete product by id
     *      tags: [Admin]
     *      responses:
     *         "200":
     *           description: A product
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
    .delete(protect, authorize('admin'), deleteProduct);

module.exports = router;

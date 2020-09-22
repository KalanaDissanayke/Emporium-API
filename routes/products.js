const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    productPhotoUpload,
} = require('../controllers/products');

const Product = require('../models/Product');
const advancedResults = require('../middleware/advancedResults');

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const reviewsRouter = require('./reviews');

const router = express.Router({ mergeParams: true });

// Re-route into other resource routers
router.use('/:productId/reviews', reviewsRouter);

router
    .route('/')
    /**
     * @swagger
     * path:
     *  /products:
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
    .get(advancedResults(Product, { path: 'category', select: 'name slug' }), getProducts)

    /**
     * @swagger
     * path:
     *  /products:
     *    post:
     *      requestBody:
     *        required: true
     *        content:
     *         application/json:
     *          schema:
     *            $ref: '#/components/schemas/Product'
     *      summary: Create a new product
     *      tags: [Products]
     *      security:
     *          - bearerAuth: []
     *      responses:
     *        "201":
     *          description: An product object
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Product'
     */
    .post(protect, authorize('seller', 'admin'), createProduct);

router
    .route('/:id')

    /**
     * @swagger
     * path:
     *  /products/{id}:
     *    get:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the product to get details
     *      summary: Get product by id
     *      tags: [Products]
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
     *  /products/{id}:
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
     *      tags: [Products]
     *      security:
     *          - bearerAuth: []
     *      responses:
     *         "200":
     *           description: A product
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
    .put(protect, authorize('seller', 'admin'), updateProduct)

    /**
     * @swagger
     * path:
     *  /products/{id}:
     *    delete:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the product to delete
     *      summary: delete product by id
     *      tags: [Products]
     *      security:
     *          - bearerAuth: []
     *      responses:
     *         "200":
     *           description: A product
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
    .delete(protect, authorize('seller', 'admin'), deleteProduct);

router
    .route('/:id/photo')
    /**
     * @swagger
     * path:
     *  /products/{id}/photo:
     *    put:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the product to upload image
     *       - in: formdata
     *         name: file
     *         schema:
     *             type: file
     *         required: true
     *         description: image to upload
     *      summary: Upload image for the product
     *      tags: [Products]
     *      security:
     *          - bearerAuth: []
     *      responses:
     *         "200":
     *           description: image uploaded
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
    .put(protect, authorize('seller', 'admin'), productPhotoUpload);

module.exports = router;

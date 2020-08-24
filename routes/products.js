const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/products');

const router = express.Router();

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
    .get(getProducts)

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
     *      responses:
     *        "201":
     *          description: An product object
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/Product'
     */
    .post(createProduct);

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
     *      responses:
     *         "200":
     *           description: A product
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
   .put(updateProduct)
   
    /**
     * @swagger
     * path:
     *  /products/{id}:
     *    delete:
     *      parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         description: Id of the product to delete
     *      summary: delete product by id
     *      tags: [Products]
     *      responses:
     *         "200":
     *           description: A product
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/Product'
     */
   .delete(deleteProduct);

module.exports = router;

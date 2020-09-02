const express = require('express');
const { getUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/users');

const User = require('../models/User');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    /**
     * @swagger
     * path:
     *  /users:
     *    get:
     *      summary: Get all users
     *      tags: [Users]
     *      responses:
     *        "200":
     *          description: Users
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/User'
     */
    .get(advancedResults(User), getUsers)

    /**
     * @swagger
     * path:
     *  /users:
     *    post:
     *      requestBody:
     *        required: true
     *        content:
     *         application/json:
     *          schema:
     *            $ref: '#/components/schemas/User'
     *      summary: Create a new user
     *      tags: [Users]
     *      responses:
     *        "201":
     *          description: An user object
     *          content:
     *            application/json:
     *              schema:
     *                $ref: '#/components/schemas/User'
     */
    .post(createUser);

router
    .route('/:id')
    /**
     * @swagger
     * path:
     *  /users/{id}:
     *    get:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the user to get details
     *      summary: Get user by id
     *      tags: [Users]
     *      responses:
     *         "200":
     *           description: A user
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/User'
     */
    .get(getUser)
    
    /**
     * @swagger
     * path:
     *  /users/{id}:
     *    put:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the user to update
     *      requestBody:
     *        required: true
     *        content:
     *         application/json:
     *          schema:
     *            $ref: '#/components/schemas/User'
     *      summary: update user by id
     *      tags: [Users]
     *      responses:
     *         "200":
     *           description: A user
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/User'
     */
    .put(updateUser)
    
    /**
     * @swagger
     * path:
     *  /users/{id}:
     *    delete:
     *      parameters:
     *       - in: path
     *         name: id
     *         schema:
     *             type: string
     *         required: true
     *         description: Id of the user to delete
     *      summary: delete user by id
     *      tags: [Users]
     *      responses:
     *         "200":
     *           description: A user
     *           content:
     *             application/json:
     *               schema:
     *                 $ref: '#/components/schemas/User'
     */
    .delete(deleteUser);

module.exports = router;

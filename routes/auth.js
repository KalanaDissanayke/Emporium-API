const express = require('express');
const {
    register,
    login,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword,
    socialLogin,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/register');
/**
 * @swagger
 * path:
 *  /auth/register:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *      summary: register
 *      tags: [Auth]
 *      responses:
 *        "200":
 *          description: user object
 *          content:
 *            application/json:
 *            schema:
 *              bearerAuth:
 *                 type: http
 *                 scheme: bearer
 *                 bearerFormat: JWT
 */
router.post('/register', register);

router.route('/login');
/**
 * @swagger
 * path:
 *  /auth/login:
 *    post:
 *      requestBody:
 *        required: true
 *        content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *      summary: login
 *      tags: [Auth]
 *      responses:
 *        "200":
 *          description: user object
 *          content:
 *            application/json:
 *              schema:
 *               bearerAuth:
 *                 type: http
 *                 scheme: bearer
 *                 bearerFormat: JWT
 */
router.post('/login', login);

router.route('/me');
/**
 * @swagger
 * path:
 *  /auth/me:
 *    get:
 *      summary:
 *      tags: [Auth]
 *      responses:
 *        "200":
 *          description: logged in user details
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router.get('/me', protect, getMe);

router.post('/social', socialLogin);

router.get('/logout', logout);

router.put('/updatedetails', protect, updateDetails);

router.put('/updatepassword', protect, updatePassword);

router.post('/forgotpassword', forgotPassword);

router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for user authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       description: User registration data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterData'
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Invalid registration data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginData'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid login credentials
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/token:
 *   get:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { register, login, logout } = require('../controllers/auth');
const { refreshToken } = require('../controllers/refresh-token');

// Route untuk register
router.post('/register', register);

// Route untuk login
router.post('/login', login);

// Route untuk logout
router.post('/logout', authenticate, logout);

// Route untuk refresh token
router.get('/token', refreshToken);

module.exports = router;

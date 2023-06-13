/**
 * @swagger
 * tags:
 *   name: Default
 *   description: Default API endpoint
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get default route
 *     tags: [Default]
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const { defaultRoute } = require('../controllers/default');

// Route untuk default
router.get('/', defaultRoute);

module.exports = router;

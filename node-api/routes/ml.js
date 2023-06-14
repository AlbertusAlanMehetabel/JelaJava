/**
 * @swagger
 * tags:
 *   name: Machine Learning
 *   description: API endpoints for machine learning operations
 */

/**
 * @swagger
 * /api/ml/recommendation:
 *   post:
 *     summary: Get machine learning recommendations
 *     tags: [Machine Learning]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rec_n:
 *                 type: number
 *                 description: Number of recommendations (optional)
 *             example:
 *               rec_n: 5
 *     responses:
 *       200:
 *         description: Recommendations retrieved successfully
 *       400:
 *         description: Bad request, invalid payload
 *       404:
 *         description: User not found or no recommendations available
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/ml/filter:
 *   post:
 *     summary: Filter data based on city
 *     tags: [Machine Learning]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               city:
 *                 type: string
 *                 description: City name
 *             example:
 *               city: Jakarta
 *     responses:
 *       200:
 *         description: Data filtered successfully
 *       400:
 *         description: Bad request, missing or invalid payload
 *       404:
 *         description: Data not found
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { recommendation, filter } = require('../controllers/ml');

// Route untuk mendapatkan rekomendasi machine learning
router.post('/recommendation', authenticate, recommendation);

// Route untuk memfilter berdasarkan kota
router.post('/filter', authenticate, filter);

module.exports = router;

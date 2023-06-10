/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: API endpoints for weather information
 */

/**
 * @swagger
 * /weather:
 *   get:
 *     summary: Get weather information
 *     tags: [Weather]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Weather information retrieved successfully
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getWeather } = require('../controllers/weather');

// Route untuk mendapatkan cuaca
router.get('/', authenticate, getWeather);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: API endpoints for weather information
 */

/**
 * @swagger
 * /api/weather:
*   get:
 *     summary: Get weather data
 *     tags: [Weather]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         description: City name for weather data
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weather data retrieved successfully
 *       400:
 *         description: Bad request, missing city parameter
 *       404:
 *         description: Weather data not found
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

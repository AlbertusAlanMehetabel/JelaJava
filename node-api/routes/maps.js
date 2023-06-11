/**
 * @swagger
 * tags:
 *   name: Maps
 *   description: API endpoints for maps and geocoding
 */

/**
 * @swagger
 * /api/maps:
 *   get:
 *     summary: Get geocoding data
 *     tags: [Maps]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         description: Address for geocoding
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Geocoding data retrieved successfully
 *       400:
 *         description: Bad request, missing address parameter
 *       404:
 *         description: Geocoding data not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/maps/routes:
 *   get:
 *     summary: Get routes from origin to destination
 *     tags: [Maps]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         description: Origin location
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         required: true
 *         description: Destination location
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Routes retrieved successfully
 *       404:
 *         description: Routes not found
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getMaps, getRoutes } = require('../controllers/maps');

// Route untuk mendapatkan data dari Geocoding
router.get('/', authenticate, getMaps);

// Route untuk mendapatkan berbagai rute dari Directions
router.get('/routes', authenticate, getRoutes)

module.exports = router;

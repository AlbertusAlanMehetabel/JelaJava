/**
 * @swagger
 * tags:
 *   name: Maps
 *   description: API endpoints for maps and geocoding
 */

/**
 * @swagger
 * /maps:
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

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { getMaps } = require('../controllers/maps');

// Route untuk mendapatkan data dari Geocoding
router.get('/', authenticate, getMaps);

// BELUM BERES

// Route untuk mendapatkan informasi tempat
router.get('/place/:place');

// Route untuk mendapatkan direction
router.get('/dir/:start_point/:end_point');

// Route untuk mendapatkan rekomendasi kendaraan
router.get('/');

module.exports = router;

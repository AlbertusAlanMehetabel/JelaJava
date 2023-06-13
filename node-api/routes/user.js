/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for user profile
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       500:
 *         description: Internal server error
 *
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete user account
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { updateUser, deleteUser, showUserProfile } = require('../controllers/user');

// Route untuk mendapatkan profil pengguna
router.get('/profile', authenticate, showUserProfile);

// Route untuk memperbarui profil pengguna
router.put('/profile', authenticate, updateUser);

// Route untuk menghapus akun pengguna
router.delete('/profile', authenticate, deleteUser);

module.exports = router;

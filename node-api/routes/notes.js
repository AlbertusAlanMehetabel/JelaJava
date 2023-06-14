/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API endpoints for user notes
 */

/**
 * @swagger
 * /user/notes:
 *   get:
 *     summary: Get user notes
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User notes retrieved successfully
 *       500:
 *         description: Internal server error
 *
 *   post:
 *     summary: Create a new user note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: User note created successfully
 *       400:
 *         Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/notes/{id}:
 *   put:
 *     summary: Update a user note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: User note updated successfully
 *       404:
 *         description: Note not found or user does not own the note
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a user note
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User note deleted successfully
 *       404:
 *         description: Note not found or user does not own the note
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /user/notes/search:
 *   post:
 *     summary: Search user notes by title or content
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               q:
 *                 type: string
 *                 description: Search query
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const { createNote, updateNote, deleteNote, getAllNotes, searchNotes } = require('../controllers/notes');

// Route untuk mendapatkan catatan pengguna
router.get('/', authenticate, getAllNotes);

// Route untuk membuat catatan pengguna
router.post('/', authenticate, createNote);

// Route untuk memperbarui catatan pengguna
router.put('/:id', authenticate, updateNote);

// Route untuk menghapus catatan pengguna
router.delete('/:id', authenticate, deleteNote);

// Route untuk mencari catatan pengguna
router.post('/search', authenticate, searchNotes);

module.exports = router;

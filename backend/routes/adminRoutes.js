const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { createEvent, editEvent, deleteEvent, getUsers, updateUser, deleteUser } = require('../controllers/adminController');

const router = express.Router();

// Event management routes
router.post('/events', authenticateToken, isAdmin, createEvent);
router.put('/events/:id', authenticateToken, isAdmin, editEvent);
router.delete('/events/:id', authenticateToken, isAdmin, deleteEvent);

// User management routes
router.get('/users', authenticateToken, isAdmin, getUsers);
router.put('/users/:id', authenticateToken, isAdmin, updateUser);
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;
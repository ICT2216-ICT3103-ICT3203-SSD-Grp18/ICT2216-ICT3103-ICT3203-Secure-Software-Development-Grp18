const express = require('express');
const { authenticateToken, isAdminDashboardUser } = require('../middleware/authMiddleware');
const { register, getMetrics, createEvent, updateEvent, deleteEvent, getEvents, searchEvents, getUsers, searchUsers, updateUserStatus, updateUserRole, deleteUser } = require('../controllers/adminController');
const multer = require('multer');

// Define storage for the images
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const router = express.Router();

// Admin Dashboard Routes
router.get('/metrics', authenticateToken, isAdminDashboardUser, getMetrics);

// Admin Routes
router.post('/users', authenticateToken, isAdminDashboardUser, register);

// Event Staff Routes
router.post('/events', authenticateToken, isAdminDashboardUser, upload.single('image'), createEvent);
router.put('/events/:id', authenticateToken, isAdminDashboardUser, upload.single('image'), updateEvent);
router.delete('/events/:id', authenticateToken, isAdminDashboardUser, deleteEvent);

// Customer Support Routes
router.get('/users', authenticateToken, isAdminDashboardUser, getUsers);
router.get('/users/search', authenticateToken, isAdminDashboardUser, searchUsers);

// Common Routes
router.get('/events', authenticateToken, getEvents);
router.get('/events/search', authenticateToken, searchEvents);

module.exports = router;

const express = require('express');
const { authenticateToken, isAdminDashboardUser } = require('../middleware/authMiddleware');
const { register, getMetrics, createEvent, updateEvent, deleteEvent, getEvents, searchEvents, getUsers, searchUsers, updateUserStatus, updateUserRole, deleteUser } = require('../controllers/adminController');
const multer = require('multer');
const csrfProtection = require('csurf')({ cookie: true });

// Define storage for the images
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

const router = express.Router();

// Admin Dashboard Routes
router.get('/metrics', authenticateToken, isAdminDashboardUser, csrfProtection, getMetrics);

// Admin Routes
router.post('/users', authenticateToken, isAdminDashboardUser, csrfProtection, register);

// Event Staff Routes
router.post('/events', authenticateToken, isAdminDashboardUser, csrfProtection, upload.single('image'), createEvent);
router.put('/events/:id', authenticateToken, isAdminDashboardUser, csrfProtection, upload.single('image'), updateEvent);
router.delete('/events/:id', authenticateToken, isAdminDashboardUser, csrfProtection, deleteEvent);

// Customer Support Routes
router.get('/users', authenticateToken, csrfProtection, isAdminDashboardUser, getUsers);
router.get('/users/search', authenticateToken, csrfProtection, isAdminDashboardUser, searchUsers);

// Common Routes
router.get('/events', authenticateToken, csrfProtection, getEvents);
router.get('/events/search', authenticateToken, csrfProtection, searchEvents);

module.exports = router;

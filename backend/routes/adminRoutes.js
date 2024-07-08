const express = require('express');
const { authenticateToken, isAdminDashboardUser } = require('../middleware/authMiddleware');
const { register,getMetrics, createEvent, updateEvent, deleteEvent, getEvents,searchEvents, getUsers, searchUsers, updateUserStatus, updateUserRole, deleteUser } = require('../controllers/adminController');
const multer = require('multer');
const csrfProtection = require('csurf')({ cookie: true });

// Define storage for the images
const storage = multer.memoryStorage(); // or configure as needed
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // limit to 50MB

const router = express.Router();

// Event management routes
router.post('/events', authenticateToken, isAdminDashboardUser, upload.single('image'), (req, res, next) => {
  console.log('Request received:', req.body);
  console.log('File received:', req.file);
  next();
}, createEvent);

// User management routes
router.get('/users', authenticateToken, isAdminDashboardUser, csrfProtection, getUsers);
router.get('/users/search', authenticateToken, isAdminDashboardUser, csrfProtection, searchUsers);
router.put('/users/:id/status', authenticateToken, isAdminDashboardUser, csrfProtection, updateUserStatus);
router.put('/users/:id/role', authenticateToken, isAdminDashboardUser, csrfProtection, updateUserRole);
router.delete('/users/:id', authenticateToken, isAdminDashboardUser, csrfProtection,  deleteUser);

// Event management routes
router.post('/events', authenticateToken, isAdminDashboardUser, upload.single('image'), csrfProtection, createEvent);
router.get('/events', authenticateToken, csrfProtection, getEvents);
router.get('/events/search', authenticateToken, isAdminDashboardUser, csrfProtection, searchEvents); // Ensure this is correct
router.put('/events/:id', authenticateToken, isAdminDashboardUser, csrfProtection, upload.none(), updateEvent);
router.delete('/events/:id', authenticateToken, isAdminDashboardUser, csrfProtection, deleteEvent);

// Common routes
router.get('/metrics', authenticateToken, isAdminDashboardUser, csrfProtection, getMetrics);
router.post('/users', authenticateToken, isAdminDashboardUser, csrfProtection, register);

module.exports = router;

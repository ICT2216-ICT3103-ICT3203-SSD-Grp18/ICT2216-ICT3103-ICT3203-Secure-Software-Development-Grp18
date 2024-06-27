const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { register,getMetrics, createEvent, updateEvent, deleteEvent, getEvents,searchEvents, getUsers, searchUsers, updateUserStatus, updateUserRole, deleteUser } = require('../controllers/adminController');
const multer = require('multer');

// Define storage for the images
const storage = multer.memoryStorage(); // or configure as needed
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // limit to 50MB

const router = express.Router();

// Event management routes
router.post('/events', authenticateToken, isAdmin, upload.single('image'), (req, res, next) => {
  console.log('Request received:', req.body);
  console.log('File received:', req.file);
  next();
}, createEvent);


// User management routes
router.get('/users', authenticateToken, isAdmin, getUsers);
router.get('/users/search', authenticateToken, isAdmin, searchUsers); // Ensure this is correct
router.put('/users/:id/status', authenticateToken, isAdmin, updateUserStatus);
router.put('/users/:id/role', authenticateToken, isAdmin, updateUserRole);
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

// Event management routes
router.post('/events', authenticateToken, isAdmin, upload.single('image'), createEvent);
router.get('/events', authenticateToken, getEvents);
router.get('/events/search', authenticateToken, isAdmin, searchEvents); // Ensure this is correct
router.put('/events/:id', authenticateToken, isAdmin, upload.single('image'), updateEvent);
router.delete('/events/:id', authenticateToken, isAdmin, deleteEvent);

router.get('/metrics', authenticateToken, isAdmin, getMetrics);

router.post('/users', authenticateToken, isAdmin, register);


module.exports = router;

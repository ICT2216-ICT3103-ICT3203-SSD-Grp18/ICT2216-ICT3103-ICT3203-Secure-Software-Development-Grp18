const express = require('express');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { createEvent, editEvent, deleteEvent, getUsers, updateUser, deleteUser } = require('../controllers/adminController');
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

router.put('/events/:id', authenticateToken, isAdmin, editEvent);
router.delete('/events/:id', authenticateToken, isAdmin, deleteEvent);

// User management routes
router.get('/users', authenticateToken, isAdmin, getUsers);
router.put('/users/:id', authenticateToken, isAdmin, updateUser);
router.delete('/users/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;

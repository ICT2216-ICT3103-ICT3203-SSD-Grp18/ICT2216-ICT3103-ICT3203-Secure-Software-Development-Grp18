// backend/routes/authRoutes.js

const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { login, register, logout, checkAuth, getUser } = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/check', authenticateToken, checkAuth);
router.get('/getUser', authenticateToken, getUser);

module.exports = router;

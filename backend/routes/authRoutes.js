const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { login, verifyOtp, register, logout, checkAuth, getUser, forgotPassword, resetPassword} = require('../controllers/authController');

const router = express.Router();

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/logout', logout);
router.get('/check', authenticateToken, checkAuth);
router.get('/getUser', authenticateToken, getUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);




module.exports = router;

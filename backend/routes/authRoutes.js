const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { login, verifyOtp, register, logout, checkAuth, getUser, forgotPassword, resetPassword, extendSession} = require('../controllers/authController');
const csrfProtection = require('csurf')({ cookie: true });

const router = express.Router();

router.post('/login', csrfProtection, login);
router.post('/verify-otp', csrfProtection, verifyOtp);
router.post('/register', csrfProtection, register);
router.post('/logout', csrfProtection, logout);
router.get('/check', csrfProtection, authenticateToken, checkAuth);
router.get('/getUser', csrfProtection, authenticateToken, getUser);
router.post('/forgot-password', csrfProtection, forgotPassword);
router.post('/reset-password', csrfProtection, resetPassword);
router.post('/extend-session', authenticateToken, extendSession);


module.exports = router;

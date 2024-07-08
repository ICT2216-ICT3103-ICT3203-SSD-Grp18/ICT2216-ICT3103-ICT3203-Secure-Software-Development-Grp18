const express = require('express');
const { authenticateToken } = require('../middleware/authMiddleware');
const { login, verifyOtp, register, logout, checkAuth, getUser, forgotPassword, resetPassword, extendSession } = require('../controllers/authController');
const csrfProtection = require('csurf')({ cookie: true });

const router = express.Router();

if (process.env.NODE_ENV !== 'test') {
  router.use(csrfProtection);
}

router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/logout', logout);
router.get('/check', authenticateToken, checkAuth);
router.get('/getUser', authenticateToken, getUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/extend-session', authenticateToken, extendSession);

module.exports = router;

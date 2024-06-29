const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtp, sendPasswordResetEmail } = require('../utils/sendOTP');
const { body, validationResult } = require('express-validator');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const jwtSecret = process.env.JWT_SECRET;
const crypto = require('crypto');

const otps = {}; // Temporarily store OTPs

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return purify.sanitize(input.trim());
  }
  return input;
};

const login = [
  body('email').isEmail().withMessage('Invalid email').customSanitizer(sanitizeInput),
  body('password')
    .isLength({ min: 8, max: 12 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must be 8-12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters')
    .customSanitizer(sanitizeInput),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
        otps[email] = otp;

        // Send OTP via email
        await sendOtp(email, otp);

        return res.status(200).json({ message: 'OTP sent to your email', otpRequired: true });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

const register = [
  body('name')
    .isLength({ min: 1 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name is required and cannot contain special characters')
    .customSanitizer(sanitizeInput),
  body('phone_number')
    .isMobilePhone()
    .withMessage('Invalid phone number')
    .customSanitizer(sanitizeInput),
  body('email')
    .isEmail()
    .withMessage('Invalid email')
    .customSanitizer(sanitizeInput),
  body('password')
    .isLength({ min: 8, max: 12 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must be 8-12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters')
    .customSanitizer(sanitizeInput),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone_number, email, password } = req.body;

    const defaultUserRole = 'user';
    const defaultStatus = 'active';
    const defaultTicketsPurchased = 0;

    try {
      const hashPassword = await bcrypt.hash(password, 10);

      const [result] = await db.execute(
        'INSERT INTO user (name, phone_number, email, password, user_role, status, tickets_purchased) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, phone_number, email, hashPassword, defaultUserRole, defaultStatus, defaultTicketsPurchased]
      );

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid');
    res.clearCookie('token');
    res.status(200).json({ message: 'Logout successful' });
  });
};

const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ message: 'No token, user is not logged in' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is not valid' });
    }

    res.status(200).json({ message: 'Authorized' });
  });
};

const getUser = (req, res) => {
  const user = req.user;

  if (user) {
    res.status(200).json({ email: user.email, role: user.role });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await db.execute('SELECT user_id FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userId = rows[0].user_id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiryTime = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    await db.execute('UPDATE user SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?', [token, expiryTime, userId]);

    // Send password reset email
    await sendPasswordResetEmail(email, token);

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const [rows] = await db.execute('SELECT user_id, reset_token_expiry FROM user WHERE reset_token = ?', [token]);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const expiryTime = new Date(rows[0].reset_token_expiry);

    if (expiryTime < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const userId = rows[0].user_id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.execute('UPDATE user SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?', [hashedPassword, userId]);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    if (!email || !otp) {
      return res.status(400).json({ status: 400, message: 'Email and OTP are required' });
    }
    if (otps[email] && otps[email] === otp) {
      delete otps[email]; // Invalidate OTP after successful verification

      const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
      const user = rows[0];

      const token = jwt.sign({ id: user.user_id, email: user.email, role: user.user_role }, jwtSecret, { expiresIn: '30m' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 60 * 1000 // 30 minutes
      });

      req.session.userId = user.user_id;
      req.session.email = user.email;
      return res.status(200).json({ status: 200, message: 'Login successful', user: { id: user.user_id, email: user.email, role: user.user_role } });
    } else {
      return res.status(401).json({ status: 401, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};



module.exports = { login, verifyOtp, register, logout, checkAuth, getUser, forgotPassword, resetPassword };

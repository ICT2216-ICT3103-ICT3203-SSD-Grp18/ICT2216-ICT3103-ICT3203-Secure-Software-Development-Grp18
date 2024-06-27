const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const jwtSecret = process.env.JWT_SECRET;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const sanitizeInput = (input) => {
  return purify.sanitize(input.trim());
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
      const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email and password' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {

        // Regenerate session ID to prevent session fixation
        req.session.regenerate((err) => {
          if (err) {
            return res.status(500).json({ message: 'Error regenerating session ID' });
          }

        const token = jwt.sign({ id: user.user_id, email: user.email }, jwtSecret, { expiresIn: '30m' });

        res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'Strict',
          maxAge: 30 * 60 * 1000 // 30 minutes
        });

        req.session.userId = user.user_id;
        req.session.email = user.email;
        req.session.role = user.user_role

        res.status(200).json({ message: 'Login successful' });
        });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
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
    res.status(200).json({ email: user.email });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { login, register, logout, checkAuth, getUser };

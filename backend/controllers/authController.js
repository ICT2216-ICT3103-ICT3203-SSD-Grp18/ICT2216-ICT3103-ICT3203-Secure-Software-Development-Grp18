const db = require('../utils/db');
const jwt = require('jsonwebtoken');
const { sendOtp, sendPasswordResetEmail } = require('../utils/sendOTP');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const crypto = require('crypto');
const jwtSecret = process.env.JWT_SECRET;
const he = require('he');

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    const sanitized = sanitizeHtml(input.trim(), {
      allowedTags: [],
      allowedAttributes: {}
    });
    return he.encode(sanitized);
  }
  return input;
};

const hashPassword = async (password) => {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
  return `${salt}:${hash}`;
};

const verifyPassword = async (password, storedHash) => {
  const [salt, key] = storedHash.split(':');
  const hash = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
      if (err) reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
  return hash === key;
};

const generateOtpWithExpiry = async (userId) => {
  const otp = crypto.randomInt(100000, 999999).toString();
  // expire 5 mins
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Insert OTP into the database
  await db.execute(
    'INSERT INTO otps (user_id, otp, expires_at) VALUES (?, ?, ?)',
    [userId, otp, expiresAt]
  );

  return otp;
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

      if (user.lock_until && new Date(user.lock_until) > new Date()) {
        return res.status(403).json({ message: 'Account locked. Try again later.' });
      }

      const isMatch = await verifyPassword(password, user.password);

      if (isMatch) {
        // reset login attempt
        await db.execute('UPDATE user SET login_attempts = 0, lock_until = NULL WHERE email = ?', [email]);

        const otp = await generateOtpWithExpiry(user.user_id);
        console.log(otp)
        await sendOtp(email, otp); 

        return res.status(200).json({ message: 'OTP sent to your email', otpRequired: true });
      } else {
        await db.execute('UPDATE user SET login_attempts = login_attempts + 1 WHERE email = ?', [email]);
        const [updatedUser] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

        if (updatedUser[0].login_attempts >= 5) {
          const lockUntil = new Date(Date.now() + 5 * 60 * 1000); // Lock for 5 minutes
          await db.execute('UPDATE user SET lock_until = ? WHERE email = ?', [lockUntil, email]);
          return res.status(403).json({ message: 'Account locked. Try again later.' });
        }

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

      // Check if email already exists
      const [existingUser] = await db.execute('SELECT email FROM user WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      
      const hashedPassword = await hashPassword(password);

      const [result] = await db.execute(
        'INSERT INTO user (name, phone_number, email, password, user_role, status, tickets_purchased) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, phone_number, email, hashedPassword, defaultUserRole, defaultStatus, defaultTicketsPurchased]
      );

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

const logout = async (req, res) => {
  try {
    console.log(req.session.userId)
    await db.execute('UPDATE user SET session_token = NULL, session_expiry = NULL WHERE user_id = ?', [req.session.userId]);
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.clearCookie('token');
      res.status(200).json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const checkAuth = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(200).json({ active: false, message: 'No token, user is not logged in' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ active: false, message: 'Token is not valid' });
    }
    res.status(200).json({ active: true, message: 'Authorized' });
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

    if (rows.length > 0) {
      const userId = rows[0].user_id;
      const token = crypto.randomBytes(32).toString('hex');
      const expiryTime = new Date(Date.now() + 3600 * 1000); // 1 hour from now

      await db.execute('UPDATE user SET reset_token = ?, reset_token_expiry = ? WHERE user_id = ?', [token, expiryTime, userId]);

      // Send password reset email
      await sendPasswordResetEmail(email, token);
    }

    res.status(202).json({ message: 'Password reset email sent. Please check your email.' });

  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const resetPassword = [
  body('token').notEmpty().withMessage('Token is required').customSanitizer(sanitizeInput),
  body('newPassword')
    .isLength({ min: 8, max: 12 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .withMessage('Password must be 8-12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters')
    .customSanitizer(sanitizeInput),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
      const hashedPassword = await hashPassword(newPassword);

      await db.execute('UPDATE user SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE user_id = ?', [hashedPassword, userId]);

      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error during password reset:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ status: 400, message: 'Email and OTP are required' });
    }

    const [userRows] = await db.execute('SELECT user_id FROM user WHERE email = ?', [email]);
    if (userRows.length === 0) {
      return res.status(401).json({ status: 401, message: 'Invalid email' });
    }

    const userId = userRows[0].user_id;

    const [otpRows] = await db.execute('SELECT * FROM otps WHERE user_id = ? AND otp = ?', [userId, otp]);
    if (otpRows.length === 0) {
      return res.status(401).json({ status: 401, message: 'Invalid OTP' });
    }

    const storedOtpData = otpRows[0];
    if (new Date() > storedOtpData.expires_at) {
      return res.status(401).json({ status: 401, message: 'OTP has expired' });
    }

    // Delete OTP after use
    await db.execute('DELETE FROM otps WHERE otp_id = ?', [storedOtpData.otp_id]);

    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);
    const user = rows[0];

    // Invalidate any existing sessions
    await db.execute('UPDATE user SET session_token = NULL, session_expiry = NULL WHERE email = ?', [email]);

    // Regenerate the session
    req.session.regenerate(async (err) => {
      if (err) {
        return res.status(500).json({ status: 500, message: 'Failed to regenerate session' });
      }

      // Store user information in the session
      req.session.userId = user.user_id;
      req.session.email = user.email;
      req.session.role = user.user_role;

      // Store the session ID and expiry in the database
      const sessionToken = req.sessionID;
      const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await db.execute('UPDATE user SET session_token = ?, session_expiry = ? WHERE email = ?', [sessionToken, sessionExpiry, email]);

      // Generate JWT
      const token = jwt.sign({ id: user.user_id, email: user.email, role: user.user_role, sessionToken }, jwtSecret, { expiresIn: '2m' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 60 * 1000, // 30 minutes
      });

      return res.status(200).json({ status: 200, message: 'Login successful', user: { id: user.user_id, email: user.email, role: user.user_role } });
    });
  } catch (error) {
    console.error('Error during OTP verification:', error);
    return res.status(500).json({ status: 500, message: 'Server error', error: error.message });
  }
};

const extendSession = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'No active session found' });
    }

    const userId = req.session.userId;

    // Get user details from the database
    const [rows] = await db.execute('SELECT * FROM user WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = rows[0];

    req.session.regenerate(async (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to regenerate session' });
      }

      req.session.userId = userId;
      req.session.email = user.email;
      req.session.role = user.user_role; 

      const sessionToken = req.sessionID;
      const sessionExpiry = new Date(Date.now() + 30 * 60 * 1000); 

      await db.execute('UPDATE user SET session_token = ?, session_expiry = ? WHERE user_id = ?', [sessionToken, sessionExpiry, userId]);

      const newToken = jwt.sign({ id: userId, email: user.email, role: user.user_role, sessionToken }, jwtSecret, { expiresIn: '30m' });

      res.cookie('token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 60 * 1000, // 30 minutes
      });

      return res.status(200).json({ success: true, message: 'Session extended', token: newToken });
    });
  } catch (error) {
    console.error('Error during session extension:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login, verifyOtp, register, logout, checkAuth, getUser, forgotPassword, resetPassword, extendSession };
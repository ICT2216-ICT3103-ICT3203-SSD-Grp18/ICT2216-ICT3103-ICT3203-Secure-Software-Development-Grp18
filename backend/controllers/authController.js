const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt with email:', email); // Log email
  console.log('Login attempt with password:', password); // Log password

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email and password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user.user_id, email: user.email, role: user.user_role }, jwtSecret, { expiresIn: '30m' });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 30 * 60 * 1000 // 30 minutes
      });

      req.session.userId = user.user_id;
      req.session.email = user.email;

      res.status(200).json({ message: 'Login successful',  user: { id: user.user_id, email: user.email, role: user.user_role } });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const register = async (req, res) => {
  const { name, phone_number, email, password } = req.body;

  console.log('Data received:', { name, phone_number, email, password });

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
    res.status(500).json({ message: 'Server error', error });
  }
};

const logout = (req, res) => {
  req.session.destroy(err => {
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

  // console.log('Fetched user:', user); // Log user

  if (user) {
    res.status(200).json({ email: user.email, role: user.role });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};
module.exports = { login, register, logout, checkAuth, getUser };

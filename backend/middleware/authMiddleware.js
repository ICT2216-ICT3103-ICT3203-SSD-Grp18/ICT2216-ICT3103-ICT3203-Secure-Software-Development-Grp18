const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
const db = require('../utils/db');

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token found');
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, async (err, user) => {
    if (err) {
      console.log('Token verification failed', err);
      return res.sendStatus(403);
    }

    // Verify session token in the database
    const [rows] = await db.execute('SELECT session_token, session_expiry FROM user WHERE user_id = ?', [user.id]);
    if (rows.length === 0 || rows[0].session_token !== user.sessionToken || new Date(rows[0].session_expiry) < new Date()) {
      
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ message: 'Failed to log out' });
        }
        res.clearCookie('connect.sid');
        res.clearCookie('token');
        return res.status(403).json({ message: 'Session is not valid, user has been logged out' });
      });
    } else {
      req.user = user;
      next();
    }
  });
};

const isAdminDashboardUser = (req, res, next) => {
  if (req.user && ['admin', 'event', 'cus_support'].includes(req.user.role)) {
    next();
  } else {
    res.sendStatus(403);
  }
};

module.exports = { authenticateToken, isAdminDashboardUser };


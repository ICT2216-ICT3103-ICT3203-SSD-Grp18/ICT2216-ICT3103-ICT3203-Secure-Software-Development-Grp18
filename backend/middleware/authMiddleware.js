const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();
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

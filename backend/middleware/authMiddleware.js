const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token found');
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log('Token verification failed', err);
      return res.sendStatus(403);
    }

    // console.log('Token verified:', user); 
    req.user = user; // Set  user on the request object
    next(); // Proceed to the next middleware or route handler
  });

};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.sendStatus(403);
  }
};




module.exports = { authenticateToken, isAdmin };

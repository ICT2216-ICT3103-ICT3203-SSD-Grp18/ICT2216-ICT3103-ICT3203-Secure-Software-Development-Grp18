module.exports = (req, res, next) => {
    // Example middleware for authentication
    // Add your authentication logic here
    console.log('Auth Middleware');
    next();
  };
  
const loginModel = require('../models/loginModel');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await loginModel.authenticate(email, password);
    if (user) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login };
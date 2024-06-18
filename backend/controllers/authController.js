const db = require('../utils/db');  // Adjust the path to your database configuration

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

const register = async (req, res) => {
  const { name, phone_number, email, password } = req.body;

  // Log the data received
  console.log('Data received:', { name, phone_number, email, password });

  const defaultUserRole = 'user';  // Default value for user_role
  const defaultStatus = 'active';  // Default value for status
  const defaultTicketsPurchased = 0;  // Default value for tickets_purchased

  try {
    const [result] = await db.execute(
      'INSERT INTO user (name, phone_number, email, password, user_role, status, tickets_purchased) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone_number, email, password, defaultUserRole, defaultStatus, defaultTicketsPurchased]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    // Log the exact error message
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login, register };

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
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const register = async (req, res) => {
  const { name, phone_number, email, password } = req.body;

  // Log the data received
  console.log('Data received:', { name, phone_number, email, password });

  // Validate data
  if (typeof name !== 'string' || name.length > 100) {
    console.error('Invalid name:', name);
    return res.status(400).json({ message: 'Invalid name' });
  }
  if (typeof phone_number !== 'string' || phone_number.length > 15) {
    console.error('Invalid phone number:', phone_number);
    return res.status(400).json({ message: 'Invalid phone number' });
  }
  if (typeof email !== 'string' || email.length > 100) {
    console.error('Invalid email:', email);
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (typeof password !== 'string' || password.length > 255) {
    console.error('Invalid password:', password);
    return res.status(400).json({ message: 'Invalid password' });
  }

  try {
    const [result] = await db.execute(
      'INSERT INTO user (name, phone_number, email, password) VALUES (?, ?, ?, ?)',
      [name, phone_number, email, password]
    );

    console.log('User insertion result:', result);  // Log the result of the insert operation

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    // Log the exact error message
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login, register };

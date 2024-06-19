const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const jwtSecret = process.env.JWT_SECRET;


const login = async (req, res) => {
  const { email, password } = req.body;


  try {
    const [rows] = await db.execute('SELECT * FROM user WHERE email = ?', [email]);

    if (rows.length == 0){
      return res.status(401).json({message: 'Invalid email and password'});
    }

    const user = rows[0];


    const isMatch =await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user.user_id, email: user.email }, jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
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

  // Log the data received
  console.log('Data received:', { name, phone_number, email, password });


  const defaultUserRole = 'user';  // Default value for user_role
  const defaultStatus = 'active';  // Default value for status
  const defaultTicketsPurchased = 0;  // Default value for tickets_purchased

  try {

    const hashPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO user (name, phone_number, email, password, user_role, status, tickets_purchased) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone_number, email, hashPassword, defaultUserRole, defaultStatus, defaultTicketsPurchased]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    // Log the exact error message
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { login, register };

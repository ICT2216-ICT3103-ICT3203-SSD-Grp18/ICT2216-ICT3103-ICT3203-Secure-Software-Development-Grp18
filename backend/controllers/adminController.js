const db = require('../utils/db');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const he = require('he');
const crypto = require('crypto');

// -----------------------------------------------------------------------------------------
// Sanitize input function
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

const register = [
  body('name')
    .isLength({ min: 1 })
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name is required and cannot contain special characters')
    .customSanitizer(sanitizeInput),
  body('phone_number')
    .isLength({ min: 1, max: 15 })
    .matches(/^\d+$/)
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

    const { name, phone_number, email, password, user_role } = req.body;

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
        [name, phone_number, email, hashedPassword, user_role, defaultStatus, defaultTicketsPurchased]
      );

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
      console.error('Error inserting user:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
];

// -----------------------------------------------------------------------------------------
const createEvent = [
  body('event_name').isLength({ min: 1 }).withMessage('Event name is required').customSanitizer(sanitizeInput),
  body('description').optional().customSanitizer(sanitizeInput),
  body('date').isISO8601().withMessage('Invalid date format').customSanitizer(sanitizeInput),
  body('start_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format').customSanitizer(sanitizeInput),
  body('location').optional().customSanitizer(sanitizeInput),
  body('organiser').optional().customSanitizer(sanitizeInput),
  body('ticket_availability').isInt({ min: 0 }).withMessage('Invalid ticket availability').customSanitizer(sanitizeInput),
  body('ticket_price').isFloat({ min: 0 }).withMessage('Invalid ticket price').customSanitizer(sanitizeInput),
  body('raffle_start_date').isISO8601().optional().withMessage('Invalid raffle start date').customSanitizer(sanitizeInput),
  body('raffle_end_date').isISO8601().optional().withMessage('Invalid raffle end date').customSanitizer(sanitizeInput),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      event_name,
      description,
      date,
      start_time,
      location,
      organiser,
      ticket_availability,
      ticket_price,
      raffle_start_date,
      raffle_end_date,
    } = req.body;

    const image = req.file ? req.file.buffer : null; // Handle the image file

    try {
      const [result] = await db.execute(
        'INSERT INTO events (event_name, description, date, start_time, location, organiser, ticket_availability, ticket_price, raffle_start_date, raffle_end_date, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          event_name,
          description,
          date,
          start_time,
          location,
          organiser,
          ticket_availability,
          ticket_price,
          raffle_start_date,
          raffle_end_date,
          image
        ]
      );
      res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
];

const updateEvent = [
  body('event_name').optional().customSanitizer(sanitizeInput),
  body('description').optional().customSanitizer(sanitizeInput),
  body('date').optional().isISO8601().withMessage('Invalid date format').customSanitizer(sanitizeInput),
  body('start_time').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format').customSanitizer(sanitizeInput),
  body('location').optional().customSanitizer(sanitizeInput),
  body('organiser').optional().customSanitizer(sanitizeInput),
  body('ticket_availability').optional().isInt({ min: 0 }).withMessage('Invalid ticket availability').customSanitizer(sanitizeInput),
  body('ticket_price').optional().isFloat({ min: 0 }).withMessage('Invalid ticket price').customSanitizer(sanitizeInput),
  body('raffle_start_date').optional().isISO8601().withMessage('Invalid raffle start date').customSanitizer(sanitizeInput),
  body('raffle_end_date').optional().isISO8601().withMessage('Invalid raffle end date').customSanitizer(sanitizeInput),

  async (req, res) => {
    const { id } = req.params;
    const {
      event_name,
      description,
      date,
      start_time,
      location,
      organiser,
      ticket_availability,
      ticket_price,
      raffle_start_date,
      raffle_end_date,
    } = req.body;

    try {
      await db.execute(
        'UPDATE events SET event_name = ?, description = ?, date = ?, start_time = ?, location = ?, organiser = ?, ticket_availability = ?, ticket_price = ?, raffle_start_date = ?, raffle_end_date = ? WHERE event_id = ?',
        [
          event_name,
          description,
          date,
          start_time,
          location,
          organiser,
          ticket_availability,
          ticket_price,
          raffle_start_date,
          raffle_end_date,
          id
        ]
      );
      res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
];

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM events WHERE event_id = ?', [id]);
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getEvents = async (req, res) => {
  try {
    const [events] = await db.execute('SELECT * FROM events');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const searchEvents = async (req, res) => {
  try {
    const { event_name } = req.query; // Adjust to match the frontend
    const [events] = await db.execute('SELECT * FROM events WHERE event_name LIKE ?', [`%${event_name}%`]);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// -----------------------------------------------------------------------------------------
const getUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM user');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// New function to search users by email
const searchUsers = async (req, res) => {
  try {
    const { email } = req.query;
    const [users] = await db.execute('SELECT * FROM user WHERE email LIKE ?', [`%${email}%`]);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// New function to update user status
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log('Request received to update status', { id, status }); // Log request details

  if (!id || !status) {
    return res.status(400).json({ message: 'Invalid request data' });
  }

  try {
    // Ensure the id is correctly received and logged
    console.log('Updating user status in database:', id, status);

    // Execute the SQL statement to update the user status
    const [result] = await db.execute('UPDATE user SET status = ? WHERE user_id = ?', [status, id]);

    // Check if the update was successful
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Error updating user status:', error); // Log error details
    res.status(500).json({ message: 'Server error', error });
  }
};

// New function to update user role
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { user_role } = req.body;
  try {
    await db.execute('UPDATE user SET user_role = ? WHERE user_id = ?', [user_role, id]);
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateUser = [
  body('name').optional().customSanitizer(sanitizeInput),
  body('phone_number').optional().isLength({ min: 1, max: 15 }).matches(/^\d+$/).withMessage('Invalid phone number').customSanitizer(sanitizeInput),
  body('email').optional().isEmail().withMessage('Invalid email').customSanitizer(sanitizeInput),
  body('role').optional().customSanitizer(sanitizeInput),

  async (req, res) => {
    const { id } = req.params;
    const { name, phone_number, email, role } = req.body;
    try {
      await db.execute('UPDATE user SET name = ?, phone_number = ?, email = ?, role = ? WHERE user_id = ?', [name, phone_number, email, role, id]);
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
];

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM user WHERE user_id = ?', [id]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// -------------------------------------------------------
const getMetrics = async (req, res) => {
  try {
    const [activeUsers] = await db.execute('SELECT COUNT(*) as activeUsers FROM user WHERE status = "active"');
    const [totalEvents] = await db.execute('SELECT COUNT(*) as totalEvents FROM events');
    const [upcomingEvents] = await db.execute('SELECT * FROM events WHERE date >= CURDATE() ORDER BY date ASC LIMIT 1');

    res.status(200).json({
      activeUsers: activeUsers[0].activeUsers,
      totalEvents: totalEvents[0].totalEvents,
      upcomingEvent: upcomingEvents[0] || null,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  register,
  getMetrics,
  createEvent,
  updateEvent,
  deleteEvent,
  searchEvents,
  getEvents,
  getUsers,
  searchUsers,
  updateUserStatus,
  updateUserRole,
  updateUser,
  deleteUser
};


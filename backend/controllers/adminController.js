const db = require('../utils/db');
const bcrypt = require('bcrypt');
// -----------------------------------------------------------------------------------------
const register = async (req, res) => {
  const { name, phone_number, email, password, user_role } = req.body;

  const defaultStatus = 'active';
  const defaultTicketsPurchased = 0;

  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO user (name, phone_number, email, password, user_role, status, tickets_purchased) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone_number, email, hashPassword, user_role, defaultStatus, defaultTicketsPurchased]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// -----------------------------------------------------------------------------------------

const createEvent = async (req, res) => {
  const {
    event_name,
    description,
    date,
    start_time,
    location,
    organiser,
    ticket_availability,
    price_vip,
    price_cat1,
    price_cat2,
    price_cat3,
    price_cat4,
    price_cat5,
    raffle_start_date,
    raffle_end_date,
  } = req.body;
  
  const image = req.file ? req.file.buffer : null; // Handle the image file

  try {
    const [result] = await db.execute(
      'INSERT INTO events (event_name, description, date, start_time, location, organiser, ticket_availability, price_vip, price_cat1, price_cat2, price_cat3, price_cat4, price_cat5, raffle_start_date, raffle_end_date, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        event_name,
        description,
        date,
        start_time,
        location,
        organiser,
        ticket_availability,
        price_vip,
        price_cat1,
        price_cat2,
        price_cat3,
        price_cat4,
        price_cat5,
        raffle_start_date,
        raffle_end_date,
        image
      ]
    );
    res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const updateEvent = async (req, res) => {
  const { id } = req.params;
  const {
    event_name,
    description,
    date,
    start_time,
    location,
    organiser,
    ticket_availability,
    price_vip,
    price_cat1,
    price_cat2,
    price_cat3,
    price_cat4,
    price_cat5,
    raffle_start_date,
    raffle_end_date,
  } = req.body;

  try {
    await db.execute(
      'UPDATE events SET event_name = ?, description = ?, date = ?, start_time = ?, location = ?, organiser = ?, ticket_availability = ?, price_vip = ?, price_cat1 = ?, price_cat2 = ?, price_cat3 = ?, price_cat4 = ?, price_cat5 = ?, raffle_start_date = ?, raffle_end_date = ? WHERE event_id = ?',
      [
        event_name,
        description,
        date,
        start_time,
        location,
        organiser,
        ticket_availability,
        price_vip,
        price_cat1,
        price_cat2,
        price_cat3,
        price_cat4,
        price_cat5,
        raffle_start_date,
        raffle_end_date,
        id
      ]
    );
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

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

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, phone_number, email, role } = req.body;
  try {
    await db.execute('UPDATE user SET name = ?, phone_number = ?, email = ?, role = ? WHERE id = ?', [name, phone_number, email, role, id]);
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM user WHERE id = ?', [id]);
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

module.exports = { register, getMetrics, createEvent, updateEvent, deleteEvent, searchEvents,getEvents, getUsers, searchUsers, updateUserStatus, updateUserRole, updateUser, deleteUser };

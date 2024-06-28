const db = require('../utils/db');

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

const editEvent = async (req, res) => {
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

  // Check if there is a file
  const image = req.file ? req.file.buffer : null;

  try {
    await db.execute(
      'UPDATE events SET event_name = ?, description = ?, date = ?, start_time = ?, location = ?, organiser = ?, ticket_availability = ?, price_vip = ?, price_cat1 = ?, price_cat2 = ?, price_cat3 = ?, price_cat4 = ?, price_cat5 = ?, raffle_start_date = ?, raffle_end_date = ?, image = ? WHERE event_id = ?',
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
        image,
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

const getUsers = async (req, res) => {
  try {
    const [users] = await db.execute('SELECT * FROM user');
    res.status(200).json(users);
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
    res.status (500).json({ message: 'Server error', error });
  }
};

module.exports = { createEvent, editEvent, deleteEvent, getUsers, updateUser, deleteUser };

const db = require('../utils/db');

const createEvent = async (req, res) => {
  const { title, date, location, description } = req.body;
  try {
    const [result] = await db.execute('INSERT INTO events (title, date, location, description) VALUES (?, ?, ?, ?)', [title, date, location, description]);
    res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const editEvent = async (req, res) => {
  const { id } = req.params;
  const { title, date, location, description } = req.body;
  try {
    await db.execute('UPDATE events SET title = ?, date = ?, location = ?, description = ? WHERE id = ?', [title, date, location, description, id]);
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM events WHERE id = ?', [id]);
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
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { createEvent, editEvent, deleteEvent, getUsers, updateUser, deleteUser };

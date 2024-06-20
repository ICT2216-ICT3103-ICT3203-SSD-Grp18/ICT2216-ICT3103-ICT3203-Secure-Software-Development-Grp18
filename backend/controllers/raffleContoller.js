const db = require('../utils/db');

const enterRaffle = async (req, res) => {
  const { eventId, ticketCount } = req.body;
  const userId = req.user.id;

//for troubleshooting
  console.log('eventId:', eventId); // Log eventId
  console.log('userId:', userId);   // Log userId
  console.log('ticketCount:', ticketCount); // Log ticketCount



  try {
    // Check if the user has already entered the raffle for this event
    const [existingEntry] = await db.query('SELECT * FROM raffle_entries WHERE event_id = ? AND user_id = ?', [eventId, userId]);

    if (existingEntry.length > 0) {
      return res.status(400).json({ message: 'You have already entered the raffle for this event.' });
    }

    // Insert a new raffle entry
    const [result] = await db.execute('INSERT INTO raffle_entries (event_id, user_id, num_of_seats, category) VALUES (?, ?, ?, ?)', [
      eventId,
      userId,
      ticketCount.reduce((total, count) => total + count, 0), // Total number of tickets
      JSON.stringify(ticketCount), // Store ticket counts as JSON string
    ]);

    res.status(201).json({ message: 'Raffle entry successful.', entryId: result.insertId });
  } catch (error) {
    console.error('Error entering raffle:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  enterRaffle
};

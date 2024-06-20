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

  
    const [event] = await db.query('SELECT * FROM events WHERE event_id = ?', [eventId]);
    const categories = [
      { id: 1, name: 'VIP (Standing)', price: parseFloat(event[0].price_vip.replace(/[^0-9.]/g, '')) },
      { id: 2, name: 'CAT 1', price: parseFloat(event[0].price_cat1.replace(/[^0-9.]/g, '')) },
      { id: 3, name: 'CAT 2', price: parseFloat(event[0].price_cat2.replace(/[^0-9.]/g, '')) },
      { id: 4, name: 'CAT 3', price: parseFloat(event[0].price_cat3.replace(/[^0-9.]/g, '')) },
      { id: 5, name: 'CAT 4', price: parseFloat(event[0].price_cat4.replace(/[^0-9.]/g, '')) },
      { id: 6, name: 'CAT 5', price: parseFloat(event[0].price_cat5.replace(/[^0-9.]/g, '')) }
    ];
    
    const selectedCategories = categories
      .map((category, index) => ticketCount[index] > 0 ? category.name : null)
      .filter(category => category !== null)
      .join(', ');

    // Insert a new raffle entry
    const [result] = await db.execute('INSERT INTO raffle_entries (event_id, user_id, num_of_seats, category) VALUES (?, ?, ?, ?)', [
      eventId,
      userId,
      ticketCount.reduce((total, count) => total + count, 0), // Total number of tickets
      selectedCategories // Store only category names
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

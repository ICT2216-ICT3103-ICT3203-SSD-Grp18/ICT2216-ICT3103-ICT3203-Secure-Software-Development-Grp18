const db = require('../utils/db');

const enterRaffle = async (req, res) => {
    const { eventId, ticketCount } = req.body; // Include ticketCount in request body
    const userId = req.user.id;

    console.log('eventId:', eventId); // Log eventId
    console.log('userId:', userId);   // Log userId
    console.log('ticketCount:', ticketCount); // Log ticketCount

    try {
        // Fetch event details to get raffle start date
        const [event] = await db.query('SELECT raffle_start_date FROM events WHERE event_id = ?', [eventId]);

        if (event.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        const raffleStartDate = new Date(event[0].raffle_start_date);
        const currentDate = new Date();

        // Check if the raffle start date has passed
        if (currentDate < raffleStartDate) {
            return res.status(400).json({ message: 'Raffle has not started yet' });
        }

        // Format ticket categories
        const formattedTicketCount = ticketCount.map((count, index) => ({
            name: `CAT ${index + 1}`,
            count,
        })).filter(category => category.count > 0);

        // Insert a new raffle entry
        const [result] = await db.execute('INSERT INTO raffle_entries (event_id, user_id, num_of_seats, category) VALUES (?, ?, ?, ?)', [
            eventId,
            userId,
            ticketCount.reduce((total, count) => total + count, 0), // Total number of tickets
            JSON.stringify(formattedTicketCount), // Store formatted ticket counts as JSON string
        ]);

        res.status(201).json({ message: 'Raffle entry successful.', entryId: result.insertId });
    } catch (error) {
        console.error('Error entering raffle:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const hasUserEnteredRaffle = async (req, res) => {
    const { eventId } = req.query;
    const userId = req.user.id;
  
    try {
        const [existingEntry] = await db.query('SELECT * FROM raffle_entries WHERE event_id = ? AND user_id = ?', [eventId, userId]);
        // userHasEntered == true if db return results, set status 200 
        const userHasEntered = existingEntry.length > 0;
        res.status(200).json({ hasEntered: userHasEntered });
    } catch (error) {
        console.error('Error checking raffle entry:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
  enterRaffle, 
  hasUserEnteredRaffle
};

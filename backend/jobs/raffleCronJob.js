const cron = require('node-cron');
const db = require('../utils/db');
const { sendNotification } = require('../utils/sendNotification');

// Function to pick random winners
const pickWinners = async (eventId) => {
  try {
    // Fetch all raffle entries for the event
    const [entries] = await db.query('SELECT * FROM raffle_entries WHERE event_id = ?', [eventId]);
    if (entries.length === 0) {
      console.log(`No entries for event ID: ${eventId}.`);
      return;
    }

    // Fetch the event details including ticket availability
    const [event] = await db.query('SELECT event_id, event_name, description, date, start_time, location, ticket_availability FROM events WHERE event_id = ?', [eventId]);
    if (event.length === 0) {
      console.log(`Event with ID: ${eventId} not found.`);
      return;
    }

    const { event_name, description, date, start_time, location, ticket_availability } = event[0];

    // Check if there are tickets available
    if (ticket_availability <= 0) {
      console.log(`No tickets available for event ID: ${eventId}.`);
      return;
    }

    console.log(`Total entries for event ID ${eventId}: ${entries.length}`);
    console.log(`Tickets available for event ID ${eventId}: ${ticket_availability}`);

    // Randomly select winners up to the number of available tickets
    const winners = [];
    for (let i = 0; i < ticket_availability && entries.length > 0; i++) {
      const winnerIndex = Math.floor(Math.random() * entries.length);
      winners.push(entries.splice(winnerIndex, 1)[0]);
    }

    for (const winner of winners) {
      console.log(`Winner selected: Entry ID ${winner.entry_id}, User ID ${winner.user_id}`);

      // Update the raffle entry to mark the user as a winner
      const [updateResult] = await db.execute('UPDATE raffle_entries SET is_winner = TRUE WHERE entry_id = ?', [winner.entry_id]);

      if (updateResult.affectedRows === 0) {
        console.log(`Failed to update entry ID ${winner.entry_id} as a winner.`);
        continue;
      }

      // Send notification to the winner with event details, number of tickets, and category
      await sendNotification(winner.user_id, event[0], winner.num_of_seats, winner.category);

      console.log(`Winner notified: Entry ID ${winner.entry_id}, User ID ${winner.user_id}`);
    }

    // Update ticket availability
    const newTicketAvailability = ticket_availability - winners.length;
    await db.execute('UPDATE events SET ticket_availability = ? WHERE event_id = ?', [newTicketAvailability, eventId]);

  } catch (error) {
    console.error('Error picking winners:', error);
  }
};

// Cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily raffle pick job...');

  try {
    // Fetch all events where raffle end date is today or earlier
    const [events] = await db.query('SELECT event_id FROM events WHERE raffle_end_date <= NOW() AND raffle_end_date IS NOT NULL');

    for (const event of events) {
      await pickWinners(event.event_id);
    }
  } catch (error) {
    console.error('Error running raffle job:', error);
  }
});


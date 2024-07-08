const cron = require('node-cron');
const db = require('../utils/db');
const { sendNotification } = require('../utils/sendNotification');

// Function to pick a random winner
const pickWinner = async (eventId) => {
  try {
    // Fetch all raffle entries for the event
    const [entries] = await db.query('SELECT * FROM raffle_entries WHERE event_id = ?', [eventId]);
    if (entries.length === 0) {
      console.log(`No entries for event ID: ${eventId}.`);
      return;
    }

    console.log(`Total entries for event ID ${eventId}: ${entries.length}`);

    // Select a random entry
    const winnerIndex = Math.floor(Math.random() * entries.length);
    const winnerEntry = entries[winnerIndex];

    console.log(`Winner selected: Entry ID ${winnerEntry.entry_id}, User ID ${winnerEntry.user_id}`);

    // Update the raffle entry to mark the user as a winner
    const [updateResult] = await db.execute('UPDATE raffle_entries SET is_winner = TRUE WHERE entry_id = ?', [winnerEntry.entry_id]);

    if (updateResult.affectedRows === 0) {
      console.log(`Failed to update entry ID ${winnerEntry.entry_id} as a winner.`);
      return;
    }

    // Fetch the event details
    const [event] = await db.query('SELECT event_id, event_name, description, date, start_time, location FROM events WHERE event_id = ?', [eventId]);
    if (event.length === 0) {
      console.log(`Event with ID: ${eventId} not found.`);
      return;
    }

    console.log('Fetched event data:', event[0]);

    // Ensure event_id is present
    if (!event[0].event_id) {
      throw new Error('Event ID is undefined');
    }

    const { event_name, description, date, start_time, location } = event[0];

    // Send notification to the winner with event details, number of tickets, and category
    await sendNotification(winnerEntry.user_id, event[0], winnerEntry.num_of_seats, winnerEntry.category);

    console.log(`Winner notified: Entry ID ${winnerEntry.entry_id}, User ID ${winnerEntry.user_id}`);
  } catch (error) {
    console.error('Error picking winner:', error);
  }
};

// Cron job to run daily at midnight
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily raffle pick job...');

  try {
    // Fetch all events where raffle end date is today or earlier
    const [events] = await db.query('SELECT event_id FROM events WHERE raffle_end_date <= NOW() AND raffle_end_date IS NOT NULL');

    for (const event of events) {
      await pickWinner(event.event_id);
    }
  } catch (error) {
    console.error('Error running raffle job:', error);
  }
});

// For manual testing purposes, run the pickWinner function with a specific event ID
const manualTestEventId = 6; // Replace with the event ID you want to test
(async () => {
  console.log(`Running manual raffle pick job for event ID: ${manualTestEventId}...`);
  await pickWinner(manualTestEventId);
})();

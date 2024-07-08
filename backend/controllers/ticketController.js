const db = require('../utils/db'); // Ensure you have a utils/db.js for database connection

// Get tickets for a specific user
const getUserTickets = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains authenticated user's data
    const [tickets] = await db.execute('SELECT * FROM ticket WHERE user_id = ?', [userId]);
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    res.status(500).json({ error: 'An error occurred while fetching tickets' });
  }
};

// Transfer ticket to another user
const transferTicket = async (req, res) => {
  const { ticket_id, new_user_email } = req.body;

  try {
    // Log the incoming request data
    console.log('Request data:', { ticket_id, new_user_email });

    // Check if the ticket exists and belongs to the current user
    const [ticket] = await db.execute('SELECT * FROM ticket WHERE ticket_id = ? AND user_id = ?', [ticket_id, req.user.id]);
    if (ticket.length === 0) {
      return res.status(404).json({ message: 'Ticket not found or you do not have permission to transfer this ticket' });
    }

    // Find the new user's ID based on email
    const [newUser] = await db.execute('SELECT user_id FROM user WHERE email = ?', [new_user_email]);
    if (newUser.length === 0) {
      return res.status(404).json({ message: 'Recipient user not found' });
    }
    const newUserId = newUser[0].user_id;

    // Log the new user ID
    console.log('New user ID:', newUserId);

    // Update the ticket's user_id to the new user
    await db.execute('UPDATE ticket SET user_id = ? WHERE ticket_id = ?', [newUserId, ticket_id]);

    res.status(200).json({ message: 'Ticket transferred successfully' });
  } catch (error) {
    console.error('Error transferring ticket:', error);
    res.status(500).json({ error: 'An error occurred while transferring the ticket' });
  }
};

module.exports = {
  getUserTickets,
  transferTicket,
};

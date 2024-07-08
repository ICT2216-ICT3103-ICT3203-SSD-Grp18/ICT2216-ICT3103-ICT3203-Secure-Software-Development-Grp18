const db = require('../utils/db');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');
const he = require('he');

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
const transferTicket = [
  body('ticket_id')
    .isInt({ min: 1 })
    .withMessage('Ticket ID must be a positive integer')
    .customSanitizer(sanitizeInput),
  body('new_user_email')
    .isEmail()
    .withMessage('Invalid email format')
    .customSanitizer(sanitizeInput),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { ticket_id, new_user_email } = req.body;

    try {
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

      // Update the ticket's user_id to the new user
      await db.execute('UPDATE ticket SET user_id = ? WHERE ticket_id = ?', [newUserId, ticket_id]);

      res.status(200).json({ message: 'Ticket transferred successfully' });
    } catch (error) {
      console.error('Error transferring ticket:', error);
      res.status(500).json({ error: 'An error occurred while transferring the ticket' });
    }
  }
];

module.exports = {
  getUserTickets,
  transferTicket,
};

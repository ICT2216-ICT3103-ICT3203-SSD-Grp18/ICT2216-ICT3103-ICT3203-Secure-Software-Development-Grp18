const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController'); // Adjust the path if necessary
const { authenticateToken } = require('../middleware/authMiddleware');

// Route to get user tickets
router.get('/tickets', authenticateToken, ticketController.getUserTickets);

// Route to transfer a ticket
router.post('/tickets/transfer', authenticateToken, ticketController.transferTicket);

module.exports = router;

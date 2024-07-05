const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const raffleController = require('../controllers/raffleController');
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('multer');
const csrfProtection = require('csurf')({ cookie: true });

// Routes in eventController.js
router.get('/events/upcoming', csrfProtection, eventController.getUpcomingEvents);
router.get('/events/browse', csrfProtection, eventController.getBrowseConcerts);
router.get('/events/topselling', csrfProtection, eventController.getTopSelling);
router.get('/events/:eventId', csrfProtection, eventController.getEventById);


// Routes in raffleController.js
router.post('/raffle/enter', authenticateToken, csrfProtection, raffleController.enterRaffle);
router.get('/raffle/hasEntered', authenticateToken, csrfProtection, raffleController.hasUserEnteredRaffle);

module.exports = router;

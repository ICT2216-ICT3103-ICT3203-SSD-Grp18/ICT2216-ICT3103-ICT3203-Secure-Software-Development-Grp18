const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const raffleController = require('../controllers/raffleController');
const { authenticateToken } = require('../middleware/authMiddleware');
const multer = require('multer');


// Routes in eventController.js
router.get('/events/upcoming', eventController.getUpcomingEvents);
router.get('/events/browse', eventController.getBrowseConcerts);
router.get('/events/topselling', eventController.getTopSelling);
router.get('/events/:eventId', eventController.getEventById);


// Routes in raffleController.js
router.post('/raffle/enter', authenticateToken, raffleController.enterRaffle);
router.get('/raffle/hasEntered', authenticateToken, raffleController.hasUserEnteredRaffle);

module.exports = router;

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// routes in eventController.js comes here
router.get('/events/upcoming', eventController.getUpcomingEvents);
router.get('/events/browse', eventController.getBrowseConcerts);
router.get('/events/:eventId', eventController.getEventById); 

module.exports = router;

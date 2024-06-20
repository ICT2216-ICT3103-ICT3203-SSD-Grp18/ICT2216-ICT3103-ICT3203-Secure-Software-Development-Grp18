const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const raffleController = require('../controllers/raffleContoller');
const authenticateToken = require('../middleware/authMiddleware');



// routes in eventController.js comes here
router.get('/events/upcoming', eventController.getUpcomingEvents);
router.get('/events/browse', eventController.getBrowseConcerts);
router.get('/events/:eventId', eventController.getEventById); 


router.post('/raffle/enter', authenticateToken, raffleController.enterRaffle);


module.exports = router;

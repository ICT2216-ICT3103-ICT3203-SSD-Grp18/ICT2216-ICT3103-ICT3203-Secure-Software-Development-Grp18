const db = require('../utils/db');

const formatEvents = (events) => {
  return events.map(event => {
    if (event.image) {
      event.image = Buffer.from(event.image).toString('base64');
    }
    return event;
  });
};

// route to get upcoming events. sort by asc date
const getUpcomingEvents = async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT * FROM events
      WHERE date >= CURDATE() AND ticket_availability > 0
      ORDER BY date ASC, start_time ASC
      LIMIT 5
    `);
    const formattedEvents = formatEvents(events);
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// route to get all events, but i just limit 5
const getBrowseConcerts = async (req, res) => {
  try {
    const [events] = await db.query(`
      SELECT * FROM events
      WHERE ticket_availability > 0
      ORDER BY date ASC, start_time ASC LIMIT 5
    `);
    const formattedEvents = formatEvents(events);
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching browse concerts:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTopSelling = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format today's date in YYYY-MM-DD

    const [events] = await db.query(`
      SELECT * FROM events
      WHERE ticket_availability > 0 
      AND raffle_start_date < CURDATE() 
      ORDER BY ticket_availability ASC 
      LIMIT 3;
    `, [today]);
    const formattedEvents = formatEvents(events);
    res.json(formattedEvents);
  } catch (error) {
    console.error('Error fetching events with lowest ticket availability:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// route to get indiv event
const getEventById = async (req, res) => {
  const { eventId } = req.params;
  try {
    const [events] = await db.query('SELECT * FROM events WHERE event_id = ?', [eventId]);
    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const event = events[0];
    if (event.image) {
      event.image = Buffer.from(event.image).toString('base64');
    }

    // to convert price to float
    const parsePrice = (priceStr) => {
      if (typeof priceStr !== 'string') {
        priceStr = String(priceStr);
      }
      return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    };

    res.json(event);

  } catch (error) {
    console.error('Error fetching event by ID:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUpcomingEvents,
  getBrowseConcerts,
  getEventById,
  getTopSelling,
};

const express = require('express');
const router = express.Router();
const db = require('../utils/db');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Endpoint to get order details
router.get('/orders/:userId/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;
  try {
    const [order] = await db.query('SELECT * FROM raffle_entries WHERE user_id = ? AND event_id = ?', [userId, eventId]);
    if (order.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get user details by userId
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [user] = await db.query('SELECT name, email, phone_number FROM user WHERE user_id = ?', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Route to get event details by eventId
router.get('/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const [event] = await db.query('SELECT * FROM events WHERE event_id = ?', [eventId]);
    if (event.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

     // Convert the BLOB image data to base64
     if (event[0].image) {
      event[0].image = `data:image/jpeg;base64,${event[0].image.toString('base64')}`;
    }
    res.json(event[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// router.post('/create-checkout-session', async (req, res) => {
//     const { eventId, ticketPrice, numOfSeats, eventName, eventImage } = req.body;
  
//     try {
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [{
//           price_data: {
//             currency: 'SGD',
//             product_data: {
//               name: eventName,
//               images: [eventImage],
//             },
//             unit_amount: ticketPrice * 100, // assuming ticketPrice is in dollars, needs to be in cents for Stripe
//           },
//           quantity: numOfSeats, // Ensure quantity is passed and is a number
//         }],
//         mode: 'payment',
//         success_url: `${process.env.CLIENT_URL}/success.html`,
//         cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
//       });
  
//       res.json({ url: session.url });
//     } catch (error) {
//       console.error('Stripe API Error:', error.message);
//       res.status(500).json({ error: 'Internal Server Error', details: error.message });
//     }
//   });


router.post('/create-checkout-session', async (req, res) => {
    const { eventId, ticketPrice, numOfSeats, eventName, eventImage } = req.body;
    
    console.log('Received body:', req.body); // Log the received request body
  
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: 'SGD',
            product_data: {
              name: eventName,
              images: [eventImage],
            },
            unit_amount: ticketPrice * 100, // assuming ticketPrice is in dollars, needs to be in cents for Stripe
          },
          quantity: numOfSeats, // Ensure quantity is passed and is a number
        }],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      });
    
      res.json({ url: session.url });
    } catch (error) {
      console.error('Stripe API Error:', error.message);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

// Endpoint to get combined user, event, and order details
router.get('/user-events/:userId/:eventId', async (req, res) => {
  const { userId, eventId } = req.params;
  try {
    const query = `
    SELECT
      u.name,
      u.email,
      u.phone_number,
      e.event_name,
      e.location,
      e.date,
      e.start_time,
      e.image,
      r.num_of_seats,
      r.category,
      e.ticket_price
    FROM
      user u
    JOIN
      raffle_entries r ON u.user_id = r.user_id
    JOIN
      events e ON r.event_id = e.event_id
    WHERE
      u.user_id = ? AND e.event_id = ?
  `;
    const [result] = await db.query(query, [userId, eventId]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Data not found' });
    }

     // Convert the BLOB image data to base64
     if (result[0].image) {
      result[0].image = `data:image/jpeg;base64,${result[0].image.toString('base64')}`;
    }
    
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

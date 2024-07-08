const nodemailer = require('nodemailer');
const db = require('../utils/db');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Configure your SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

const sendNotification = async (userId, eventDetails, numOfSeats, categories) => {
  try {
    const [user] = await db.query('SELECT email FROM user WHERE user_id = ?', [userId]);
    if (user.length > 0) {
      const email = user[0].email;
      console.log(`Sending email to ${email}`);

      // Log the event details to check if event_id is present
      console.log('Event Details:', eventDetails);

      const { event_id, event_name, description, date, start_time, location } = eventDetails;

      if (!event_id) {
        throw new Error('Event ID is undefined');
      }

      // HTML email content with inline CSS
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9; border-radius: 10px; width: 600px; margin: 0 auto;">
          <h2 style="color: #4F4CEE; text-align: center;">Congratulations!</h2>
          <p style="font-size: 18px; text-align: center;">You have won the raffle for the event <strong>${event_name}</strong>.</p>
          <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h3 style="color: #333;">Event Details:</h3>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Singapore', dateStyle: 'full' })}</p>
            <p><strong>Start Time:</strong> ${start_time}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Number of Tickets:</strong> ${numOfSeats}</p>
          </div>
          <p style="text-align: center; margin-top: 20px;">
            <a href="https://ticketinghuat.ninja/buyer-info/${userId}/${event_id}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4F4CEE; text-decoration: none; border-radius: 5px;">Proceed to Checkout</a>
          </p>
        </div>
      `;

      // Email sending logic using nodemailer
      const mailOptions = {
        from: `"TicketingHuat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Raffle Win Notification',
        html: htmlContent,
      };

      // Send the email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.error('Error sending email:', error);
        }
        console.log('Email sent:', info.response);
      });
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = { sendNotification };

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

const sendNotification = async (userId, message) => {
  try {
    const [user] = await db.query('SELECT email FROM user WHERE user_id = ?', [userId]);
    if (user.length > 0) {
      const email = user[0].email;
      console.log(`Sending email to ${email}: ${message}`);

      // Email sending logic using nodemailer
      const mailOptions = {
        from: `"TicketingHuat" <${process.env.EMAIL_USER}>`, 
        to: email,
        subject: 'Raffle Win Notification',
        text: message,
        html: `<p>${message}</p>`,
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

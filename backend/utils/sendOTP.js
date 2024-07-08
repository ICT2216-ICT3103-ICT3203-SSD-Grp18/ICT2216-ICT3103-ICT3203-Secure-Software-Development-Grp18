const nodemailer = require('nodemailer');
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

const sendOtp = async (email, otp) => {
  const mailOptions = {
    from: `"TicketingHuat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
    html: `<p>Your OTP code is ${otp}</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info.response);
    });
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `https://ticketinghuat.ninja/reset-password/${token}`;
  const mailOptions = {
    from: `"TicketingHuat" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - TicketingHuat',
    text: `Hello,

We received a request to reset your password for your TicketingHuat account. If you did not make this request, please ignore this email.

To reset your password, please click on the link below or copy and paste it into your browser:

${resetUrl}

This link will expire in 1 hour. 

Thank you,
The TicketingHuat Team`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset your password for your TicketingHuat account. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, please click on the button below:</p>
        <p style="text-align: center;">
          <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #4F4CEE; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </p>
        <p>If the button above does not work, please copy and paste the following link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>Thank you,<br>The TicketingHuat Team</p>
      </div>
    `,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info.response);
    });
  });
};


module.exports = { sendOtp, sendPasswordResetEmail };

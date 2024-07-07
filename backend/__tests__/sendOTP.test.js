const { sendOtp, sendPasswordResetEmail } = require('../utils/sendOTP');
const nodemailer = require('nodemailer');

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockImplementation((mailOptions, callback) => {
      setTimeout(() => {
        callback(null, { response: 'Mail sent' });
      }, 1000); // Mock delay of 1 second
    }),
  }),
}));

describe('sendOtp', () => {
  it('should send OTP email', async () => {
    const email = 'test@example.com';
    const otp = '123456';

    const result = await sendOtp(email, otp);

    expect(result).toBe('Mail sent');
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(1);
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: `"TicketingHuat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
        html: `<p>Your OTP code is ${otp}</p>`,
      }),
      expect.any(Function) // Ensure it accepts a callback function
    );
  });
});

describe('sendPasswordResetEmail', () => {
  it('should send password reset email', async () => {
    const email = 'test@example.com';
    const token = 'abcdef123456';

    const result = await sendPasswordResetEmail(email, token);

    expect(result).toBe('Mail sent');
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledTimes(2); // Adjusted expectation
    expect(nodemailer.createTransport().sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: `"TicketingHuat" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - TicketingHuat',
        // Additional assertions for email content
      }),
      expect.any(Function) // Ensure it accepts a callback function
    );
  });
});

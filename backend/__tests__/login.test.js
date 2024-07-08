process.env.NODE_ENV = 'test';

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const authRoutes = require('../routes/authRoutes');
const db = require('../utils/db'); // Ensure this points to your db mock or real db

// Set up the express app for testing
const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'test-secret',
  resave: false,
  saveUninitialized: false,
}));
app.use('/api/auth', authRoutes);

async function getOtpForUser(email) {
  // First, get the user ID from the email
  const [userRows] = await db.execute('SELECT user_id FROM user WHERE email = ?', [email]);
  if (userRows.length === 0) {
    throw new Error('User not found');
  }
  const userId = userRows[0].user_id;

  // Then, get the OTP using the user ID
  const [otpRows] = await db.execute('SELECT otp FROM otps WHERE user_id = ? ', [userId]);
  return otpRows.length > 0 ? otpRows[0].otp : null;
}

describe('Auth Routes - Login', () => {
  it('should return validation error for invalid email on POST /login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'invalid-email',
        password: 'Password1!',
      });

    expect(response.status).toBe(400);  // Expect a validation error
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContainEqual(expect.objectContaining({
      msg: 'Invalid email'
    }));
  });

  it('should return validation error for weak password on POST /login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'weakpassword',
      });

    expect(response.status).toBe(400);  // Expect a validation error
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContainEqual(expect.objectContaining({
      msg: 'Password must be 8-12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters'
    }));
  });

  it('should return error for invalid email or password on POST /login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'Password1!',
      });

    expect(response.status).toBe(401);  // Expect an invalid email or password error
    expect(response.body).toHaveProperty('message', 'Invalid email or password');
  });

  it('should successfully log in a user with valid input on POST /login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sigs51451@gmail.com',
        password: 'Password69$$',
      });

    expect(response.status).toBe(200);  // Expect a successful login
    expect(response.body).toHaveProperty('message', 'OTP sent to your email');
    expect(response.body).toHaveProperty('otpRequired', true);

    // Fetch the OTP from the database
    const otp = await getOtpForUser('sigs51451@gmail.com');
    expect(otp).not.toBeNull(); // Ensure the OTP was fetched

    // Verify the OTP
    const otpResponse = await request(app)
      .post('/api/auth/verify-otp')
      .send({
        email: 'sigs51451@gmail.com',
        otp: otp,
      });

    expect(otpResponse.status).toBe(200);  // Expect a successful OTP verification
    expect(otpResponse.body).toHaveProperty('message', 'Login successful');
    expect(otpResponse.body).toHaveProperty('user');
    expect(otpResponse.body.user).toHaveProperty('id');
    expect(otpResponse.body.user).toHaveProperty('email', 'sigs51451@gmail.com');
    expect(otpResponse.body.user).toHaveProperty('role');
  });

  it('should send a password reset email on POST /forgot-password', async () => {
    const response = await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'sigs51451@gmail.com',
      });

    expect(response.status).toBe(202); // Expect the email to be sent
    expect(response.body).toHaveProperty('message', 'Password reset email sent. Please check your email.');

    // Verify that the reset token was stored in the database
    const [rows] = await db.execute('SELECT reset_token FROM user WHERE email = ?', ['sigs51451@gmail.com']);
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].reset_token).not.toBeNull();
  });

  it('should successfully reset password with valid input on POST /reset-password', async () => {
    // Step 1: Trigger forgot password to get the reset token
    await request(app)
      .post('/api/auth/forgot-password')
      .send({
        email: 'sigs51451@gmail.com',
      });

    // Fetch the reset token from the database
    const [rows] = await db.execute('SELECT reset_token FROM user WHERE email = ?', ['sigs51451@gmail.com']);
    const resetToken = rows[0].reset_token;
    expect(resetToken).not.toBeNull();

    // Step 2: Use the reset token to reset the password
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        token: resetToken,
        newPassword: 'Password69$$',
      });

    expect(response.status).toBe(200); // Expect a successful password reset
    expect(response.body).toHaveProperty('message', 'Password reset successfully');

    // Verify that the reset token is nullified in the database
    const [nullifiedTokenRows] = await db.execute('SELECT reset_token FROM user WHERE email = ?', ['sigs51451@gmail.com']);
    expect(nullifiedTokenRows[0].reset_token).toBeNull();

    const response1 = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sigs51451@gmail.com',
        password: 'Password69$$',
      });

    expect(response1.status).toBe(200);  // Expect a successful login
    expect(response1.body).toHaveProperty('message', 'OTP sent to your email');
    expect(response1.body).toHaveProperty('otpRequired', true);
  });
});
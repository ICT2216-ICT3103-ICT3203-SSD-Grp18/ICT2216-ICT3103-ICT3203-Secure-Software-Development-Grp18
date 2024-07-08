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

// Clean up the database before each test
beforeEach(async () => {
  await db.execute('DELETE FROM user WHERE email = ?', ['test@example.com']);
  // Add more cleanup queries if needed
});

// Clean up the database after all tests
afterAll(async () => {
  await db.execute('DELETE FROM user WHERE email = ?', ['test@example.com']);
  await db.end(); // Close the database connection pool
});

describe('Auth Routes - Register', () => {
  it('should return validation error for empty name on POST /register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        phone_number: '1234567890',
        email: 'test@example.com',
        password: 'Password1!',
      });

    expect(response.status).toBe(400);  // Expect a validation error
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContainEqual(expect.objectContaining({
      msg: 'Name is required and cannot contain special characters'
    }));
  });

  it('should return validation error for invalid phone number on POST /register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        phone_number: 'invalid-phone-number',
        email: 'test@example.com',
        password: 'Password1!',
      });

    expect(response.status).toBe(400);  // Expect a validation error
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContainEqual(expect.objectContaining({
      msg: 'Invalid phone number'
    }));
  });

  it('should return validation error for invalid email on POST /register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'invalid-email',
        password: 'Password1!',
      });

    expect(response.status).toBe(400);  // Expect a validation error
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContainEqual(expect.objectContaining({
      msg: 'Invalid email'
    }));
  });

  it('should return validation error for weak password on POST /register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'test@example.com',
        password: 'weakpassword',
      });

    expect(response.status).toBe(400);  // Expect a validation error
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toContainEqual(expect.objectContaining({
      msg: 'Password must be 8-12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters'
    }));
  });

  it('should successfully register a user with valid input on POST /register', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'John Doe',
        phone_number: '1234567890',
        email: 'test@example.com',
        password: 'Password1!',
      });

    expect(response.status).toBe(201);  // Expect a successful registration
    expect(response.body).toHaveProperty('message', 'User registered successfully');
    expect(response.body).toHaveProperty('userId');
  });
});

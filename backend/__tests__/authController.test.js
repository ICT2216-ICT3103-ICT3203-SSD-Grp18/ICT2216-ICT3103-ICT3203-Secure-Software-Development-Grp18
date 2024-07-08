const { login, register, verifyOtp } = require('../controllers/authController');
const db = require('../utils/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const { validationResult } = require('express-validator');
const { sendOtp } = require('../utils/sendOTP');
const crypto = require('crypto');

jest.mock('../utils/db');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../utils/sendOTP');

describe('AuthController Unit Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // describe('login', () => {

  //   it('should return 401 if user is not found', async () => {
  //     db.execute.mockResolvedValue([[]]);
  //     const req = httpMocks.createRequest({
  //       body: { email: 'test@example.com', password: 'Valid@123' }
  //     });
  //     const res = httpMocks.createResponse();
  //     await login[login.length - 1](req, res);
  //     expect(res.statusCode).toBe(401);
  //     expect(res._getJSONData().message).toBe('Invalid email or password');
  //   });

  //   it('should return 401 if password does not match', async () => {
  //     db.execute.mockResolvedValue([[{ user_id: 1, email: 'test@example.com', password: 'hashedpassword' }]]);
  //     bcrypt.compare.mockResolvedValue(false);
  //     const req = httpMocks.createRequest({
  //       body: { email: 'test@example.com', password: 'InvalidPassword' }
  //     });
  //     const res = httpMocks.createResponse();
  //     await login[login.length - 1](req, res);
  //     expect(res.statusCode).toBe(401);
  //     expect(res._getJSONData().message).toBe('Invalid email or password');
  //   });

  // });

  // describe('register', () => {

  //   it('should return 201 if user is registered successfully', async () => {
  //     db.execute.mockResolvedValue([{ insertId: 1 }]);
  //     bcrypt.hash.mockResolvedValue('hashedpassword');
  //     const req = httpMocks.createRequest({
  //       body: { name: 'Test User', phone_number: '1234567890', email: 'test@example.com', password: 'Valid@123' }
  //     });
  //     const res = httpMocks.createResponse();
  //     await register[register.length - 1](req, res);
  //     expect(res.statusCode).toBe(201);
  //     expect(res._getJSONData().message).toBe('User registered successfully');
  //     expect(res._getJSONData().userId).toBe(1);
  //   });

  //   it('should return 500 if there is a server error during registration', async () => {
  //     db.execute.mockRejectedValue(new Error('Database error'));
  //     const req = httpMocks.createRequest({
  //       body: { name: 'Test User', phone_number: '1234567890', email: 'test@example.com', password: 'Valid@123' }
  //     });
  //     const res = httpMocks.createResponse();
  //     await register[register.length - 1](req, res);
  //     expect(res.statusCode).toBe(500);
  //     expect(res._getJSONData().message).toBe('Server error');
  //   });
  // });

  describe('verifyOtp', () => {
    it('should return 400 if email or OTP is missing', async () => {
      const req = httpMocks.createRequest({
        body: { email: '', otp: '' }
      });
      const res = httpMocks.createResponse();
      await verifyOtp(req, res);
      console.log('Response Data:', res._getData());  // Add log here
      expect(res.statusCode).toBe(400);
      expect(res._getJSONData().message).toBe('Email and OTP are required');
    });

    it('should return 401 if OTP is invalid', async () => {
      const req = httpMocks.createRequest({
        body: { email: 'test@example.com', otp: '123456' }
      });
      const res = httpMocks.createResponse();
      const otps = { 'test@example.com': '654321' };
      await verifyOtp(req, res);
      console.log('Response Data:', res._getData());  // Add log here
      expect(res.statusCode).toBe(401);
      expect(res._getJSONData().message).toBe('Invalid OTP');
    });

  });
});

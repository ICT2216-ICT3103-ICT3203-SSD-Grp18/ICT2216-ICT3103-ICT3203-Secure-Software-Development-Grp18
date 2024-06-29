import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../axiosConfig';
import validator from 'validator';
import DOMPurify from 'dompurify';

const LoginModal = ({ isOpen, onClose, isLogin: initialIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

  // sanitize and trim spaces
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());
  };

  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    return validator.isMobilePhone(phoneNumber, 'en-SG');
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    return passwordRegex.test(password);
  };

  const validateName = (name) => {
    const nameRegex = /^[a-zA-Z\s]+$/;
    return nameRegex.test(name);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateEmail(sanitizedEmail)) {
      setErrors({ email: 'Please enter a valid email address.' });
      return;
    }

    try {
      await login(sanitizedEmail, sanitizedPassword);
      alert('Login successful');
      onClose();
    } catch (error) {
      alert('Login failed. Please check your credentials and try again.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp });
      if (response.data.message === 'Login successful') {
        await login({ email, otp });
        alert('Login successful!');
        setIsOtpSent(false);
        onClose();
      } else {
        alert('Invalid OTP. Please try again.');
        setIsOtpSent(false);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsOtpSent(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedPhoneNumber = sanitizeInput(phoneNumber);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    const newErrors = {};

    if (!validateEmail(sanitizedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!validatePhoneNumber(sanitizedPhoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number.';
    }
    if (!validatePassword(sanitizedPassword)) {
      newErrors.password = 'Password must be 8-12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters.';
    }
    if (!validateName(sanitizedFirstName)) {
      newErrors.firstName = 'Please enter a valid first name.';
    }
    if (!validateName(sanitizedLastName)) {
      newErrors.lastName = 'Please enter a valid last name.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const name = `${sanitizedFirstName} ${sanitizedLastName}`;
    const user = {
      name,
      phone_number: sanitizedPhoneNumber,
      email: sanitizedEmail,
      password: sanitizedPassword
    };

    try {
      const response = await apiClient.post('/auth/register', user);
      if (response.status === 201) {
        alert('User registered successfully');
        onClose();
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      if (response.status === 200) {
        setMessage('Password reset email sent. Please check your email.');
      } else {
        setMessage('Error sending password reset email');
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <h2>{isLogin ? 'Log in to continue' : 'Sign Up to continue'}</h2>
        </div>
        <div className="tab-container">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Log In
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>
        {isLogin && !isOtpSent && !isResetPassword && (
          <>
            <form onSubmit={handleLogin}>
              <label>
                Email Address:
                <input
                  className="auth-form-input"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                Password:
                <input
                  className="auth-form-input"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit">Log In</button>
            </form>
            <button className="forgot-password" onClick={() => setIsResetPassword(true)}>
              Forgot Password?
            </button>
          </>
        )}
        {isLogin && isOtpSent && (
          <form onSubmit={handleVerifyOtp}>
            <label>
              OTP:
              <input
                className="auth-form-input"
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </label>
            <button type="submit">Verify OTP</button>
          </form>
        )}
        {!isLogin && (
          <form onSubmit={handleSignUp}>
            <label>
              First Name:
              <input
                className="auth-form-input"
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              {errors.firstName && <p className="error">{errors.firstName}</p>}
            </label>
            <label>
              Last Name:
              <input
                className="auth-form-input"
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
              {errors.lastName && <p className="error">{errors.lastName}</p>}
            </label>
            <label>
              Phone Number:
              <input
                className="auth-form-input"
                type="text"
                name="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
              {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
            </label>
            <label>
              Email Address:
              <input type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </label>
            <label>
              Password:
              <input
                className="auth-form-input"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </label>
            <p className="note">
              E-tickets will be sent to your email address, please make sure your email address is correct.
            </p>
            <button type="submit">Sign Up</button>
          </form>
        )}
        {isResetPassword && (
          <form onSubmit={handleForgotPassword}>
            <label>
              Email Address:
              <input
                className="auth-form-input"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Send Reset Email</button>
          </form>
        )}
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default LoginModal;

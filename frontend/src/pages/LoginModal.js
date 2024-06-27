import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../axiosConfig';
import '../styles/css/LoginModal.css';

const LoginModal = ({ isOpen, onClose, isLogin: initialIsLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    setIsLogin(initialIsLogin);
  }, [initialIsLogin]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.otpRequired) {
        setIsOtpSent(true);
        alert('OTP sent to your email');
      } else {
        await login(email, password);
        alert('Login successful');
        onClose();
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/auth/verify-otp', { email, otp });
      if (response.data.message === 'Login successful') {
        await login({ email, otp }); // Log the user in using the OTP
        alert('Login successful!');
        setIsOtpSent(false);
        onClose();
      } else {
        alert('Invalid OTP. Please try again.');
        setIsOtpSent(false); // Reset to login state on failed OTP
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
      setIsOtpSent(false); // Reset to login state on error
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const name = `${firstName} ${lastName}`;
    const user = {
      name,
      phone_number: phoneNumber,
      email,
      password
    };

    try {
      const response = await apiClient.post('/auth/register', user);
      if (response.status === 201) {
        alert('User registered successfully');
        onClose();
      } else {
        const error = await response.data;
        alert(`Error: ${error.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
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
        {isLogin && !isOtpSent && (
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
            </label>
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
            <p className="note">E-tickets will be sent to your email address, please make sure your email address is correct.</p>
            <button type="submit">Continue</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginModal;

import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../axiosConfig';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/auth/check', { withCredentials: true });
        if (response.data.active) {
          setIsLoggedIn(true);
          const userResponse = await apiClient.get('/auth/getUser', { withCredentials: true });
          setUser(userResponse.data);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        setIsLoggedIn(false);
      } finally {
        setAuthChecked(true);
      }
    };

    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked]);

  const handleSessionInvalidation = () => {
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const login = async ({ email, password, otp }) => {
    try {
      let response;
      if (otp) {
        response = await apiClient.post('/auth/verify-otp', { email, otp }, {
          withCredentials: true,
          onSessionInvalidated: handleSessionInvalidation
        });
      } else {
        response = await apiClient.post('/auth/login', { email, password }, {
          withCredentials: true,
          onSessionInvalidated: handleSessionInvalidation
        });
        if (response.data.otpRequired) {
          return { otpRequired: true };
        }
      }
      if (response && response.status === 200) {
        setIsLoggedIn(true);
        const userResponse = await apiClient.get('/auth/getUser', { withCredentials: true });
        setUser(userResponse.data);
        return { status: 200 };
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {}, {
        withCredentials: true,
        onSessionInvalidated: handleSessionInvalidation
      });
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      throw new Error('Logout failed');
    }
  };

  const value = {
    isLoggedIn,
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
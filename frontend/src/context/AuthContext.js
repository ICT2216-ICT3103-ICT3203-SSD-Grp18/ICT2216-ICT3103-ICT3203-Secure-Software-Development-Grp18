import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../axiosConfig';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await apiClient.get('/auth/check', { withCredentials: true });
        if (response.status === 200) {
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

  const login = async ({ email, password, otp }) => {
    try {
      if (otp) {
        setIsLoggedIn(true);
        const userResponse = await apiClient.get('/auth/getUser', { withCredentials: true });
        setUser(userResponse.data);
      } else {
        const response = await apiClient.post('/auth/login', { email, password }, { withCredentials: true });
        if (response.status === 200) {
          setIsLoggedIn(true);
          const userResponse = await apiClient.get('/auth/getUser', { withCredentials: true });
          setUser(userResponse.data);
        } else {
          throw new Error('Login failed');
        }
      }
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout', {}, { withCredentials: true });
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

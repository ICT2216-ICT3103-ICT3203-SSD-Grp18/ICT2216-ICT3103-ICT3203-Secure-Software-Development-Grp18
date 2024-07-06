import React, { useEffect, useState } from 'react';
import apiClient from './axiosConfig';
import SessionExpiryModal from './components/SessionExpiryModal';

const SessionManager = () => {
  const [showModal, setShowModal] = useState(false);

  // Function to extend the session
  const extendSession = async () => {
    try {
      const response = await apiClient.post('/auth/extend-session');
      if (response.data.success) {
        alert('Session extended by 30 minutes');
        resetSessionTimer();
      } else {
        alert('Failed to extend session');
      }
    } catch (error) {
      console.error('Error extending session:', error);
      alert('Error extending session');
    }
  };

  // Function to handle session extension from the modal
  const handleExtendSession = () => {
    setShowModal(false);
    extendSession();
  };

  // Function to handle closing the modal
  const handleClose = () => setShowModal(false);

  // Function to reset the session timer
  const resetSessionTimer = () => {
    clearTimeout(window.sessionTimer);
    window.sessionTimer = setTimeout(() => setShowModal(true), 27 * 60 * 1000);
  };

  useEffect(() => {
    resetSessionTimer();

    // Cleanup timer on component unmount
    return () => {
      clearTimeout(window.sessionTimer);
    };
  }, []);

  return (
    <SessionExpiryModal
      show={showModal}
      handleExtendSession={handleExtendSession}
      handleClose={handleClose}
    />
  );
};

export default SessionManager;

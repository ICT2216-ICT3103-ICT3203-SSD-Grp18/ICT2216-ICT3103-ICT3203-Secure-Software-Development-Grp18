import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/CompletionPage.css';
import successImage from '../styles/images/completion/success.png'; // Add a success image
import apiClient from '../axiosConfig';

const SuccessPage = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await apiClient.get('/auth/getUser', { withCredentials: true });
        if (response.status === 200) {
          setEmail(response.data.email);
        } else {
          console.error('Failed to fetch user email');
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchUserEmail();
  }, []);

  return (
    <div className="completion-page">
      <Navbar />
      <div className="completion-content">
        <img src={successImage} alt="Success" className="result-image" />
        <h1>Payment Successful!</h1>
        <p>Your tickets have been sent to</p>
        <p>{email}</p>
        <p className="trouble">Having trouble receiving the tickets?</p>
        <div className="contact-info">
          <p>+65 82729292</p>
          <p>TicketingHuat@Ticketinghuat.com</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SuccessPage;

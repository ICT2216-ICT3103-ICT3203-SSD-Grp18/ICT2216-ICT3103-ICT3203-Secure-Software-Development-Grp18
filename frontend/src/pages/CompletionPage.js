import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/CompletionPage.css';
import completedImage from '../styles/images/completion/completed.png';
import resultImage from '../styles/images/completion/success.png';
import apiClient from '../axiosConfig';

const CompletionPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await apiClient.get('/auth/getUser', { withCredentials: true });
        if (response.status === 200) {
          setEmail(response.data.email);
        } else {
          setError('Failed to fetch user email. Please try again later.');
        }
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Error fetching user email. Please try again later.');
        }
      }
    };
    fetchUserEmail();
  }, []);

  return (
    <div className="completion-page">
      <Navbar />
      <div className="completion-content">
        <img src={completedImage} alt="Completed" className="completed-image" />
        <img src={resultImage} alt="Result" className="result-image" />
        <h1>Results will be sent to</h1>
        {error ? <p className="error-message">{error}</p> : <p>{email}</p>}
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

export default CompletionPage;

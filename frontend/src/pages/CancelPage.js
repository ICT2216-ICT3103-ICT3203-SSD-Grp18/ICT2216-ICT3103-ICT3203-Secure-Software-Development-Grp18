import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// import cancelImage from '../styles/images/completion/cancel.png'; // Add a cancel image


const CancelPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="completion-page">
      <Navbar />
      <div className="completion-content">
        {/* <img src={cancelImage} alt="Cancel" className="result-image" /> */}
        <h1>Payment Cancelled</h1>
        <p>Your payment has been cancelled. You can try again or contact support for assistance.</p>
        <p className="trouble">Need help?</p>
        <div className="contact-info">
          <p>+65 82729292</p>
          <p>TicketingHuat@Ticketinghuat.com</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};


export default CancelPage;

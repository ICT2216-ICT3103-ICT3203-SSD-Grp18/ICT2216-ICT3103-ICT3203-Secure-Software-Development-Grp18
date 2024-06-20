import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/CompletionPage.css';

const CompletionPage = () => {
  return (
    <div className="completion-page">
      <Navbar />
      <div className="completion-content">
        <h1>Completed!</h1>
        <p>Results will be sent to Johncena@gmail.com</p>
        <p>Having trouble receiving the tickets?</p>
        <p>Contact us at:</p>
        <p>+65 82729292</p>
        <p>TicketingHuat@Ticketinghuat.com</p>
      </div>
      <Footer />
    </div>
  );
};

export default CompletionPage;

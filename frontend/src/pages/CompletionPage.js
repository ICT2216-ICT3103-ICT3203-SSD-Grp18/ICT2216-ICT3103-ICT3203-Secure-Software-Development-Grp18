import React, { useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/CompletionPage.css';

const CompletionPage = () => {
    const [email, setEmail] = useState('');


    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        setEmail(userEmail);
      }, []);




  return (
    <div className="completion-page">
      <Navbar />
      <div className="completion-content">
        <h1>Completed!</h1>
        <p>Results will be sent to {email}</p>
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

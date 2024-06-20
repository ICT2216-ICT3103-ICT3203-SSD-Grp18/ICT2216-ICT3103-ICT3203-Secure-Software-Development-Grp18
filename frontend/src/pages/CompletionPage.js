import React, { useEffect, useState} from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/CompletionPage.css';
import completedImage from '../styles/images/completion/completed.png'; 
import resultImage from '../styles/images/completion/success.png'; 


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
      <img src={completedImage} alt="Completed" className="completed-image" />
      <img src={resultImage} alt="Result" className="result-image" />
        {/* <h1>Completed!</h1> */}
        <h1>Results will be sent to</h1>
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

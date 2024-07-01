import React from 'react';
// import { loadStripe } from '@stripe/stripe-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BuyButtonComponent from '../components/BuyButtonComponent'; // Import the BuyButtonComponent
import '../styles/css/PaymentPage.css';

// Replace 'your-publishable-key-here' with your actual Stripe publishable key
//const stripePromise = loadStripe('pk_test_51PVI05CUt9oD7CwsdbYaXxSbAJr5PdleGxgHG9afJFVlLTgdCnw9IJev590E3QZ7Orc94qXf8kORs6ezCHN22hkK00kAWXJCmJ');

const PaymentPage = () => {
  return (
    <div className="payment-page">
      <Navbar />
      <div className="content">
        <div className="payment-method">
          <div className="payment-header">
            <button className="back-button" onClick={() => window.history.back()}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#6200ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h2>Payment Method</h2>
          </div>
          {/* Integrate BuyButtonComponent here */}
          <BuyButtonComponent />
        </div>
        <div className="event-summary">
          <h3>Event Details</h3>
          <img src="path/to/event-image.jpg" alt="Event" className="event-image" />
          <p>IU: HER World Tour</p>
          <p>National Stadium</p>
          <p>December 20, 2024 - 19:00 SGT</p>
          
          <h3>Order Summary</h3>
          <p>Ticket Type: 2 x VIP</p>
          <p>Ticket Price: 2 x Sgd. $368.00</p>
          <p>Service & Handling: -</p>
          <p>Admin Fee: Sgd. $6.00</p>
          <p>Total: Sgd. $736.00</p>
        </div>
      </div>
      <Footer /> 
    </div>
  );
};

export default PaymentPage;

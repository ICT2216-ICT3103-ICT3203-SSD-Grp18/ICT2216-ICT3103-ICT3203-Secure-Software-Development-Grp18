import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/BuyerContactInformationPage.css';

const BuyerContactInformationPage = () => {
  const navigate = useNavigate();
  const [buyerInfo, setBuyerInfo] = useState({
    firstName: 'John',
    lastName: 'Cena',
    email: 'Johncena@gmail.com',
    confirmEmail: '',
    phone: '84181159',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const { firstName, lastName, email, confirmEmail, phone } = buyerInfo;
    if (firstName && lastName && email && confirmEmail && phone && email === confirmEmail) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [buyerInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBuyerInfo({
      ...buyerInfo,
      [name]: value,
    });
  };

  const handleConfirm = () => {
    console.log(buyerInfo);
    setShowConfirmation(false);
    navigate('/payment');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="buyer-contact-info-page">
      <Navbar />
      <div className="content">
        <div className="form-section">
          <div className="buyer-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#6200ea" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h2>Buyer Contact Information</h2>
          </div>
          <p className="info-text">E-tickets will be sent to your email address, please make sure your email address is correct.</p>
          <form className="buyer-info" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" value={buyerInfo.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" value={buyerInfo.lastName} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" name="email" value={buyerInfo.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Confirm Email Address</label>
                <input type="email" name="confirmEmail" value={buyerInfo.confirmEmail} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" name="phone" value={buyerInfo.phone} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className={`submit-button ${!isButtonDisabled ? 'enabled' : ''}`} disabled={isButtonDisabled}>Continue to Payment</button>
          </form>
        </div>
        <div className="event-summary">
          <h3>Event Details</h3>
          <img src="path/to/event-image.jpg" alt="Event" className="event-image" />
          <p>IU: HER World Tour</p>
          <p>National Stadium</p>
          <p>December 20, 2024 - 19:00 SGT</p>
          <h3>Order Summary</h3>
          <div className="order-summary">
            <p><span>Ticket Type:</span> 2 x VIP</p>
            <p><span>Ticket Price:</span> 2 x Sgd. $368.00</p>
            <p><span>Service & Handling:</span> -</p>
            <p><span>Admin Fee:</span> -</p>
            <p><strong>Total:</strong> Sgd. $736.00</p>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Confirm Your Information</h3>
            <p><strong>First Name:</strong> {buyerInfo.firstName}</p>
            <p><strong>Last Name:</strong> {buyerInfo.lastName}</p>
            <p><strong>Email:</strong> {buyerInfo.email}</p>
            <p><strong>Phone Number:</strong> {buyerInfo.phone}</p>
            <button onClick={handleConfirm} className="confirm-button">Confirm</button>
            <button onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BuyerContactInformationPage;

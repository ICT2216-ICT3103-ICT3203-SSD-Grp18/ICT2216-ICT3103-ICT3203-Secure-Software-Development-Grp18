import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/BuyerContactInformationPage.css';
import { useAuth } from '../context/AuthContext';
import apiClient from '../axiosConfig';

const BuyerContactInformationPage = () => {
  const navigate = useNavigate();
  const { userId, eventId } = useParams();
  const { isLoggedIn } = useAuth();

  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    phone: '',
  });
  const [eventDetails, setEventDetails] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(`/user-events/${userId}/${eventId}`);
        const data = response.data;

        setBuyerInfo({
          name: data.name,
          email: data.email,
          confirmEmail: '',
          phone: data.phone_number,
        });

        setEventDetails({
          eventName: data.event_name,
          location: data.location,
          date: data.date,
          startTime: data.start_time,
          image: data.image,
          ticketType: data.category,
          ticketPrice: data.ticket_price,
          numOfSeats: data.num_of_seats, // Make sure this is set
          totalPrice: data.num_of_seats * data.ticket_price,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId, eventId]);

  useEffect(() => {
    const { name, email, confirmEmail, phone } = buyerInfo;
    if (name && email && confirmEmail && phone && email === confirmEmail) {
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

  // const handleConfirm = async () => {
  //   try {
  //     const response = await apiClient.post('/create-checkout-session', {
  //       eventId: eventId,
  //       ticketPrice: eventDetails.ticketPrice,
  //       numOfSeats: eventDetails.numOfSeats,
  //       eventName: eventDetails.eventName,
  //       eventImage: eventDetails.eventImage,
  //     });
  //     const { url } = response.data;
  //     window.location.href = url; // Redirect to Stripe Checkout
  //   } catch (error) {
  //     console.error('Error creating checkout session:', error);
  //   }
  // };

  const handleConfirm = async () => {
    try {
      console.log('Event Details:', eventDetails); // Log event details to verify
  
      if (!eventDetails.numOfSeats || eventDetails.numOfSeats <= 0) {
        throw new Error('Number of seats must be greater than zero');
      }
  
      const response = await apiClient.post('/create-checkout-session', {
        eventId: eventId,
        ticketPrice: eventDetails.ticketPrice,
        numOfSeats: eventDetails.numOfSeats,
        eventName: eventDetails.eventName,
        eventImage: eventDetails.eventImage,
      });
      const { url } = response.data;
      window.location.href = url; // Redirect to Stripe Checkout
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
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
                <label>Name</label>
                <input type="text" name="name" value={buyerInfo.name} onChange={handleChange} />
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
                <input type="text" name="phone" value={buyerInfo.phone} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className={`submit-button ${!isButtonDisabled ? 'enabled' : ''}`} disabled={isButtonDisabled}>Continue to Payment</button>
          </form>
        </div>
        <div className="event-summary">
          <h3>Event Details</h3>
          {eventDetails.image && <img src={eventDetails.image} alt="Event" className="event-image" />}
          <p>{eventDetails.eventName}</p>
          <p>{eventDetails.location}</p>
          <p>{new Date(eventDetails.date).toLocaleString()}</p>
          <h3>Order Summary</h3>
          <div className="order-summary">
            <p><span>Ticket Type:</span> {eventDetails.ticketType}</p>
            <p><span>Ticket Price:</span> SGD {eventDetails.ticketPrice}</p>
            <p><span>Service & Handling:</span> -</p>
            <p><span>Admin Fee:</span> -</p>
            <p><strong>Total:</strong> SGD {eventDetails.totalPrice}</p>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <div className="confirmation-modal">
          <div className="modal-content">
            <h3>Confirm Your Information</h3>
            <p><strong>Name:</strong> {buyerInfo.name}</p>
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

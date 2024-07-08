import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import '../styles/css/TicketPage.css';
import apiClient from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TicketPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchEventDetails = async () => {
      console.log(`Fetching event details for event ID: ${eventId}`);
      try {
        const response = await apiClient.get(`/events/${eventId}`, { withCredentials: true });
        if (response.status !== 200) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = response.data;
        console.log('Event details fetched:', data);
        setEvent(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleTicketChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setTicketCount(value);
    console.log('Updated ticket quantity:', value);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert('You need to be logged in to purchase tickets');
      return;
    }
  
    try {
      // Check if user has already entered the raffle
      const checkEntryResponse = await apiClient.get(`/raffle/hasEntered?eventId=${eventId}`, { withCredentials: true });
      //console.log(eventId, ticketQuantity)
      if (checkEntryResponse.data.hasEntered) {
        alert('You have already entered the raffle for this event');
        navigate(`/ticket/${eventId}`);
        return;
      }
  
      // Enter the raffle
      const response = await apiClient.post('/raffle/enter', { eventId, ticketCount }, { withCredentials: true });
  
      if (response.status >= 200 && response.status < 300) {
        alert('Raffle entry successful');
        navigate('/completion');
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Error loading event details.</div>;
  }

  return (
    <>
      <Navbar />

      <div className="ticket-page-container">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left"></i>
          </button>
          <h2 className="ticket-options-title">Ticket Options</h2>
        </div>

        <div className="concert-details">
          <img src={`data:image/png;base64,${event.image}`} alt={event.event_name} className="concert-image" />
          <div className="concert-info">
            <h1>{event.event_name}</h1>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {event.start_time}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p>{event.description}</p>
          </div>
        </div>

        <div className="ticket-options">
          <h2>Select Ticket Quantity</h2>
          <div className="ticket-quantity">
            <select value={ticketCount} onChange={handleTicketChange}>
              <option value={0}>0</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>

        {error && <div className='ticket-error-msg'>
          <p>{error}</p>
        </div>}
        
        <div className="footer-ticket-page">
          {ticketCount > 0 ? (
            <div className="summary">
              <div className="summary-row">
                <p>Qty</p>
                <p>Price Total (SGD)</p>
              </div>
              <div className="summary-row">
                <p>{ticketCount}</p>
                <p>SGD {(ticketCount * event.ticket_price).toFixed(2)}</p>
              </div>
            </div>
          ) : (
            <p className='choose-quantity'>Choose your tickets and quantity.</p>
          )}
          {ticketCount > 0 && <button className="purchase-button" onClick={handleSubmit}>Enter Raffle</button>}
        </div>
      </div>
    </>
  );
};

export default TicketPage;

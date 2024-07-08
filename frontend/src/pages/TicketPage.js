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
  const [categories, setCategories] = useState([]);
  const [ticketCount, setTicketCount] = useState([]);
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
        setCategories(data.categories || []);
        setTicketCount((data.categories || []).map(() => 0));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event details:', error);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const incrementTicket = (index) => {
    console.log(`Incrementing ticket count for category index: ${index}`);
    const newTicketCount = [...ticketCount];
    const selectedCategories = newTicketCount.filter(count => count > 0).length;

    if (newTicketCount[index] === 2 || (selectedCategories > 0 && newTicketCount[index] === 0)) {
      setError('You can only select max 2 tickets from the same category');
    } else {
      setError('');
      newTicketCount[index]++;
      setTicketCount(newTicketCount);
    }
    console.log('Updated ticket count:', newTicketCount);
  };

  const decrementTicket = (index) => {
    console.log(`Decrementing ticket count for category index: ${index}`);
    const newTicketCount = [...ticketCount];
    if (newTicketCount[index] > 0) {
      newTicketCount[index]--;
      setTicketCount(newTicketCount);
      setError('');
    }
    console.log('Updated ticket count:', newTicketCount);
  };

  const hasSelectedTickets = ticketCount.some(count => count > 0);

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert('You need to be logged in to purchase tickets');
      return;
    }
  
    try {
      // Check if user has already entered the raffle
      const checkEntryResponse = await apiClient.get(`/raffle/hasEntered?eventId=${eventId}`, { withCredentials: true });
  
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
          {categories.map((category, index) => (
            <div key={category.id} className={`ticket-category ${ticketCount[index] > 0 ? 'selected' : ''}`}>
              <h2>{category.name}</h2>
              <p>SGD {category.price.toFixed(2)}</p>
              <div className="ticket-quantity">
                <button onClick={() => decrementTicket(index)}>-</button>
                <span>{ticketCount[index]}</span>
                <button onClick={() => incrementTicket(index)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {error && <div className='ticket-error-msg'>
          <p>{error}</p>
        </div>}
        
        <div className="footer-ticket-page">
          {hasSelectedTickets ? (
            <div className="summary">
              <div className="summary-row">
                <p>Qty</p>
                <p>Type</p>
                <p>Price Total (SGD)</p>
              </div>
              {categories.map((category, index) => ticketCount[index] > 0 && (
                <div key={category.id} className="summary-row">
                  <p>{ticketCount[index]}</p>
                  <p>{category.name}</p>
                  <p>SGD {(ticketCount[index] * category.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='choose-quantity'>Choose your tickets and quantity.</p>
          )}
          {hasSelectedTickets && <button className="purchase-button" onClick={handleSubmit}>Enter Raffle</button>}
        </div>
      </div>
    </>
  );
};

export default TicketPage;

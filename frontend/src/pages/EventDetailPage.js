import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/EventDetailPage.css';
import apiClient from '../axiosConfig';
import TicketingEventDetails from '../components/TicketingEventDetails';
import { useAuth } from '../context/AuthContext';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [raffleStarted, setRaffleStarted] = useState(false);
  const [raffleEnded, setRaffleEnded] = useState(false);
  const [hasEnteredRaffle, setHasEnteredRaffle] = useState(false);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await apiClient.get(`/events/${eventId}`, { withCredentials: true });
        if (response.status !== 200) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = response.data;
        setEvent(data);

        const raffleStartTime = new Date(data.raffle_start_date).getTime();
        const raffleEndTime = new Date(data.raffle_end_date).getTime();
        const currentTime = new Date().getTime();

        if (currentTime < raffleStartTime) {
          setTimeLeft(raffleStartTime - currentTime);
          setRaffleStarted(false);
        } else if (currentTime < raffleEndTime) {
          setTimeLeft(raffleEndTime - currentTime);
          setRaffleStarted(true);
        } else {
          setTimeLeft(0);
          setRaffleEnded(true);
        }

        setLoading(false);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTimeLeft => prevTimeLeft - 1000);
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [timeLeft]);

  useEffect(() => {
    const checkRaffleEntry = async () => {
      if (isLoggedIn) {
        try {
          const response = await apiClient.get(`/raffle/hasEntered?eventId=${eventId}`, { withCredentials: true });
          setHasEnteredRaffle(response.data.hasEntered);
        } catch (error) {
          console.error('Error checking raffle entry:', error);
        }
      }
    };

    checkRaffleEntry();
  }, [isLoggedIn, eventId]);

  const formatTimeLeft = () => {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  const handleRaffleClick = async () => {
    if (!isLoggedIn) {
      alert('You need to be logged in to enter the raffle');
      return;
    }

    if (hasEnteredRaffle) {
      alert('You have already entered the raffle for this event');
      return;
    } else {
      navigate(`/ticket/${eventId}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="event-detail-page">
      <Navbar />
      <div className="event-detail-page-content">
        <header className="event-header">
          <div className="header-container">
            <div className="share-buttons">
              <p>Share</p>
              <a href="#link"><i className="bi bi-link"></i></a>
              <a href="#instagram"><i className="bi bi-instagram"></i></a>
              <a href="#twitter"><i className="bi bi-twitter"></i></a>
              <a href="#facebook"><i className="bi bi-facebook"></i></a>
            </div>
            <img src={`data:image/png;base64,${event.image}`} alt={event.event_name} className="event-image" />
          </div>
        </header>
        <div className="event-content">
          <div className="event-main">
            <h1>{event.event_name}</h1>
            <p className="event-location"><i className="bi bi-geo-alt"></i> {event.location}</p>
            <p className="event-date"><i className="bi bi-calendar"></i> {new Date(event.date).toLocaleString()}</p>
            <p className="event-description">{event.description}</p>
          </div>
          <div className="ticket-info">
            <p className="ticket-price">Tickets priced at </p>
            <p className="ticket-price-range"><span>{event.ticket_price}</span></p>
            {raffleEnded ? (
              <p className="raffle-countdown">Raffle ended</p>
            ) : timeLeft > 0 ? (
              <div>
                <p className="raffle-countdown">
                  {raffleStarted ? 'Raffle ending in: ' : 'Raffle starts in: '}
                  {formatTimeLeft()}
                </p>
                {raffleStarted && !hasEnteredRaffle && (
                  <button className="btn btn-primary rafflebtn" onClick={handleRaffleClick}>
                    Enter Raffle
                  </button>
                )}
                {raffleStarted && hasEnteredRaffle && (
                  <p className="raffle-entered">You have already entered the raffle</p>
                )}
              </div>
            ) : (
              <button className="btn btn-primary rafflebtn" onClick={handleRaffleClick}>
                Enter Raffle
              </button>
            )}
          </div>
        </div>
        <TicketingEventDetails />
      </div>
      <Footer />
    </div>
  );
};

export default EventDetailPage;

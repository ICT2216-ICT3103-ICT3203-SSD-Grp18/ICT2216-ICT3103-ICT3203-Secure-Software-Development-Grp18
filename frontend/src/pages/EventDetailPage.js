import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/EventDetailPage.css';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5500/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setEvent(data);


        const raffleStartTime = new Date(data.raffle_start_date).getTime();
        const currentTime = new Date().getTime();
        setTimeLeft(raffleStartTime - currentTime);


        // if (raffleStartDate > currentDate) {
        //   const countdown = raffleStartDate - currentDate;
        //   setTimeLeft(countdown);
        // }

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

const formatTimeLeft = () => {
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};



  // const formatDate = (dateString) => {
  //   const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handleRaffleClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to enter the raffle');
      return;
    }

    if (timeLeft <= 0) {
      navigate(`/ticket/${eventId}`);
    }else {
      alert('Raffle not started yet!');
    }
  };


//   const handleRaffleClick = () => {
//     if (timeLeft <= 0) {
//         navigate(`/ticket/${event.event_id}`);
//     } else {
//         alert('Raffle not started yet!');
//     }
// };


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
                <p className="ticket-price">Tickets starting at </p>
                <p className="ticket-price-range"><span>{event.price_cat5}</span></p>
                {timeLeft > 0 ? (
                    <p className="raffle-countdown">Raffle starts in: {formatTimeLeft(timeLeft)}</p>
                ) : (
                    <button className="btn btn-primary rafflebtn" onClick={handleRaffleClick}>Enter Raffle</button>
                )}
            </div>
        </div>
      <Footer />
    </div>
  
    
);
};

export default EventDetailPage;

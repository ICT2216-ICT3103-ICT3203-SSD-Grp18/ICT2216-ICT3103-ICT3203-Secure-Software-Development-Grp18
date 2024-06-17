import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/css/EventDetailPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  const handleRaffleClick = () => {
    navigate(`/ticket/${event.event_id}`);
  };

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
          <img src={`data:image/png;base64,${event.image}`} alt={event.name} className="event-image" />
        </div>
      </header>
      <div className="event-content">
        <div className="event-main">
          <h1>{event.event_name}</h1>
          <p className="event-location"><i className="bi bi-geo-alt"></i> {event.location}</p>
          <p className="event-date"><i className="bi bi-calendar"></i> {formatDate(event.date)}</p>
          <p className="event-description">{event.description}</p>
        </div>
        <div className="ticket-info">
          <p className="ticket-price">Tickets starting at </p>
          <p className="ticket-price-range"><span>{event.price_cat5}</span></p>
          <button className="btn btn-primary rafflebtn" onClick={handleRaffleClick}>Enter Raffle</button>
        </div>
      </div>
      <section className="ticket-pricing">
        <h2>Ticket Pricing</h2>
        <p>Standard: {event.price_cat5}</p>
        <p className="note">Note:</p>
        <ul>
          <li>Limited to only 4 tickets per account.</li>
          <li>Rescheduling Policy: Rescheduling fees are as follows:</li>
          <ul>
            <li>$10 rescheduling fee per ticket from 31 to 60 days.</li>
            <li>$30 rescheduling fee per ticket for tickets issued within 30 days.</li>
            <li>$150 rescheduling fee per ticket for tickets priced below SGD 100.</li>
          </ul>
        </ul>
      </section>
      <section className="exchange-refund-policy">
        <h2>Exchange & Refund Policy</h2>
        <p>
          1. The Organizer/Venue Owner reserves the right without refund or compensation to refuse admission/evict any person(s) whose conduct is disorderly or inappropriate or who poses a threat to security, or to any person affected by COVID-19.
        </p>
        <p>
          2. No refunds on tickets except if the event is canceled or postponed.
        </p>
        <p>
          3. This ticket must be used in accordance with the terms and conditions.
        </p>
      </section>
      <section className="admission-policy">
        <h2>Admission Policy</h2>
        <p>Admission Rules:</p>
        <ul>
          <li>Admission to the venue will be subject to a security check.</li>
          <li>Children under 5 years old are not allowed.</li>
          <li>No professional cameras or recording devices are allowed.</li>
        </ul>
      </section>
      <Footer />
    </div>
  );
};

export default EventDetailPage;

import React from 'react';
import EventCard from './EventCard';
import '../styles/css/UpcomingEvents.css';
import { Link } from 'react-router-dom';

const UpcomingEvents = ({ events, onEventClick }) => {
  const scrollRight = () => {
    document.querySelector('.events-list').scrollBy({
      top: 0,
      left: 250,
      behavior: 'smooth'
    });
  };

  return (
    <section className="upcoming-events">
      <div className="section-header d-flex justify-content-between align-items-center">
        <h2>Upcoming Events</h2>
        <a href="#view-all" className="view-all"><Link to="/events">View All</Link></a>
      </div>
      <div className="events-container position-relative">
        <div className="events-list d-flex overflow-auto">
          {events.map((event) => (
            <div key={event.event_id} className="event-card-wrapper" onClick={() => onEventClick(event.event_id)}>
              <EventCard {...event} />
            </div>
          ))}
        </div>
        <button className="scroll-right" onClick={scrollRight}>➔</button>
      </div>
    </section>
  );
};

export default UpcomingEvents;

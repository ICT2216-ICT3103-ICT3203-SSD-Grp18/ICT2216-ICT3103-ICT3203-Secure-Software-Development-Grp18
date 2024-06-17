import React from 'react';
import EventCard from './EventCard';
import '../styles/css/BrowseConcert.css';

const BrowseConcert = ({ events, onEventClick }) => {
  return (
    <section className="browse-concert">
      <div className="section-header d-flex justify-content-between align-items-center">
        <h2>Browse Concerts</h2>
        <a href="#view-all" className="view-all">View All</a>
      </div>
      <div className="events-list d-flex flex-wrap">
        {events.map((event) => (
          <div key={event.event_id} className="event-card-wrapper" onClick={() => onEventClick(event.event_id)}>
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrowseConcert;

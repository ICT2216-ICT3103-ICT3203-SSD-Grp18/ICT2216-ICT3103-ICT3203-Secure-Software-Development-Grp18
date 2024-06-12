import React from 'react';
import EventCard from './EventCard';
import '../styles/css/BrowseConcert.css';

const BrowseConcert = ({ events, onEventClick }) => {
  const scrollRight = () => {
    document.querySelector('.events-list').scrollBy({
      top: 0,
      left: 250,
      behavior: 'smooth'
    });
  };

  return (
    <section className="browse-concert">
      <div className="section-header d-flex justify-content-between align-items-center">
        <h2>Browse Concert</h2>
        <a href="#view-all" className="view-all">View All</a>
      </div>
      <div className="events-container position-relative">
        <div className="events-list d-flex overflow-auto">
          {events.map((event) => (
            <div key={event.id} onClick={() => onEventClick(event.id)}>
              <EventCard {...event} />
            </div>
          ))}
        </div>
        <button className="scroll-right" aria-label="Scroll Right">➔</button>
      </div>
    </section>
  );
};

export default BrowseConcert;

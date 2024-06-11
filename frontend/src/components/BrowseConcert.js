import React from 'react';
import EventCard from './EventCard';
import '../styles/css/BrowseConcert.css';

const BrowseConcert = ({ events }) => {
  const scrollRight = () => {
    document.querySelector('.events-list').scrollBy({
      top: 0,
      left: 250, // Adjust the value as needed
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
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
        <button className="scroll-right" onClick={scrollRight}>➔</button>
      </div>
    </section>
  );
};

export default BrowseConcert;

import React from 'react';
import '../styles/css/EventCard.css';

const EventCard = ({ date, name, price, location, image }) => {
  const [month, day] = date.split(' ');

  return (
    <div className="card event-card">
      <img src={image} className="card-img-top event-image" alt={name} />
      <div className="card-body event-info">
        <div className="event-date-card">
          <span className="event-month">{month}</span>
          <span className="event-day">{day}</span>
        </div>
        <div className="event-details">
          <h5 className="card-title event-name">{name}</h5>
          <p className="card-text event-price">{price}</p>
          <p className="card-text event-location-card">{location}</p>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

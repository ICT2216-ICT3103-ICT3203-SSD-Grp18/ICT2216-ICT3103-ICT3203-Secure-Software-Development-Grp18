import React from 'react';
import '../styles/css/EventCard.css';

const EventCard = ({ event_id, event_name, date, location, image }) => {
  const eventDate = new Date(date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('default', { month: 'short' });

  return (
    <div className="card event-card">
      <img src={`data:image/png;base64,${image}`} className="card-img-top event-card-image" alt={event_name} />
      <div className="card-body event-info">
        <div className="event-date-card">
          <div className="event-date-div">
            <span className="event-month">{month}</span>
            <span className="event-day">{day}</span>
          </div>
          <div className="event-details">
            <h5 className="event-name">{event_name}</h5>
            <p className="event-location-card">{location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

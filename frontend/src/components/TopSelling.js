import React from 'react';
import '../styles/css/TopSelling.css';
/*import img1 from '../styles/images/topselling/black.png'; 
import img2 from '../styles/images/topselling/falling.png'; 
import img3 from '../styles/images/topselling/disney.png'; */
import { Link } from 'react-router-dom';


/*const topSellingEvents = [
  { name: 'Blackpink: World Tour', ticketsLeft: 5, image: img1 },
  { name: 'Falling in Reverse', ticketsLeft: 8, image: img2},
  { name: 'Disney On Ice', ticketsLeft: 11, image: img3},
];*/

const TopSelling = ({ events, onEventClick })  => {
  return (
    <section className="top-selling">
      <div className="section-header d-flex justify-content-between align-items-center">
        <h2>Top Selling</h2>
        <a href="#view-all" className="view-all"><Link to="/events">View All</Link></a>
      </div>
      <div className="top-selling-list d-flex">
        {events.map((event, index) => (
          <div key={index} className="top-selling-card" onClick={() => onEventClick(event.event_id)}>
            <img src={`data:image/png;base64,${event.image}`} className="card-img-top event-card-image" alt={event.event_name} />
            <div className="top-selling-info">
              <h3>{event.name}</h3>
              <p>{event.ticket_availability} tickets left!</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSelling;

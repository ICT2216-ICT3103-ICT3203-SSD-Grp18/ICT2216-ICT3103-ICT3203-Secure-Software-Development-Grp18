import React from 'react';
import '../styles/css/TopSelling.css';
import img1 from '../styles/images/topselling/black.png'; 
import img2 from '../styles/images/topselling/falling.png'; 
import img3 from '../styles/images/topselling/disney.png'; 


const topSellingEvents = [
  { name: 'Blackpink: World Tour', ticketsLeft: 5, image: img1 },
  { name: 'Falling in Reverse', ticketsLeft: 8, image: img2},
  { name: 'Disney On Ice', ticketsLeft: 11, image: img3},
];

const TopSelling = () => {
  return (
    <section className="top-selling">
      <div className="section-header d-flex justify-content-between align-items-center">
        <h2>Top Selling</h2>
        <a href="#view-all" className="view-all">View All</a>
      </div>
      <div className="top-selling-list d-flex">
        {topSellingEvents.map((event, index) => (
          <div key={index} className="top-selling-card">
            <img src={event.image} alt={event.name} className="top-selling-image"/>
            <div className="top-selling-info">
              <h3>{event.name}</h3>
              <p>{event.ticketsLeft} tickets left!</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopSelling;

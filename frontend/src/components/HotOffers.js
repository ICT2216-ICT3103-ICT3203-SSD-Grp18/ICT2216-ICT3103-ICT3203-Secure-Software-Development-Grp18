import React from 'react';
import hotOfferImg1 from '../styles/images/hotoffers/HotOffers1.png'; 
import hotOfferImg2 from '../styles/images/hotoffers/HotOffers2.png'; 
import '../styles/css/HotOffers.css';
import { Link } from 'react-router-dom';

const HotOffers = () => {
  return (
    <section className="hot-offers">
      <div className="section-header d-flex justify-content-between align-items-center">
        <h2>Hot Offers</h2>
        <a href="#view-all" className="view-all"><Link to="/events">View All</Link></a>
      </div>
      <div className="offers-list d-flex">
        <img src={hotOfferImg1} alt="Hot Offer 1" className="offer-image"/>
        <img src={hotOfferImg2} alt="Hot Offer 2" className="offer-image"/>
      </div>
    </section>
  );
};

export default HotOffers;

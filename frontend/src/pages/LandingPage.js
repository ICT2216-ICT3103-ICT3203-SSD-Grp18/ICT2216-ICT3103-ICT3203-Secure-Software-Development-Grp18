import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HotOffers from '../components/HotOffers';
import TopSelling from '../components/TopSelling';
import UpcomingEvents from '../components/UpcomingEvents';
import BrowseConcert from '../components/BrowseConcert';
import Footer from '../components/Footer';
import '../styles/css/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [browseConcert, setBrowseConcert] = useState([]);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await fetch('/api/events/upcoming');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Upcoming Events:', data);
        setUpcomingEvents(data);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
      }
    };

    
    const fetchBrowseConcert = async () => {
      try {
        const response = await fetch('/api/events/browse');
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Browse Concerts:', data);
        setBrowseConcert(data);
      } catch (error) {
        console.error('Error fetching browse concerts:', error);
      }
    };

    fetchUpcomingEvents();
    fetchBrowseConcert();
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="LandingPage">
      <Navbar />
      <header className="LandingPage-header">

        <h1>Exclusive events, priceless moments</h1>

        <div className="search-bar">
          <input type="text" className="form-control" placeholder="Search by name" />
          <input type="date" className="form-control" />
          <button className="btn btn-primary">Search</button>
        </div>

      </header>
      <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
      <HotOffers />
      <TopSelling />
      <BrowseConcert events={browseConcert} onEventClick={handleEventClick} />
      <Footer/>
    </div>
  );
};

export default LandingPage;

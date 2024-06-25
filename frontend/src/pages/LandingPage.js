import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HotOffers from '../components/HotOffers';
import TopSelling from '../components/TopSelling';
import UpcomingEvents from '../components/UpcomingEvents';
import BrowseConcert from '../components/BrowseConcert';
import Footer from '../components/Footer';
import '../styles/css/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiClient from '../axiosConfig';

const LandingPage = () => {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [browseConcert, setBrowseConcert] = useState([]);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await apiClient.get('/events/upcoming');
        console.log('Fetch Upcoming Events Response:', response);
        if (response.status !== 200) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        console.log('Upcoming Events Data:', response.data);
        setUpcomingEvents(response.data);
      } catch (error) {
        console.error('Error fetching upcoming events:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        }
      }
    };

    const fetchBrowseConcert = async () => {
      try {
        const response = await apiClient.get('/events/browse');
        console.log('Fetch Browse Concert Response:', response);
        if (response.status !== 200) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        console.log('Browse Concert Data:', response.data);
        setBrowseConcert(response.data);
      } catch (error) {
        console.error('Error fetching browse concerts:', error);
        if (error.response) {
          console.error('Error response data:', error.response.data);
          console.error('Error response status:', error.response.status);
          console.error('Error response headers:', error.response.headers);
        }
      }
    };

    fetchUpcomingEvents();
    fetchBrowseConcert();
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const toggleLoginModal = () => {
    setLoginOpen(!loginOpen);
  };

  return (
    <div className={`LandingPage ${loginOpen ? 'blur' : ''}`}>
      <Navbar toggleLoginModal={toggleLoginModal} />
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
      <Footer />
    </div>
  );
};

export default LandingPage;

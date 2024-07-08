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
  const [searchTerm, setSearchTerm] = useState('');
  const [topSelling, setTopSelling] = useState([]);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const response = await apiClient.get('/events/upcoming');
        if (response.status !== 200) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        setUpcomingEvents(response.data);
      } catch (error) {
        handleError(error, 'upcoming events')

      }
    };

    const fetchBrowseConcert = async () => {
      try {
        const response = await apiClient.get('/events/browse');
        if (response.status !== 200) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        setBrowseConcert(response.data);
      } catch (error) {
        handleError(error, 'browse concerts');

      }
    };

    const fetchTopSelling = async () => {
      try {
        const response = await apiClient.get('/events/topselling');
        if (response.status !== 200) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        setTopSelling(response.data);
      } catch (error) {
        handleError(error, 'top selling concerts');
      }
    };

    fetchUpcomingEvents();
    fetchBrowseConcert();
    fetchTopSelling();
  }, []);

  const handleError = (error, context) => {
    if (error.response) {
      setError({
        context,
        status: error.response.status,
        message: error.response.data.message || error.response.statusText,
      });
    } else {
      setError({
        context,
        status: 'Network Error',
        message: error.message,
      });
    }
  };

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const toggleLoginModal = () => {
    setLoginOpen(!loginOpen);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/events?search=${searchTerm}`);
  };

  return (
    <div className={`LandingPage ${loginOpen ? 'blur' : ''}`}>
      <Navbar toggleLoginModal={toggleLoginModal} />
      <header className="LandingPage-header">
        <h1>Exclusive events, priceless moments</h1>
        <div className="search-bar">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="btn btn-primary" onClick={handleSearch}>
            Search
          </button>
        </div>
      </header>
      {error && (
        <div className="error-message">
          <p>Error fetching {error.context}:</p>
          <p>Status: {error.status}</p>
          <p>Message: {error.message}</p>
        </div>
      )}
      <UpcomingEvents events={upcomingEvents} onEventClick={handleEventClick} />
      <HotOffers />
      <TopSelling events={topSelling} onEventClick={handleEventClick} />
      <BrowseConcert events={browseConcert} onEventClick={handleEventClick} />
      <Footer />
    </div>
  );
};

export default LandingPage;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EventCard from '../components/EventCard';
import '../styles/css/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import apiClient from '../axiosConfig';

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const EventPage = () => {
    const navigate = useNavigate();
    const query = useQuery();
    const initialSearchTerm = query.get('search') || '';
    const [browseConcert, setBrowseConcert] = useState([]);
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [error, setError] = useState('');


    useEffect(() => {
        const fetchBrowseConcert = async () => {
            try {
                const response = await apiClient.get('/events/browse');
                if (response.status !== 200) {
                   setBrowseConcert(response.data)
                }else {
                   setError(`Error fetching browse concerts: ${response.statusText}`);
                }
            } catch (error) {
                setError('Error fetching browse concerts. Please try again later.');
            }
        };
        fetchBrowseConcert();
    }, []);

    const filteredEvents = browseConcert.filter(event =>
        event.event_name && event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEventClick = (eventId) => {
        navigate(`../event/${eventId}`);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const renderEvents = () => {
        if (filteredEvents.length === 0) {
            return <div className="alert alert-warning" role="alert">No concerts found with that name.</div>;
        }

        return (
            <div className="row">
                {filteredEvents.map((event, index) => (
                    <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4 event-page-cards">
                        <div onClick={() => handleEventClick(event.event_id)} style={{ cursor: 'pointer' }}>
                            <EventCard
                                event_id={event.event_id}
                                event_name={event.event_name}
                                date={event.date}
                                location={event.location}
                                image={event.image}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="event-page">
            <header>
                <Navbar />
            </header>
            <main className="container mt-5">
                <div className="search-bar mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search for events"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                {renderEvents()}
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default EventPage;

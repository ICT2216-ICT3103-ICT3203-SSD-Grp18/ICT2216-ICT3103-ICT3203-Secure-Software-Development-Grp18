import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/css/EventDetailPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const EventDetailPage = () => {
  const { eventId } = useParams();

  // Ideally, fetch the event data based on the eventId.
  // For simplicity, using static data.
  const events = [
    { id: 1, name: 'Panic! at the Disco', date: 'Nov 01', price: 'SGD $88 - $298', location: 'National Stadium', description: 'An amazing concert by Panic! at the Disco.', image: require('../styles/images/upcomingevents/panic.png') },
    { id: 2, name: 'Falling in Reverse', date: 'Oct 01', price: 'SGD $73 - $245', location: 'The Star Theatre', description: 'Experience the energy of Falling in Reverse.', image: require('../styles/images/upcomingevents/falling.png') },
    { id: 3, name: 'Disney On Ice', date: 'Oct 20', price: 'SGD $45 - $145', location: 'Indoor Stadium', description: 'A magical experience with Disney On Ice.', image: require('../styles/images/upcomingevents/disney.png') },
    { id: 4, name: 'Kevin Hart Show', date: 'Nov 06', price: 'SGD $88 - $288', location: 'Indoor Stadium', description: 'Laugh out loud with Kevin Hart.', image: require('../styles/images/upcomingevents/kevin.png') },
    { id: 5, name: 'Super Junior', date: 'Dec 01', price: 'SGD $88 - $298', location: 'Indoor Stadium', description: 'Enjoy the performances by Super Junior.', image: require('../styles/images/browseconcert/super.png') },
    { id: 6, name: 'IU: HER World Tour', date: 'Dec 20', price: 'SGD $73 - $245', location: 'National Stadium', description: 'Experience IU\'s mesmerizing world tour.', image: require('../styles/images/browseconcert/iu.png') },
    { id: 7, name: 'Asking Alexandria', date: 'Dec 23', price: 'SGD $45 - $145', location: 'Expo', description: 'Rock out with Asking Alexandria.', image: require('../styles/images/browseconcert/asking.png') },
    { id: 8, name: 'Sophia Anne Caruso', date: 'Oct 30', price: 'SGD $88 - $288', location: 'Expo', description: 'A stunning performance by Sophia Anne Caruso.', image: require('../styles/images/browseconcert/sophia.png') },
  ];

  const event = events.find(e => e.id === parseInt(eventId));

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
   
    <div className="event-detail-page">
        <Navbar />
        <header className="event-header">
            <div className="header-container">

            <div className="share-buttons">
                <p>Share</p>
                <a href="#link"><i className="bi bi-link"></i></a>
                <a href="#instagram"><i className="bi bi-instagram"></i></a>
                <a href="#twitter"><i className="bi bi-twitter"></i></a>
                <a href="#facebook"><i className="bi bi-facebook"></i></a>
            </div>

            <img src={event.image} alt={event.name} className="event-image" />
            </div>
        </header>
        
        <div className="event-content">

            <div className="event-main">
            <h1>{event.name}</h1>
            <p className="event-location"><i className="bi bi-geo-alt"></i> {event.location}</p>
            <p className="event-date"><i className="bi bi-calendar"></i> {event.date}</p>
            <p className="event-description">{event.description}</p>
            </div>

            <div className="ticket-info">
            <p className="ticket-price">Tickets starting at </p>
            <p className="ticket-price-range"><span>{event.price}</span></p>
            <button className="btn btn-primary rafflebtn">Enter Raffle</button>
            </div>

        </div>

        <section className="ticket-pricing">
            <h2>Ticket Pricing</h2>
            <p>Standard: {event.price}</p>
            <p className="note">Note:</p>
            <ul>
                <li>Limited to only 4 tickets per account.</li>
                <li>Rescheduling Policy: Rescheduling fees are as follows:</li>
                <ul>
                    <li>$10 rescheduling fee per ticket from 31 to 60 days.</li>
                    <li>$30 rescheduling fee per ticket for tickets issued within 30 days.</li>
                    <li>$150 rescheduling fee per ticket for tickets priced below SGD 100.</li>
                </ul>
            </ul>
        </section>

        <section className="exchange-refund-policy">
            <h2>Exchange & Refund Policy</h2>
            <p>
            1. The Organizer/Venue Owner reserves the right without refund or compensation to refuse admission/evict any person(s) whose conduct is disorderly or inappropriate or who poses a threat to security, or to any person affected by COVID-19.
            </p>
            <p>
            2. No refunds on tickets except if the event is canceled or postponed.
            </p>
            <p>
            3. This ticket must be used in accordance with the terms and conditions.
            </p>
        </section>

        <section className="admission-policy">
            <h2>Admission Policy</h2>
            <p>Admission Rules:</p>
            <ul>
            <li>Admission to the venue will be subject to a security check.</li>
            <li>Children under 5 years old are not allowed.</li>
            <li>No professional cameras or recording devices are allowed.</li>
            </ul>
        </section>

        <Footer/>
    </div>
  );
};

export default EventDetailPage;

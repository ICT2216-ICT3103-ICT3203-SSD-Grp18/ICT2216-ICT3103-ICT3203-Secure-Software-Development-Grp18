import React from 'react';
import Navbar from '../components/Navbar';
import HotOffers from '../components/HotOffers';
import TopSelling from '../components/TopSelling';
import UpcomingEvents from '../components/UpcomingEvents';
import BrowseConcert from '../components/BrowseConcert';
import Footer from '../components/Footer';
import '../styles/css/LandingPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import panicImg from '../styles/images/upcomingevents/panic.png';
import fallingImg from '../styles/images/upcomingevents/falling.png';
import disneyImg from '../styles/images/upcomingevents/disney.png';
import kevinImg from '../styles/images/upcomingevents/kevin.png';
import superImg from '../styles/images/browseconcert/super.png';
import iuImg from '../styles/images/browseconcert/iu.png';
import askingImg from '../styles/images/browseconcert/asking.png';
import sophiaImg from '../styles/images/browseconcert/sophia.png';



const LandingPage = () => {
  const upcomingEvents = [
    { date: 'NOV 01', name: 'Panic! at the Disco', price: 'SGD $88 - $298', location: 'National Stadium', image: panicImg },
    { date: 'OCT 01', name: 'Falling in Reverse', price: 'SGD $73 - $245', location: 'The Star Theatre', image: fallingImg },
    { date: 'OCT 20', name: 'Disney On Ice', price: 'SGD $45 - $145', location: 'Indoor Stadium', image: disneyImg },
    { date: 'NOV 06', name: 'Kevin Hart Show', price: 'SGD $88 - $288', location: 'Indoor Stadium', image: kevinImg },
  ];

  const browseConcert = [
    { date: 'DEC 01', name: 'Super Junior', price: 'SGD $88 - $298', location: 'Indoor Stadium', image: superImg },
    { date: 'DEC 20', name: 'IU:HER World Tour', price: 'SGD $73 - $245', location: 'National Stadium', image: iuImg },
    { date: 'DEC 23', name: 'Asking Alexandria', price: 'SGD $45 - $145', location: 'Expo', image: askingImg },
    { date: 'OCT 30', name: 'Sophia Anne Caruso', price: 'SGD $88 - $288', location: 'Expo', image: sophiaImg },
  ];


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
      <UpcomingEvents events={upcomingEvents} />
      <HotOffers />
      <TopSelling />
      <BrowseConcert events={browseConcert} />
      <Footer/>
      
    </div>
  );
};

export default LandingPage;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventDetailPage from './pages/EventDetailPage';
import TicketPage from './pages/TicketPage';
import BuyerContactInformationPage from './pages/BuyerContactInformationPage';
import PaymentPage from './pages/PaymentPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path="/ticket/:eventId" element={<TicketPage />} />
          <Route path="/buyer-info" element={<BuyerContactInformationPage />} />
          <Route path="/payment" element={<PaymentPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import EventDetailPage from './pages/EventDetailPage';
import TicketPage from './pages/TicketPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import CompletionPage from './pages/CompletionPage';
import { AuthProvider } from './context/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUsPage';
import EventPage from './pages/EventsPage';
import SessionManager from './SessionManager';
import LoginModal from './pages/LoginModal'; 
import ResetPasswordPage from './pages/ResetPasswordPage'; 
import BuyerContactInformationPage from './pages/BuyerContactInformationPage';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';




const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <SessionManager />
          <Routes>
            <Route exact path="/" element={<LandingPage />} />
            <Route path="/event/:eventId" element={<EventDetailPage />} />
            <Route path="/ticket/:eventId" element={<TicketPage />} />
            <Route path="/completion" element={<CompletionPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/events" element={<EventPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} /> // Use element instead of component
            <Route path="/buyer-info/:userId/:eventId" element={<BuyerContactInformationPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook from AuthContext
import { Link, useNavigate } from 'react-router-dom';
import LoginModal from "../pages/LoginModal"; 
import '../styles/css/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { isLoggedIn, logout, user } = useAuth(); 

  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openLoginModal = (isLoginMode) => {
    setIsLogin(isLoginMode);
    setLoginOpen(true);
  };

  const closeLoginModal = () => {
    setLoginOpen(false);
  };

  const handleMyTicketsClick = () => {
    navigate('/mytickets');
  };

  const renderAuthButtons = () => (
    isLoggedIn ? (
      <>
        <button className="my-tickets" onClick={handleMyTicketsClick}>My Tickets</button>
        <button className="logout" onClick={logout}>Logout</button>
      </>
    ) : (
      <>
        <button className="login" onClick={() => openLoginModal(true)}>Log In</button>
        <button className="signup" onClick={() => openLoginModal(false)}>Sign Up</button>
      </>
    )
  );

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="logo-link">TicketingHuat</Link>
        </div>
      <div className="navbar-container">
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            <li><Link to="/">Concerts</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/aboutus">About us</Link></li>
            {user && ['admin', 'event', 'cus_support'].includes(user.role) && (
              <li><Link to="/admin">Admin Dashboard</Link></li>
            )}
            {isLoggedIn ? (
              <li className="mobile-only"><a href="#logout" onClick={logout}>Logout</a></li>
            ) : (
              <>
                <li className="mobile-only"><a href="#login" onClick={() => openLoginModal(true)}>Log In</a></li>
                <li className="mobile-only"><a href="#register" onClick={() => openLoginModal(false)}>Sign Up</a></li>
              </>
            )}
          </ul>
        </div>
        <div className="navbar-buttons">
        {renderAuthButtons()}
        </div>
      </div>
      <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu">
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <LoginModal isOpen={loginOpen} onClose={closeLoginModal} isLogin={isLogin} />
    </nav>
  );
};

export default Navbar;

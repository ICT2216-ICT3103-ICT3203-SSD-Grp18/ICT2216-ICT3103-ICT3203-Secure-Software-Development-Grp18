import React, { useState } from 'react';
import LoginModal from "../pages/loginModal"; // Updated the import path
import '../styles/css/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

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

  return (
    <nav className="navbar">
      <div className="navbar-logo">TicketingHuat</div>
      <div className="navbar-container">
        <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            <li><a href="#concerts">Concerts</a></li>
            <li><a href="#events">Events</a></li>
            <li><a href="#conference">Conference</a></li>
            <li className="mobile-only"><a href="#login">Log In</a></li>
            <li className="mobile-only"><a href="#register">Sign Up</a></li>
          </ul>
        </div>
        <div className="navbar-buttons">
          <button className="login" onClick={() => openLoginModal(true)}>Log In</button>
          <button className="signup" onClick={() => openLoginModal(false)}>Sign Up</button>
        </div>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      <LoginModal isOpen={loginOpen} onClose={closeLoginModal} isLogin={isLogin} />
    </nav>
  );
};

export default Navbar;

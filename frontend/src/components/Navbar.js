import React, { useState } from 'react';
import '../styles/css/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
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
          <button className="login">Log In</button>
          <button className="signup">Sign Up</button>
        </div>
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
    </nav>
  );
};

export default Navbar;

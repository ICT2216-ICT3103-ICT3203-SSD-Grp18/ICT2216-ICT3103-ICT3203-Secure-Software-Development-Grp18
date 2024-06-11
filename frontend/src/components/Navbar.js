import React from 'react';
import '../styles/css/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">TicketingHuat</div>
      <ul className="navbar-links">
        <li><a href="#concerts">Concerts</a></li>
        <li><a href="#events">Events</a></li>
        <li><a href="#conference">Conference</a></li>
      </ul>
      <div className="navbar-buttons">
        <button className="login">Log In</button>
        <button className="signup">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect } from 'react';
import LoginModal from "../pages/loginModal"; 
import '../styles/css/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const openLoginModal = (isLoginMode) => {
    setIsLogin(isLoginMode);
    setLoginOpen(true);
  };

  const closeLoginModal = () => {
    setLoginOpen(false);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
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
            {isLoggedIn ? (
              <li className="mobile-only"><a href="#logout" onClick={handleLogout}>Logout</a></li>
            ) : (
              <>
            <li className="mobile-only"><a href="#login">Log In</a></li>
            <li className="mobile-only"><a href="#register">Sign Up</a></li>
            </>
            )}
          </ul>
        </div>
        <div className="navbar-buttons">
        {isLoggedIn ? (
            <button className="logout" onClick={handleLogout}>Logout</button>
          ) : (
            <>

          <button className="login" onClick={() => openLoginModal(true)}>Log In</button>
          <button className="signup" onClick={() => openLoginModal(false)}>Sign Up</button>
          </>
          )}
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

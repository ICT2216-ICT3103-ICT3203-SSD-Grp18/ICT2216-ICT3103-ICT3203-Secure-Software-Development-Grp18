import React, { useState } from 'react';
import '../styles/css/Sidebar.css';

const Sidebar = ({ setCurrentView }) => {
  const [eventMenuOpen, setEventMenuOpen] = useState(false);

  const toggleEventMenu = () => {
    setEventMenuOpen(!eventMenuOpen);
  };

  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <nav>
        <ul>
          <li className="menu-item">
            <button onClick={() => setCurrentView('dashboard')} className="menu-button">
              <i className="fas fa-home menu-icon"></i> Dashboard
            </button>
          </li>
          <li className="menu-item">
            <button onClick={toggleEventMenu} className="menu-button">
              <i className="fas fa-calendar-alt menu-icon"></i> Event
            </button>
            {eventMenuOpen && (
             <ul className={`submenu ${eventMenuOpen ? 'open' : ''}`}>
             <li className="submenu-item"><button onClick={() => setCurrentView('create-event')}>Create Event</button></li>
             <li className="submenu-item"><button onClick={() => setCurrentView('manage-events')}>Manage Events</button></li>
           </ul>
            )}
          </li>
          <li className="menu-item">
            <button onClick={() => setCurrentView('manage-users')} className="menu-button">
              <i className="fas fa-users menu-icon"></i> Manage Users
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

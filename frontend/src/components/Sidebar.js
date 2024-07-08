import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook from AuthContext
import '../styles/css/Sidebar.css';

const Sidebar = ({ setCurrentView }) => {
  const [eventMenuOpen, setEventMenuOpen] = useState(false);
  const { user } = useAuth(); // Access user from AuthContext

  const toggleEventMenu = () => {
    setEventMenuOpen(!eventMenuOpen);
  };

  const renderMenuButton = (view, iconClass, label) => (
    <button onClick={() => setCurrentView(view)} className="menu-button">
      <i className={`fas ${iconClass} menu-icon`}></i> 
      <p className='sidebar-title'>{label}</p>
    </button>
  );

  if (!user) {
    return null; // Or render a loading indicator if the user object is not yet available
  }

  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <nav>
        <ul>
          <li className="menu-item">
            {renderMenuButton('dashboard', 'fa-home', 'Dashboard')}
          </li>
          {(user.role === 'admin' || user.role === 'event') && (
            <li className="menu-item">
              <button 
                onClick={toggleEventMenu} 
                className="menu-button"
                aria-expanded={eventMenuOpen}
                aria-controls="event-submenu"
              >
                <i className="fas fa-calendar-alt menu-icon"></i> 
                <p className='sidebar-title'>Event</p>
              </button>
              {eventMenuOpen && (
                <ul id="event-submenu" className="submenu open">
                  <li className="submenu-item">
                    {renderMenuButton('create-event', '', 'Create Event')}
                  </li>
                  <li className="submenu-item">
                    {renderMenuButton('manage-events', '', 'Manage Events')}
                  </li>
                </ul>
              )}
            </li>
          )}
          {(user.role === 'admin' || user.role === 'cus_support') && (
            <li className="menu-item">
              {renderMenuButton('manage-users', 'fa-users', 'Manage Users')}
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

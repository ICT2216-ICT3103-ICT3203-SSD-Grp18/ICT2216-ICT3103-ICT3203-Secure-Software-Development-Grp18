// components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/css/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Admin Dashboard</h2>
      <nav>
        <ul>
          <li><Link to="/admin">Dashboard</Link></li>
          <li><Link to="/admin/create-event">Create Event</Link></li>
          <li><Link to="/admin/manage-events">Manage Events</Link></li>
          <li><Link to="/admin/manage-users">Manage Users</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreateEvent from './CreateEvent';
import ManageEvents from './ManageEvents';
import ManageUsers from './ManageUsers';
import '../styles/css/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/'); // Redirect non-admin users to home
    }
  }, [user, navigate]);

  const renderView = () => {
    switch (currentView) {
      case 'create-event':
        return <CreateEvent />;
      case 'manage-events':
        return <ManageEvents />;
      case 'manage-users':
        return <ManageUsers />;
      default:
        return <div><h2>Admin Dashboard</h2><p>Coming soon...</p></div>;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar setCurrentView={setCurrentView} />
      <div className="main-content">
        {/* <Navbar /> */}
        <div className="content">
          {renderView()}
        </div>
       
      </div>
      
    </div>
  );
};

export default AdminDashboard;

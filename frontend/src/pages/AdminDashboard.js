import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import CreateEvent from './CreateEvent';
import ManageEvents from './ManageEvents';
import ManageUsers from './ManageUsers';
import apiClient from '../axiosConfig';
import '../styles/css/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('dashboard');
  const [metrics, setMetrics] = useState({
    activeUsers: 0,
    totalEvents: 0,
    upcomingEvent: null,
  });

  useEffect(() => {
    if (!user || !['admin', 'event', 'cus_support'].includes(user?.role)) {
      navigate('/'); // Redirect unauthorized users to home
    } else {
      fetchMetrics();
    }
  }, [user, navigate]);

  const fetchMetrics = async () => {
    try {
      const response = await apiClient.get('/admin/metrics', { withCredentials: true });
      setMetrics(response.data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const renderView = () => {
    if (!user) {
      return null; // Or a loading indicator
    }

    switch (currentView) {
      case 'create-event':
        return user.role === 'admin' || user.role === 'event' ? <CreateEvent /> : null;
      case 'manage-events':
        return <ManageEvents />;
      case 'manage-users':
        return user.role === 'admin' || user.role === 'cus_support' ? <ManageUsers /> : null;
      default:
        return (
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome to the Admin Dashboard. Use the sidebar to navigate between different sections.</p>
            <div className="metrics">
              {user.role !== 'cus_support' && (
                <>
                  <div className="metric">
                    <h3>Active Users</h3>
                    <p>{metrics.activeUsers}</p>
                  </div>
                  <div className="metric">
                    <h3>Total Events</h3>
                    <p>{metrics.totalEvents}</p>
                  </div>
                </>
              )}
              {metrics.upcomingEvent && (
                <div className="metric">
                  <h3>Upcoming Event</h3>
                  <p>{metrics.upcomingEvent.event_name} on {metrics.upcomingEvent.date}</p>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar setCurrentView={setCurrentView} />
      <div className="main-content">
        <Navbar />
        <div className="content">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

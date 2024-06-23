
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../axiosConfig';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import '../styles/css/AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/'); // Redirect non-admin users to home
    } else {
      fetchEvents();
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      const response = await apiClient.get('/api/admin/events', { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await apiClient.get('/api/admin/users', { withCredentials: true });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await apiClient.delete(`/api/admin/events/${eventId}`, { withCredentials: true });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await apiClient.delete(`/api/admin/users/${userId}`, { withCredentials: true });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="admin-dashboard">
    <Sidebar />
    <div className="main-content">
      <Header />
      <div className="content">
        <h2>Manage Events</h2>
        <ul>
          {events.map(event => (
            <li key={event.id}>
              {event.title}
            </li>
          ))}
        </ul>
        <h2>Manage Users</h2>
        <ul>
          {users.map(user => (
            <li key={user.id}>
              {user.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
};

export default AdminDashboard;

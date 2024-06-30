import React, { useEffect, useState } from 'react';
import apiClient from '../axiosConfig';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import '../styles/css/ManageUsers.css'; // Import the CSS file here

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/admin/events', { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      setError('Error fetching events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/admin/events/search?event_name=${searchTerm}`, { withCredentials: true });
      setEvents(response.data);
    } catch (error) {
      setError('Error searching events');
      console.error('Error searching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    const formattedEvent = {
      ...event,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      raffle_start_date: event.raffle_start_date ? new Date(event.raffle_start_date).toISOString().slice(0, 19) : '',
      raffle_end_date: event.raffle_end_date ? new Date(event.raffle_end_date).toISOString().slice(0, 19) : '',
    };
    setSelectedEvent(formattedEvent);
    setModalIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent({ ...selectedEvent, [name]: value });
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await apiClient.put(`/admin/events/${selectedEvent.event_id}`, selectedEvent, { withCredentials: true });
      console.log('Event updated:', response.data);
      fetchEvents(); // Refresh event list after updating event
      setModalIsOpen(false);
    } catch (error) {
      setError('Error updating event');
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await apiClient.delete(`/admin/events/${selectedEvent.event_id}`, { withCredentials: true });
      console.log('Event deleted');
      fetchEvents(); // Refresh event list after deleting event
      setModalIsOpen(false);
    } catch (error) {
      setError('Error deleting event');
      console.error('Error deleting event:', error);
    }
  };

  const handleClose = () => {
    setModalIsOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div>
      <h2>Manage Events</h2>
      <form className='admin-search' onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for events"
          style={{ width: '300px', height: '40px' , marginBottom: '20px', borderRadius: '5px', padding: '5px'}}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button style={{ color: 'white' }} class="btn btn-primary" type="submit">Search</Button>
      </form>
      {loading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: 'red' }}>{error}</p> : null}
      <div className="scrollable-list">
        <ul>
          {events.map(event => (
            <li key={event.event_id} onClick={() => handleEventClick(event)}>
              {event.event_name}
            </li>
          ))}
        </ul>
      </div>
      {selectedEvent && (
        <Dialog open={modalIsOpen} onClose={handleClose}>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Event Name"
                  name="event_name"
                  value={selectedEvent.event_name}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  name="description"
                  value={selectedEvent.description}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={selectedEvent.date}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Start Time"
                  name="start_time"
                  type="time"
                  value={selectedEvent.start_time}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  name="location"
                  value={selectedEvent.location}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Organiser"
                  name="organiser"
                  value={selectedEvent.organiser}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  style={{ marginRight: '100px' }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ticket Availability"
                  name="ticket_availability"
                  value={selectedEvent.ticket_availability}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price VIP"
                  name="price_vip"
                  value={selectedEvent.price_vip}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price Cat 1"
                  name="price_cat1"
                  value={selectedEvent.price_cat1}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price Cat 2"
                  name="price_cat2"
                  value={selectedEvent.price_cat2}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price Cat 3"
                  name="price_cat3"
                  value={selectedEvent.price_cat3}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price Cat 4"
                  name="price_cat4"
                  value={selectedEvent.price_cat4}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Price Cat 5"
                  name="price_cat5"
                  value={selectedEvent.price_cat5}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Raffle Start Date"
                  name="raffle_start_date"
                  type="datetime-local"
                  value={selectedEvent.raffle_start_date}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Raffle End Date"
                  name="raffle_end_date"
                  type="datetime-local"
                  value={selectedEvent.raffle_end_date}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleUpdateEvent} color="primary">Update</Button>
            <Button onClick={handleDeleteEvent} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ManageEvents;

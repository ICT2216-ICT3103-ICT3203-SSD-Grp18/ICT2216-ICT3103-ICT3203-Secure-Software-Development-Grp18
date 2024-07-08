import React, { useEffect, useState } from 'react';
import apiClient from '../axiosConfig';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';
import DOMPurify from 'dompurify';
import he from 'he';
import '../styles/css/ManageUsers.css';

// Sanitization function
const sanitizeInput = (input) => {
  const sanitized = DOMPurify.sanitize(input);
  return he.encode(sanitized);
};

// Validation functions
const validateText = (text) => {
  const textRegex = /^[a-zA-Z0-9\s.,!?'"@#$%^&*()_+\-=\[\]{};:\\|<>\/~`]+$/;
  return textRegex.test(text);
};

const validatePrice = (price) => {
  return Number.isInteger(Number(price)) && price >= 0 && price <= 1000;
};

const validateTicketAvailability = (availability) => {
  return Number.isInteger(Number(availability)) && availability >= 0 && availability <= 500;
};

const validateDate = (date) => {
  const today = new Date();
  const selectedDate = new Date(date);
  return selectedDate > today;
};

const validateStartTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return (hours >= 7 && hours < 24) || (hours === 0 && minutes === 0);
};

const validateRaffleDate = (raffleStart, raffleEnd, eventDate) => {
  const start = new Date(raffleStart);
  const end = new Date(raffleEnd);
  const event = new Date(eventDate);
  if (!raffleStart || !raffleEnd || !eventDate) return true; // Skip validation if any date is missing
  return start <= end && start < event && end < event;
};

const validateLocation = (location) => {
  const validLocations = ['National Stadium', 'Expo', 'Star Vista', 'Indoor Stadium'];
  return validLocations.includes(location);
};

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errors, setErrors] = useState({});

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
    const { image, ...eventDataWithoutImage } = event; // Destructure to exclude image data
    const formattedEvent = {
      ...eventDataWithoutImage,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      raffle_start_date: event.raffle_start_date ? new Date(event.raffle_start_date).toISOString().slice(0, 19) : '',
      raffle_end_date: event.raffle_end_date ? new Date(event.raffle_end_date).toISOString().slice(0, 19) : '',
    };
    setSelectedEvent(formattedEvent);
    setModalIsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setSelectedEvent({ ...selectedEvent, [name]: sanitizedValue });

    // Validate and set errors
    let error = '';
    if (name === 'event_name' || name === 'organiser' || name === 'description') {
      if (!validateText(sanitizedValue)) {
        error = 'Invalid input. Only letters and spaces are allowed.';
      }
    } else if (name === 'ticket_price') {
      if (!validatePrice(sanitizedValue)) {
        error = 'Invalid price. Must be a whole number between 0 and 1000.';
      }
    } else if (name === 'ticket_availability') {
      if (!validateTicketAvailability(sanitizedValue)) {
        error = 'Invalid availability. Must be a whole number between 0 and 500.';
      }
    } else if ((name === 'date' || name === 'raffle_end_date' || name === 'raffle_start_date') && !validateDate(sanitizedValue)) {
      error = 'Date must be tomorrow or later.';
    } else if (name === 'start_time' && !validateStartTime(sanitizedValue)) {
      error = 'Start time must be between 7 AM and 12 AM.';
    } else if (name === 'location' && !validateLocation(sanitizedValue)) {
      error = 'Invalid location. Must be National Stadium, Expo, Star Vista, or Indoor Stadium.';
    }

    // Validate raffle dates
    if (name === 'raffle_start_date' || name === 'raffle_end_date' || name === 'date') {
      const { raffle_start_date, raffle_end_date, date } = selectedEvent;
      const raffleDatesValid = validateRaffleDate(
        name === 'raffle_start_date' ? sanitizedValue : raffle_start_date,
        name === 'raffle_end_date' ? sanitizedValue : raffle_end_date,
        name === 'date' ? sanitizedValue : date
      );
      if (!raffleDatesValid) {
        error = 'Raffle dates must be before the event date, and raffle end date cannot be before raffle start date.';
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateForm = () => {
    const {
      event_name, description, organiser,
      ticket_availability, ticket_price,
      date, raffle_start_date, raffle_end_date, start_time, location
    } = selectedEvent;

    const formValid =
      validateText(event_name) &&
      validateText(description) &&
      validateText(organiser) &&
      description.length > 0 &&
      validateTicketAvailability(ticket_availability) &&
      validatePrice(ticket_price) &&
      validateDate(date) &&
      validateStartTime(start_time) &&
      validateLocation(location) &&
      validateRaffleDate(raffle_start_date, raffle_end_date, date);

    return formValid;
  };

  const handleUpdateEvent = async () => {
    if (!validateForm()) {
      alert('Please ensure all inputs are valid and filled out correctly.');
      return;
    }

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
    setErrors({});
  };

  return (
    <div>
      <h2>Manage Events</h2>
      <form className='admin-search' onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for events"
          style={{ width: '300px', height: '40px', marginBottom: '20px', borderRadius: '5px', padding: '5px' }}
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
                  error={!!errors.event_name}
                  helperText={errors.event_name}
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
                  error={!!errors.description}
                  helperText={errors.description}
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
                  error={!!errors.date}
                  helperText={errors.date}
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
                  error={!!errors.start_time}
                  helperText={errors.start_time}
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
                  error={!!errors.location}
                  helperText={errors.location}
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
                  error={!!errors.organiser}
                  helperText={errors.organiser}
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
                  error={!!errors.ticket_availability}
                  helperText={errors.ticket_availability}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Ticket Price"
                  name="ticket_price"
                  value={selectedEvent.ticket_price}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                  variant="standard"
                  error={!!errors.ticket_price}
                  helperText={errors.ticket_price}
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
                  error={!!errors.raffle_start_date}
                  helperText={errors.raffle_start_date}
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
                  error={!!errors.raffle_end_date}
                  helperText={errors.raffle_end_date}
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

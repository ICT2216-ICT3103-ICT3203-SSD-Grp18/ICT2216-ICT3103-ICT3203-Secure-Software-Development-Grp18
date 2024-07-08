import React, { useState } from 'react';
import '../styles/css/CreateEvent.css';
import apiClient from '../axiosConfig';
import DOMPurify from 'dompurify';
import he from 'he';

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

const validateUpload = (file) => {
  if (!file) return false;
  const validTypes = ['image/jpeg', 'image/png'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  return validTypes.includes(file.type) && file.size <= maxSize;
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

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    event_name: '',
    description: '',
    date: '',
    start_time: '',
    location: 'National Stadium',
    organiser: '',
    ticket_availability: '',
    ticket_price: '',
    raffle_start_date: '',
    raffle_end_date: '',
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    setEventData(prevState => ({
      ...prevState,
      [name]: sanitizedValue,
    }));

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
    } else if (name === 'description' && sanitizedValue.length === 0) {
      error = 'Description cannot be empty.';
    } else if ((name === 'date' || name === 'raffle_start_date' || name === 'raffle_end_date') && !validateDate(sanitizedValue)) {
      error = 'Date must be tomorrow or later.';
    } else if (name === 'start_time' && !validateStartTime(sanitizedValue)) {
      error = 'Start time must be between 7 AM and 12 AM.';
    } else if (name === 'location' && !validateLocation(sanitizedValue)) {
      error = 'Invalid location. Must be National Stadium, Expo, Star Vista, or Indoor Stadium.';
    }

    // Validate raffle dates
    if (name === 'raffle_start_date' || name === 'raffle_end_date' || name === 'date') {
      const { raffle_start_date, raffle_end_date, date } = eventData;
      const raffleDatesValid = validateRaffleDate(
        name === 'raffle_start_date' ? sanitizedValue : raffle_start_date,
        name === 'raffle_end_date' ? sanitizedValue : raffle_end_date,
        name === 'date' ? sanitizedValue : date
      );
      if (!raffleDatesValid) {
        error = 'Raffle dates must be before the event date, and raffle end date cannot be before raffle start date.';
      }
    }

    setErrors(prevState => ({
      ...prevState,
      [name]: error,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData(prevState => ({
      ...prevState,
      image: file,
    }));
    setErrors(prevState => ({
      ...prevState,
      image: validateUpload(file) ? '' : 'Please upload a valid image file (JPEG/PNG) and size <= 5MB.',
    }));
  };

  const validateForm = () => {
    const {
      event_name, description, organiser,
      ticket_availability, ticket_price,
      date, raffle_start_date, raffle_end_date, start_time, image, location
    } = eventData;

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
      validateRaffleDate(raffle_start_date, raffle_end_date, date) &&
      validateUpload(image);

    return formValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please ensure all inputs are valid and filled out correctly.');
      return;
    }

    const formData = new FormData();
    Object.keys(eventData).forEach(key => {
      formData.append(key, eventData[key]);
    });

    try {
      const response = await apiClient.post('/admin/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.status === 201) {
        alert('Event created successfully');
        setEventData({
          event_name: '',
          description: '',
          date: '',
          start_time: '',
          location: 'National Stadium',
          organiser: '',
          ticket_availability: '',
          ticket_price: '',
          raffle_start_date: '',
          raffle_end_date: '',
          image: null,
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event');
    }
  };

  return (
    <div className="create-event-form">
      <div className="top">
        <h2>Create Event</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>
            Event Name:
            <input type="text" name="event_name" value={eventData.event_name} onChange={handleChange} required />
            {errors.event_name && <span className="error">{errors.event_name}</span>}
          </label>
          <label>
            Organizer:
            <input type="text" name="organiser" value={eventData.organiser} onChange={handleChange} required />
            {errors.organiser && <span className="error">{errors.organiser}</span>}
          </label>
        </div>
        <label className="full-width-textarea">
          Description:
          <textarea name="description" value={eventData.description} onChange={handleChange} required />
          {errors.description && <span className="error">{errors.description}</span>}
        </label>
        <div className="form-row">
          <label>
            Date:
            <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
            {errors.date && <span className="error">{errors.date}</span>}
          </label>
          <label>
            Start Time:
            <input type="time" name="start_time" value={eventData.start_time} onChange={handleChange} required />
            {errors.start_time && <span className="error">{errors.start_time}</span>}
          </label>
        </div>
        <label className="full-width">
          Location:
          <select name="location" value={eventData.location} onChange={handleChange} required>
            <option value="National Stadium">National Stadium</option>
            <option value="Indoor Stadium">Indoor Stadium</option>
            <option value="Star Vista">Star Vista</option>
            <option value="Expo">Expo</option>
          </select>
          {errors.location && <span className="error">{errors.location}</span>}
        </label>
        <div className="form-row">
          <label>
            Ticket Availability:
            <input type="number" name="ticket_availability" value={eventData.ticket_availability} onChange={handleChange} required />
            {errors.ticket_availability && <span className="error">{errors.ticket_availability}</span>}
          </label>
          <label>
            Ticket Price:
            <input type="number" name="ticket_price" value={eventData.ticket_price} onChange={handleChange} required />
            {errors.ticket_price && <span className="error">{errors.ticket_price}</span>}
          </label>
        </div>
        <div className="form-row">
          <label>
            Raffle Start Date:
            <input type="date" name="raffle_start_date" value={eventData.raffle_start_date} onChange={handleChange} />
            {errors.raffle_start_date && <span className="error">{errors.raffle_start_date}</span>}
          </label>
          <label>
            Raffle End Date:
            <input type="date" name="raffle_end_date" value={eventData.raffle_end_date} onChange={handleChange} />
            {errors.raffle_end_date && <span className="error">{errors.raffle_end_date}</span>}
          </label>
        </div>
        <label>
          Event Image:
          <input type="file" name="image" onChange={handleImageChange} required />
          {errors.image && <span className="error">{errors.image}</span>}
        </label>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;

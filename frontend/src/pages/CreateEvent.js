import React, { useState } from 'react';
import '../styles/css/CreateEvent.css';
import apiClient from '../axiosConfig';

const CreateEvent = () => {
  const [eventData, setEventData] = useState({
    event_name: '',
    description: '',
    date: '',
    start_time: '',
    location: 'National Stadium',
    organiser: '',
    ticket_availability: '',
    price_vip: '',
    price_cat1: '',
    price_cat2: '',
    price_cat3: '',
    price_cat4: '',
    price_cat5: '',
    raffle_start_date: '',
    raffle_end_date: '',
    image: null, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setEventData(prevState => ({
      ...prevState,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          price_vip: '',
          price_cat1: '',
          price_cat2: '',
          price_cat3: '',
          price_cat4: '',
          price_cat5: '',
          raffle_start_date: '',
          raffle_end_date: '',
          image: null,
        });
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
          </label>
          <label>
            Organizer:
            <input type="text" name="organiser" value={eventData.organiser} onChange={handleChange} required />
          </label>
        </div>
        <label className="full-width-textarea">
          Description:
          <textarea name="description" value={eventData.description} onChange={handleChange} required />
        </label>
        <div className="form-row">
          <label>
            Date:
            <input type="date" name="date" value={eventData.date} onChange={handleChange} required />
          </label>
          <label>
            Start Time:
            <input type="time" name="start_time" value={eventData.start_time} onChange={handleChange} required />
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
        </label>
        <div className="form-row">
          <label>
            Ticket Availability:
            <input type="number" name="ticket_availability" value={eventData.ticket_availability} onChange={handleChange} required />
          </label>
          <label>
            Price VIP:
            <input type="number" name="price_vip" value={eventData.price_vip} onChange={handleChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Price Cat1:
            <input type="number" name="price_cat1" value={eventData.price_cat1} onChange={handleChange} required />
          </label>
          <label>
            Price Cat2:
            <input type="number" name="price_cat2" value={eventData.price_cat2} onChange={handleChange} required />
          </label>
        </div>
        <div className="form-row">
          <label>
            Price Cat3:
            <input type="number" name="price_cat3" value={eventData.price_cat3} onChange={handleChange} required />
          </label>
          <label>
            Price Cat4:
            <input type="number" name="price_cat4" value={eventData.price_cat4} onChange={handleChange} required />
          </label>
        </div>
        <label className="full-width">
          Price Cat5:
          <input type="number" name="price_cat5" value={eventData.price_cat5} onChange={handleChange} required />
        </label>
        <div className="form-row">
          <label>
            Raffle Start Date:
            <input type="date" name="raffle_start_date" value={eventData.raffle_start_date} onChange={handleChange} />
          </label>
          <label>
            Raffle End Date:
            <input type="date" name="raffle_end_date" value={eventData.raffle_end_date} onChange={handleChange} />
          </label>
        </div>
        <label>
          Event Image:
          <input type="file" name="image" onChange={handleImageChange} required />
        </label>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;

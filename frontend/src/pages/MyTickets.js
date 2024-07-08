import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import apiClient from '../axiosConfig';
import TicketCard from '../components/TicketCard';
import styles from '../styles/css/MyTickets.css'; // Import the CSS module

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiClient.get('/tickets');
        if (response.status === 200) {
          setTickets(response.data);
        } else {
          throw new Error('Failed to fetch tickets');
        }
      } catch (error) {
        setError('An error occurred while fetching tickets. Please try again later.');
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const openModal = (ticket) => {
    setSelectedTicket(ticket);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTicket(null);
    setEmail('');
    setMessage('');
    setModalOpen(false);
  };

  const handleTransfer = async () => {
    if (!selectedTicket || !email) {
      setMessage('Please provide all required information.');
      return;
    }

    try {
      const response = await apiClient.post('/tickets/transfer', {
        ticket_id: selectedTicket.ticket_id,
        new_user_email: email,
      });

      if (response.status === 200) {
        setMessage('Ticket transferred successfully');
      } else {
        setMessage('Failed to transfer ticket');
      }
    } catch (error) {
      console.error('Error transferring ticket:', error);
      setMessage('An error occurred while transferring the ticket');
    }
  };

  return (
    <div className="myTicketsPage">
      <Navbar />
      <h1>My Tickets</h1>
      {error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        <div className="ticketContainer">
          {tickets.map(ticket => (
            <TicketCard 
              key={ticket.ticket_id} 
              ticket={ticket} 
              openModal={openModal} 
            />
          ))}
        </div>
      )}
      {modalOpen && (
        <div className="modal">
          <div className="modalContent">
            <h2>Transfer Ticket</h2>
            <p>Seat Number: {selectedTicket.seat_number}</p>
            <input
              type="email"
              placeholder="Enter recipient's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className={styles.modalButton} onClick={handleTransfer}>Transfer</button>
            <button className={styles.modalButton} onClick={closeModal}>Close</button>
            {message && <p className={styles.message}>{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;

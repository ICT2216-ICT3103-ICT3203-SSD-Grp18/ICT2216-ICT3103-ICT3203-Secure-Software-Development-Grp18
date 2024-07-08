import React from 'react';
import '../styles/css/TicketCard.css';

const TicketCard = ({ ticket, openModal }) => {
  const { seat_number, price, status, category, transferred_date } = ticket;

  return (
    <div className="card ticket-card">
      <div className="card-body ticket-information">
        <div className="ticket-details">
          <h5 className="ticket-cat">{category}</h5>
          <p className="ticket-price">Price: ${price}</p>
          <p className="ticket-status">Status: {status}</p>
          <p className="ticket-seat">Seat Number: {seat_number}</p>
          <p className="ticket-transferred-date">Transferred Date: {transferred_date}</p>
        </div>
        <button className="transfer-button" onClick={() => openModal(ticket)}>Transfer Ticket</button>
      </div>
    </div>
  );
};

export default TicketCard;

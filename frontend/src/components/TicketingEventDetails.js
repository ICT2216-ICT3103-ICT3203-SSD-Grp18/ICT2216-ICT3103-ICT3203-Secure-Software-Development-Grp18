import React from 'react';
import '../styles/css/TicketingEventDetails.css';

const TicketingEventDetails = () => (
  <div className="ticketing-event-details">
    <section className="exchange-refund-policy">
      <h2>Exchange & Refund Policy</h2>
      <ol>
        <li>The Organiser/Venue Owner reserves the right without refund or compensation to refuse admission/evict any person(s) whose conduct is disorderly or inappropriate or who poses a threat to security, or to the enjoyment of the Event by others.</li>
        <li>Ticket holders assume all risk of injury and all responsibility for property loss, destruction or theft and release the promoters, performers, sponsors, ticket outlets, venues, and their employees from any liability thereafter.</li>
        <li>The resale of ticket(s) at the same or any price in excess of the initial purchase price is prohibited.</li>
        <li>There is no refund, exchange, upgrade, or cancellation once ticket(s) are sold.</li>
        <li>We would like to caution members of the public against purchasing tickets from unauthorized sellers or 3rd party websites. By purchasing tickets through these non-authorized points of sale, buyers take on the risk that the validity of the tickets cannot be guaranteed, with no refunds possible.</li>
      </ol>
    </section>

    <section className="admission-policy">
      <h2>Admission Policy</h2>
      <div className="admission-rules">
        <p><strong>Admission Rules:</strong></p>
        <ol>
          <li>Admission to show/venue by full ticket only. Printed/electronic tickets must be produced for admission.</li>
          <li>There will be no admission for infants in arms and children below 7 years old.</li>
          <li>Individuals aged 7 years old and above will be required to purchase a ticket for admission.</li>
          <li>Any form of photography and videography is not allowed.</li>
        </ol>
      </div>
    </section>
  </div>
);

export default TicketingEventDetails;

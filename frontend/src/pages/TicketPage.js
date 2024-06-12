import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/css/TicketPage.css'; // Ensure this line is included to import the CSS file
import iuImg from '../styles/images/browseconcert/iu.png';

const TicketPage = () => {
    const currentConcert = {
        date: 'December 20, 2024',
        name: 'IU: HER World Tour',
        time: '19:00 SGT',
        location: 'National Stadium',
        description: `Singer-songwriter, composer, and actress IU announces Asia dates on her upcoming 2024 HER World Tour. Produced by Live Nation, the 6 date outing marks IU's first outing across the continent, making stops to Singapore on Dec 20th!`,
        image: iuImg
    };

    const categories = [
        { id: 1, name: 'VIP (Standing)', price: 368.00 },
        { id: 2, name: 'CAT 1', price: 298.00 },
        { id: 3, name: 'CAT 2', price: 268.00 },
        { id: 4, name: 'CAT 3', price: 208.00 },
        { id: 5, name: 'CAT 4', price: 198.00 },
        { id: 6, name: 'CAT 5', price: 168.00 }
    ];

    const [ticketCount, setTicketCount] = useState(categories.map(() => 0));
    const [error, setError] = useState('');

    const incrementTicket = (index) => {
        const newTicketCount = [...ticketCount];
        const selectedCategories = newTicketCount.filter(count => count > 0).length;

        if (newTicketCount[index] === 2 || (selectedCategories > 0 && newTicketCount[index] === 0)) {
            setError('You can only select max 2 tickets from the same category');
        } else {
            setError('');
            newTicketCount[index]++;
            setTicketCount(newTicketCount);
        }
    };

    const decrementTicket = (index) => {
        const newTicketCount = [...ticketCount];
        if (newTicketCount[index] > 0) {
            newTicketCount[index]--;
            setTicketCount(newTicketCount);
            setError('');
        }
    };

    const getTotalPrice = () => {
        return ticketCount.reduce((total, count, index) => total + count * categories[index].price, 0).toFixed(2);
    };

    const hasSelectedTickets = ticketCount.some(count => count > 0);

    return (
        <>
            <Navbar />
            <div className="ticket-page-container">
                <div className="back-button-container">
                    <button className="back-button" onClick={() => window.history.back()}>
                        <i className="bi bi-arrow-left"></i>
                    </button>
                    <h2 className="ticket-options-title">Ticket Options</h2>
                </div>
                <div className="concert-details">
                    <img src={currentConcert.image} alt={currentConcert.name} className="concert-image" />
                    <div className="concert-info">
                        <h1>{currentConcert.name}</h1>
                        <p><strong>Date:</strong> {currentConcert.date}</p>
                        <p><strong>Time:</strong> {currentConcert.time}</p>
                        <p><strong>Location:</strong> {currentConcert.location}</p>
                        <p>{currentConcert.description}</p>
                    </div>
                </div>
                <div className="ticket-options">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`ticket-category ${ticketCount[index] > 0 ? 'selected' : ''}`}
                        >
                            <h2>{category.name}</h2>
                            <p>SGD {category.price.toFixed(2)}</p>
                            <div className="ticket-quantity">
                                <button onClick={() => decrementTicket(index)}>-</button>
                                <span>{ticketCount[index]}</span>
                                <button onClick={() => incrementTicket(index)}>+</button>
                            </div>
                        </div>
                    ))}
                </div>
                {error && <div className='ticket-error-msg'>
                    <p>{error}</p>
                </div>}
                <div className="footer-ticket-page">
                    {hasSelectedTickets ? (
                        <div className="summary">
                            <div className="summary-row">
                                <p>Qty</p>
                                <p>Type</p>
                                <p>Price Total (SGD)</p>
                            </div>
                            {categories.map((category, index) => ticketCount[index] > 0 && (
                                <div key={category.id} className="summary-row">
                                    <p>{ticketCount[index]}</p>
                                    <p>{category.name}</p>
                                    <p>SGD {(ticketCount[index] * category.price).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className='choose-quantity'>Choose your tickets and quantity.</p>
                    )}
                    {hasSelectedTickets && <button className="purchase-button">Buy Tickets</button>}
                </div>
            </div>
        </>
    );
};

export default TicketPage;


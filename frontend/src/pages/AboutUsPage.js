import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/css/AboutUsPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AboutUs = () => {
    return (
        <div className="about-us-page">
    <header>
        <Navbar />
    </header>
    <main className="container mt-5">
        <section className="about-us-section">
            <h1>About Us</h1>
            <p>Welcome to <strong>TicketingHuat</strong>, your go-to destination for all things concert tickets! Launched in 2024, TicketingHuat was created with a simple mission: to make purchasing concert tickets as seamless and enjoyable as the concerts themselves. We believe that music is a universal language that brings people together, and our goal is to make sure everyone has access to the live music experiences they love.</p>
        </section>
        <section className="mission-vision-section">
            <div className="mission">
                <h2>Our Mission</h2>
                <p>At TicketingHuat, our mission is to provide a user-friendly, reliable, and secure platform for purchasing concert tickets. We strive to offer a wide variety of tickets for concerts around the world, ensuring that every music lover can find and attend the events they're passionate about.</p>
            </div>
            <div className="vision">
                <h2>Our Vision</h2>
                <p>Our vision is to become the leading concert ticketing platform globally, recognized for our exceptional customer service, extensive ticket selection, and innovative technology. We aim to set new standards in the ticketing industry by continually improving and expanding our services to meet the evolving needs of our customers.</p>
            </div>
        </section>
        <section className="what-we-offer-section">
            <h2>What We Offer</h2>
            <ul>
                <li><strong>Extensive Ticket Selection:</strong> From the biggest international tours to the hottest local gigs, we offer tickets to a wide range of concerts.</li>
                <li><strong>Secure Transactions:</strong> Our platform ensures that all transactions are secure, giving you peace of mind when purchasing tickets.</li>
                <li><strong>User-Friendly Interface:</strong> Our website and app are designed to provide a seamless and intuitive experience, making it easy for you to find and purchase tickets.</li>
            </ul>
        </section>
        <section className="join-us-section">
            <h2>Join Us</h2>
            <p>Join the TicketingHuat community and never miss out on your favorite concerts again. Sign up for our newsletter to stay updated on the latest concerts, exclusive deals, and special promotions. Follow us on social media to connect with fellow music lovers and share your concert experiences.</p>
            <p>Thank you for choosing TicketingHuat. We look forward to helping you create unforgettable concert memories!</p>
        </section>
    </main>
    <footer>
        <Footer />
    </footer>
</div>
    );
  };
  
  export default AboutUs;
  
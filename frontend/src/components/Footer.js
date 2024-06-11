import React from 'react';
import '../styles/css/Footer.css';
import appstore from '../styles/images/social/app-store.png'
import googleplay from '../styles/images/social/google-play.png'
import twitter from '../styles/images/social/twitter.png'
import instagram from '../styles/images/social/instagram.png'
import facebook from '../styles/images/social/facebook.png'
// import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa'; // Importing icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section logo">
          <h2>TicketingHuat</h2>
        </div>
        <div className="footer-section about">
          <h3>About</h3>
          <ul>
            <li><a href="#about">About TicketingHuat</a></li>
            <li><a href="#how-it-works">How it works</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#press">Press</a></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#forum">Forum</a></li>
          </ul>
        </div>
        <div className="footer-section partner">
          <h3>Partner with us</h3>
          <ul>
            <li><a href="#partnership-programs">Partnership programs</a></li>
            <li><a href="#affiliate-program">Affiliate program</a></li>
            <li><a href="#connectivity-partners">Connectivity partners</a></li>
            <li><a href="#promotions-events">Promotions and events</a></li>
            <li><a href="#integrations">Integrations</a></li>
            <li><a href="#community">Community</a></li>
            <li><a href="#loyalty-program">Loyalty program</a></li>
          </ul>
        </div>
        <div className="footer-section support">
          <h3>Support</h3>
          <ul>
            <li><a href="#help-center">Help Center</a></li>
            <li><a href="#contact-us">Contact us</a></li>
            <li><a href="#privacy-policy">Privacy policy</a></li>
            <li><a href="#terms-of-service">Terms of service</a></li>
            <li><a href="#trust-safety">Trust and safety</a></li>
            <li><a href="#accessibility">Accessibility</a></li>
          </ul>
        </div>
        <div className="footer-section app">
          <h3>Get the app</h3>
          <ul>
            <li><a href="#android-app">TicketingHuat for Android</a></li>
            <li><a href="#ios-app">TicketingHuat for iOS</a></li>
            <li><a href="#mobile-site">Mobile site</a></li>
          </ul>
          <div className="app-links">
            <a href="#app-store"><img src={appstore} alt="App Store" /></a>
            <a href="#google-play"><img src={googleplay} alt="Google Play" /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="social-links">
          <a href="#twitter"><img src={twitter} alt="twitter" /></a>
          <a href="#instagram"><img src={instagram} alt="instagram" /></a>
          <a href="#facebook"><img src={facebook} alt="facebook" /></a>
        </div>
        <p>&copy; 2024 TicketingHuat incorporated</p>
      </div>
    </footer>
  );
};

export default Footer;

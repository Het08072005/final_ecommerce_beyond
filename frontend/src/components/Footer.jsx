import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow-line"></div>
      <div className="footer-content">
        <div className="footer-section">
          <h4 className="glow-text">About ShoeMart</h4>
          <p>Your one-stop shop for premium quality shoes and footwear for men and women.</p>
          <div className="ai-branding">
            <span>Powered by</span>
            <span className="vikara-name"> Vikara AI</span>
          </div>
        </div>

        <div className="footer-section">
          <h4 className="glow-text">Quick Links</h4>
          <ul>
            <li><Link to="/products" className="animated-link">Shop All Shoes</Link></li>
            <li><Link to="/products?category=men" className="animated-link">Men's Shoes</Link></li>
            <li><Link to="/products?category=women" className="animated-link">Women's Shoes</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="glow-text">Customer Service</h4>
          <ul>
            <li><a href="#contact" className="animated-link">Contact Us</a></li>
            <li><a href="#shipping" className="animated-link">Shipping Info</a></li>
            <li><a href="#returns" className="animated-link">Returns Policy</a></li>
            <li><a href="#faq" className="animated-link">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="glow-text">Contact Info</h4>
          <p>Email: <span className="highlight">support@shoemart.com</span></p>
          <p>Phone: <span className="highlight">+1 (555) 123-4567</span></p>
          <p>Address: 123 Shoe Street, NY 10001</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ShoeMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 Open Talk Network. All rights reserved.</p>
      <div className="social-links">
        <a href="#">Facebook</a> | 
        <a href="#">Twitter</a> | 
        <a href="#">LinkedIn</a>
      </div>
    </footer>
  );
}

export default Footer;

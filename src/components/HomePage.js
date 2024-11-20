import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-container">
      <h1>Welcome to Debate Master!</h1>
      <p>Select an option to start:</p>
      <div className="button-group">
        <Link to="/debate-room"><button className="btn-primary">Join a Debate Room</button></Link>
        <Link to="/profile/12345"><button className="btn-secondary">View Profile</button></Link>
      </div>
    </div>
  );
}

export default HomePage;

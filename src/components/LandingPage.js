import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

// Typing effect hook
function useTypingEffect(text, speed = 100) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [text, speed]);

  return displayedText;
}

// Features component
function LandingPageFeatures() {
  return (
    <div className="features-section">
      <h2>What We Offer</h2>
      <div className="features-grid">
        <div className="feature-item">
          <i className="fas fa-users"></i>
          <h3>Join Live Debates</h3>
          <p>Engage in real-time debates on trending topics.</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-lightbulb"></i>
          <h3>Explore Hot Topics</h3>
          <p>Discover and discuss what’s making headlines.</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-comments"></i>
          <h3>Network with Debaters</h3>
          <p>Connect with fellow enthusiasts and experts.</p>
        </div>
        <div className="feature-item">
          <i className="fas fa-chart-line"></i>
          <h3>Hone Your Skills</h3>
          <p>Receive feedback and improve your debating skills.</p>
        </div>
      </div>
    </div>
  );
}

// Testimonials component
function Testimonials() {
  return (
    <div className="testimonials-section">
      <h2>What Our Users Are Saying</h2>
      <div className="testimonials">
        <blockquote>"A fantastic place to challenge myself and meet like-minded individuals!"</blockquote>
        <blockquote>"I’ve grown so much in my debating skills since joining."</blockquote>
        <blockquote>"This platform is perfect for anyone looking to improve their public speaking."</blockquote>
      </div>
    </div>
  );
}

function LandingPage() {
  const { user } = useAuth();
  const welcomeMessage = user ? `Welcome back, ${user.firstName}!` : '';
  const typedText = useTypingEffect(welcomeMessage, 100);

  return (
    <div className="landing-container">
      <div className="hero-section">
        {user ? (
          <h1>{typedText}</h1>
        ) : (
          <>
            <h1>Open Talk Network</h1>
            <div className="button-group">
              <Link to="/sign-up" className="button-primary">Get Started</Link>
              <Link to="/login" className="button-secondary">Log In</Link>
            </div>
          </>
        )}
      </div>
      <LandingPageFeatures />
      <Testimonials />
    </div>
  );
}

export default LandingPage;

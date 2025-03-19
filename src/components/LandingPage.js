import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

function HeroSection() {
  return (
    <section className="hero-section-clean">
      <div className="hero-content">
        <h1 className="hero-title">North Point. TV</h1>
        <h2 className="hero-question">Q of the Day: Can AI Be Truly Ethical?</h2>
      </div>
    </section>
  );
}

function BreakingNews() {
  const newsItems = [
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
    "Global Youth Summit: Record turnout for debates on sustainability",
    "AI Ethics: Heated discussions on responsible AI development",
    "Education Forum: Innovative approaches to virtual learning debated",
  ];

  return (
    <div className="breaking-news">
      <marquee className="news-ticker" behavior="scroll" direction="left">
        {newsItems.map((item, index) => (
          <span key={index} className="news-item">{item} &nbsp; | &nbsp;</span>
        ))}
      </marquee>
    </div>
  );
}

function Section({ title, image, description, link }) {
  return (
    <div className="section">
      <img src={image} alt={title} className="section-image" />
      <div className="section-content">
        <h3 className="section-title">{title}</h3>
        <p className="section-description">{description}</p>
        <Link to={link} className="section-link">Explore More</Link>
      </div>
    </div>
  );
}

function LatestNews() {
  const newsList = [
    { title: "Is TikTok an emerging e-commerce behemoth?", time: "3 hours ago" },
    { title: "Flavored vapes made it to the Supreme Court", time: "3 hours ago" },
    { title: "Beleaguered Intel bids adieu to CEO", time: "10 hours ago" },
    { title: "Optim-eyes the holidays", time: "17 hours ago" },
    { title: "RFK Jr.'s cabinet nomination tanks pharma stocks", time: "8 hours ago" },
  ];

  return (
    <div className="latest-news">
      <h3 className="latest-news-title">The Latest</h3>
      <ul className="latest-news-list">
        {newsList.map((news, index) => (
          <li key={index} className="latest-news-item">
            <h4 className="latest-news-headline">{news.title}</h4>
            <p className="latest-news-time">{news.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeaturedDebate() {
  return (
    <div className="featured-debate">
      <img
        src="/annie-spratt-4-4WPFLVhAY-unsplash.jpg"
        alt="Featured Debate"
        className="featured-debate-image"
      />
      <div className="featured-debate-content">
        <h2 className="featured-debate-title">Featured Debate: The Role of AI in Education</h2>
        <p className="featured-debate-description">
          Join the discussion on how artificial intelligence is shaping the future of learning.
        </p>
        <Link to="/debate/ai-education" className="featured-debate-button">Join Now</Link>
      </div>
    </div>
  );
}

function UpcomingEvents() {
  const events = [
    { date: "Mar 21", topic: "Climate Action Debate", time: "5:00 PM" },
    { date: "Mar 22", topic: "Tech Ethics in 2024", time: "3:00 PM" },
    { date: "Mar 23", topic: "Healthcare Inequalities", time: "4:00 PM" },
    { date: "Mar 24", topic: "Sportsmanship in Global Games", time: "2:00 PM" },
  ];

  return (
    <div className="upcoming-events">
      <h3 className="upcoming-events-title">Upcoming Events</h3>
      <ul className="upcoming-events-list">
        {events.map((event, index) => (
          <li key={index} className="upcoming-event-item">
            <p className="event-date">{event.date}</p>
            <p className="event-topic">{event.topic}</p>
            <p className="event-time">{event.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="landing-page">
      <HeroSection />
      <BreakingNews />
      <FeaturedDebate />
      <div className="main-columns">
        <div className="topics-column">
          <Section
            title="Politics"
            image="/analysis-680572_1920.jpg"
            description="Explore debates on government policies, elections, and global diplomacy."
            link="/topics/politics"
          />
          <Section
            title="Environment"
            image="/pollution-8252584_1920.jpg"
            description="Engage in discussions on sustainability, climate change, and green policies."
            link="/topics/environment"
          />
          <Section
            title="Technology"
            image="/luca-bravo-XJXWbfSo2f0-unsplash.jpg"
            description="Delve into debates on AI ethics, cybersecurity, and the future of tech."
            link="/topics/technology"
          />
          <Section
            title="Healthcare"
            image="/nappy-LbXiTBjHXdo-unsplash.jpg"
            description="Debate topics on universal healthcare, medical ethics, and wellness trends."
            link="/topics/healthcare"
          />
          <Section
            title="Sports"
            image="/ball-8279729_1920.jpg"
            description="Dive into debates about sportsmanship, ethics, and global sports events."
            link="/topics/sports"
          />
          <Section
            title="Entertainment"
            image="/food-7908758_1920.jpg"
            description="Explore debates on movies, music, and the future of entertainment."
            link="/topics/entertainment"
          />
          <Section
            title="Economics"
            image="/corona-4917912_1920.jpg"
            description="Discuss global economies, financial systems, and economic policies."
            link="/topics/economics"
          />
          <Section
            title="Education"
            image="/ai-generated-9010764_1920.jpg"
            description="Engage in discussions about the future of learning and educational systems."
            link="/topics/education"
          />
        </div>
        <div className="right-column">
          <LatestNews />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

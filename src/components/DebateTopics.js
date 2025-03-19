import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DebateTopics.css';

function DebateCard({ topic, handleRequestToDebate, handleMarkAttendance, handleJoinDebate }) {
  return (
    <div className="debate-card">
      <div className="debate-content">
        <h2 className="debate-title">{topic.title}</h2>
        <p className="debate-description">{topic.description}</p>
        <p className="debate-date">
          <i className="fa fa-calendar"></i> {new Date(topic.date).toLocaleString()}
        </p>
        <p className="debate-attendees">
          <i className="fa fa-users"></i> {topic.attendanceCount} attendees
        </p>
        <div className="debate-actions">
          {topic.status === "Open for applications" ? (
            <>
              <button className="debate-button debate-button-primary" onClick={() => handleRequestToDebate(topic._id, 'for')}>
                Debate For
              </button>
              <button className="debate-button debate-button-primary" onClick={() => handleRequestToDebate(topic._id, 'against')}>
                Debate Against
              </button>
            </>
          ) : (
            <button className="debate-button debate-button-disabled" disabled>
              Applications Closed
            </button>
          )}
          <button className="debate-button debate-button-secondary" onClick={() => handleMarkAttendance(topic._id)}>
            Mark Attendance
          </button>
          {topic.isLive && (
            <button className="debate-button debate-button-live" onClick={() => handleJoinDebate(topic._id)}>
              Join Live Debate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function DebateTopics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/debate-topics');
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format received from API.');
        setTopics(data);
      } catch (error) {
        console.error("Error fetching debates:", error);
        toast.error("Failed to load debates.");
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, []);

  const handleRequestToDebate = async (topicId, side) => {
    if (!user) {
      toast.error('Please log in to request participation.');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/debate-topics/${topicId}/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, side }),
      });
      if (!response.ok) throw new Error('Failed to submit request.');
      toast.success(`Request to debate "${side}" submitted!`);
    } catch (error) {
      console.error("Error submitting debate request:", error);
      toast.error("Error submitting request.");
    }
  };

  const handleMarkAttendance = async (topicId) => {
    if (!user) {
      toast.error('Please log in to mark attendance.');
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`http://localhost:3001/api/debate-topics/${topicId}/attend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id }),
      });
      if (!response.ok) throw new Error('Failed to mark attendance.');
      toast.success(`Attendance marked for topic ${topicId}!`);
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance.");
    }
  };

  const handleJoinDebate = (roomId) => {
    if (!user) {
      toast.error('Please log in to join a debate.');
      navigate('/login');
      return;
    }
    navigate(`/debate-room/${roomId}`);
  };

  if (loading) return <p>Loading debates...</p>;

  return (
    <div className="debate-topics">
      <h1>Upcoming Debates</h1>
      <div className="debate-grid">
        {topics.length > 0 ? topics.map((topic) => (
          <DebateCard
            key={topic._id}
            topic={topic}
            handleRequestToDebate={handleRequestToDebate}
            handleMarkAttendance={handleMarkAttendance}
            handleJoinDebate={handleJoinDebate}
          />
        )) : (
          <p>No debates available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default DebateTopics;

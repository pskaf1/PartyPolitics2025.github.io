// src/components/Topics.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Topics({ userId }) {
  const [topics, setTopics] = useState([]);
  const [requestStatus, setRequestStatus] = useState({});

  useEffect(() => {
    // Fetch topics from the backend
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://localhost:3001/debate-topics');
        setTopics(response.data);
      } catch (error) {
        console.error('Error fetching topics:', error);
      }
    };

    fetchTopics();
  }, []);

  const requestToDebate = async (topicId, side) => {
    try {
      const response = await axios.post('http://localhost:3001/request-debate', {
        userId,
        topicId,
        side,
      });
      setRequestStatus((prevStatus) => ({
        ...prevStatus,
        [topicId]: response.data.status,
      }));
      alert('Request submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Failed to submit request');
    }
  };

  return (
    <div className="topics-container">
      <h1>Available Debate Topics</h1>
      <ul>
        {topics.map((topic) => (
          <li key={topic._id} className="topic-item">
            <h2>{topic.title}</h2>
            <p>{topic.description}</p>
            <p>Date: {new Date(topic.debateDate).toLocaleString()}</p>
            <div className="actions">
              <button onClick={() => requestToDebate(topic._id, 'pro')}>Request as Pro</button>
              <button onClick={() => requestToDebate(topic._id, 'con')}>Request as Con</button>
            </div>
            <p>Status: {requestStatus[topic._id] || 'Not requested'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Topics;

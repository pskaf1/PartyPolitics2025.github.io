// src/components/DebateTopics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import 'react-toastify/dist/ReactToastify.css';
import './DebateTopics.css';

const socket = io('http://localhost:3001');  // Connect to backend server for real-time updates

function DebateTopics() {
  const { user } = useAuth();
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSide, setSelectedSide] = useState(null);
  const navigate = useNavigate();

  // Fetch topics initially and on real-time update from the server
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await axios.get('http://localhost:3001/debate-topics');
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      }
    };
    fetchTopics();

    // Listen for real-time updates
    socket.on('debateStatusChange', fetchTopics);

    // Clean up socket listener
    return () => {
      socket.off('debateStatusChange', fetchTopics);
    };
  }, []);

  const openModal = (topic, side) => {
    if (!user) {
      toast.warn("Please log in to request to debate.");
      navigate("/login");
      return;
    }

    const now = new Date();
    const debateTime = new Date(topic.date);
    if (debateTime - now < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      toast.error("Requests to debate are closed for this topic.");
      return;
    }

    setSelectedTopic(topic);
    setSelectedSide(side);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTopic(null);
    setSelectedSide(null);
  };

  const submitDebateRequest = async () => {
    try {
      await axios.post('http://localhost:3001/request-debate', {
        userId: user._id,
        topicId: selectedTopic._id,
        side: selectedSide,
      });
      toast.success("Request submitted successfully!");
      closeModal();
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request.");
    }
  };

  const handleMarkAsAttending = async (topicId) => {
    try {
      const response = await axios.post(`http://localhost:3001/debate-topics/${topicId}/attend`);
      if (response.data.success) {
        toast.success("You have marked yourself as attending!");
        setTopics((prevTopics) =>
          prevTopics.map((topic) =>
            topic._id === topicId
              ? { ...topic, attendanceCount: topic.attendanceCount + 1 }
              : topic
          )
        );
      } else {
        toast.error("Failed to mark as attending.");
      }
    } catch (error) {
      console.error("Error marking as attending:", error);
      toast.error("An error occurred.");
    }
  };

  const getStatusLabel = (topic) => {
    const now = new Date();
    const debateTime = new Date(topic.date);

    if (debateTime <= now) return "Live";
    if (debateTime - now < 24 * 60 * 60 * 1000) return "Closed for applications";
    return "Open for applications";
  };

  return (
    <div className="debate-topics-container">
      <h2>Available Debate Topics</h2>
      <div className="topics-grid">
        {topics.map((topic) => (
          <div key={topic._id} className="topic-card">
            <h3>{topic.title}</h3>
            <p>{topic.description}</p>
            <div className="debate-details">
              <p><strong>Date:</strong> {new Date(topic.date).toLocaleString() || "TBD"}</p>
              <p><strong>Status:</strong> {getStatusLabel(topic)}</p>
              <p><strong>Slots:</strong> For: 1, Against: 1</p>
              <p><strong>Attendees:</strong> {topic.attendanceCount || 0}</p>
            </div>
            <div className="action-buttons">
              {getStatusLabel(topic) === "Open for applications" && (
                <>
                  <button onClick={() => openModal(topic, 'for')} className="button-for">Request to Debate For</button>
                  <button onClick={() => openModal(topic, 'against')} className="button-against">Request to Debate Against</button>
                </>
              )}
              <button onClick={() => handleMarkAsAttending(topic._id)} className="button-attend">Will be Attending</button>
              {getStatusLabel(topic) === "Live" && (
                <button onClick={() => navigate(`/debate-room/${topic._id}`)} className="button-watch">Watch Debate</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Request to Debate</h2>
            <p><strong>Topic:</strong> {selectedTopic?.title}</p>
            <p><strong>Side:</strong> {selectedSide === 'for' ? 'For' : 'Against'}</p>
            <button onClick={submitDebateRequest}>Submit Request</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DebateTopics;

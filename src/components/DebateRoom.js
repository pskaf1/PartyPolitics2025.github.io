import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DebateRoom.css';

const socket = io('http://localhost:3001');

function DebateRoom({ userRole }) {
  const { user, loading, fetchSessionUser } = useAuth();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [votes, setVotes] = useState({ for: 0, against: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const myVideo = useRef(null);
  const opponentVideo = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      console.warn("❌ No user detected, fetching session user...");
      fetchSessionUser();
      return;
    }

    if (!roomId) {
      console.error("❌ `roomId` is missing! Redirecting to topics.");
      navigate('/debate-topics');
      return;
    }

    console.log(`✅ Joining room: ${roomId} as ${user.firstName}`);
    socket.emit('joinRoom', { roomId, user });

    socket.on('chatMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('voteUpdate', (updatedVotes) => {
      setVotes(updatedVotes);
    });

    socket.on('viewerCountUpdate', (count) => {
      setViewerCount(count);
    });

    return () => {
      console.log(`🔄 Cleaning up socket events for room: ${roomId}`);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
      socket.off('chatMessage');
      socket.off('voteUpdate');
      socket.off('viewerCountUpdate');
    };
  }, [roomId, user, loading, fetchSessionUser, navigate]);

  const handleSendMessage = () => {
    if (!user || !user.firstName) {
      toast.warn('Please log in to send messages.');
      return;
    }
    if (!roomId) return;

    if (message.trim()) {
      socket.emit('chatMessage', {
        roomId,
        text: message,
        user: { _id: user._id, firstName: user.firstName },
      });
      setMessage('');
    } else {
      toast.warn('Message cannot be empty.');
    }
  };

  const handleVote = (side) => {
    if (!user || !user._id) {
      toast.warn('Please log in to vote.');
      return;
    }
    if (hasVoted) {
      toast.warn('You can only vote once.');
      return;
    }
    if (!roomId) return;

    socket.emit('vote', { roomId, side, userId: user._id });
    setHasVoted(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="debate-room">
      <div className="header">
        <h1>
          <span className="live-dot"></span> Live Debate Room
          <span className="viewer-count">{viewerCount} Viewers Watching Now</span>
        </h1>
      </div>

      <div className="debate-stage-container">
        <div className="debate-stage">
          <div className="video-container">
            <video ref={myVideo} playsInline autoPlay muted className="video-box" />
            <div className="participant-label">Participant 1</div>
          </div>
          <div className="video-container">
            <video ref={opponentVideo} playsInline autoPlay className="video-box" />
            <div className="participant-label">Participant 2</div>
          </div>
        </div>
      </div>

      <div className="voting-section">
        <h3>Who do you agree with more?</h3>
        <div className="vote-buttons">
          <button onClick={() => handleVote('for')} className="vote-button" disabled={hasVoted}>
            Participant 1
          </button>
          <button onClick={() => handleVote('against')} className="vote-button" disabled={hasVoted}>
            Participant 2
          </button>
        </div>
        <p>Participant 1: {votes.for} | Participant 2: {votes.against}</p>
      </div>

      <div className="chat-section">
        <h3>Live Chat</h3>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              <strong>{msg.sender || 'Spectator'}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="send-button" onClick={handleSendMessage}>
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;

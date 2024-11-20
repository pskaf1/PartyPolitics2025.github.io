// src/components/DebateRoom.js
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DebateRoom.css';

const socket = io('http://localhost:3001');

function DebateRoom({ userRole }) {
  const { user } = useAuth();
  const { roomId } = useParams();
  const [stream, setStream] = useState(null);
  const myVideo = useRef(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [votes, setVotes] = useState({ for: 0, against: 0 });
  const [hasVoted, setHasVoted] = useState(false);
  const [turn, setTurn] = useState("participant1");

  useEffect(() => {
    console.log("User data on component load:", user);

    const getMedia = async () => {
      if (userRole === 'participant') {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "user" },
            audio: true,
          });
          setStream(mediaStream);
          if (myVideo.current) {
            myVideo.current.srcObject = mediaStream;
          }
        } catch (error) {
          console.error('Media access error:', error);
        }
      }
    };

    getMedia();

    // Join room with user data
    socket.emit('joinRoom', { roomId, userRole, user });

    // Socket listeners
    socket.on('chatMessage', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('voteUpdate', (updatedVotes) => {
      setVotes(updatedVotes);
    });

    socket.on('updateTurn', (newTurn) => {
      setTurn(newTurn);
    });

    // Cleanup on component unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      socket.off('joinRoom');
      socket.off('chatMessage');
      socket.off('voteUpdate');
      socket.off('updateTurn');
    };
  }, [roomId, userRole, stream, user]);

  const handleSendMessage = () => {
    if (!user || !user.name) {
      toast.warn("Please log in to send messages.");
      return;
    }
    if (message.trim()) {
      socket.emit("chatMessage", {
        roomId,
        text: message,
        user, // Pass full user object to ensure backend access to name
      });
      setMessage("");
    }
  };

  const handleVote = (side) => {
    if (!user || !user._id) {
      toast.warn("Please log in to vote.");
      return;
    }
    if (hasVoted) {
      toast.warn("You can only vote once.");
      return;
    }
    socket.emit('vote', { roomId, side, userId: user._id });
    setHasVoted(true);
  };

  const handleNextTurn = () => {
    const nextTurn = turn === 'participant1' ? 'participant2' : 'participant1';
    socket.emit('nextTurn', { roomId, turn: nextTurn });
    setTurn(nextTurn);
  };

  return (
    <div className="debate-room-container">
      <div className="video-section">
        {userRole === 'participant' ? (
          <video ref={myVideo} playsInline autoPlay muted className="video-box" />
        ) : (
          <p className="observer-label">Observer mode: Watching the debate</p>
        )}
      </div>

      <div className="voting-section">
        <h3>Vote for the debate:</h3>
        <button onClick={() => handleVote('for')} className="vote-button" disabled={hasVoted}>Vote For</button>
        <button onClick={() => handleVote('against')} className="vote-button" disabled={hasVoted}>Vote Against</button>
        <p>For: {votes.for} | Against: {votes.against}</p>
      </div>

      {userRole === 'participant' && (
        <div className="turn-section">
          <p>Current Turn: {turn === 'participant1' ? 'Participant 1' : 'Participant 2'}</p>
          <button onClick={handleNextTurn} className="next-turn-button">End Turn</button>
        </div>
      )}

      <div className="chat-container">
        <h2>Chat</h2>
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
          <button className="send-button" onClick={handleSendMessage}>→</button>
        </div>
      </div>
    </div>
  );
}

export default DebateRoom;

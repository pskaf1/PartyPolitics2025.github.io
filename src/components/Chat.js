import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

const Chat = ({ roomId, userId, userRole }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('message', (message) => setMessages((prev) => [...prev, message]));

    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('message', {
        roomId,
        userId,
        userRole,
        content: newMessage,
        timestamp: new Date().toLocaleTimeString(),
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <p key={index} style={{ color: msg.userRole === 'participant' ? 'blue' : 'green' }}>
            <strong>{msg.userId} ({msg.userRole}):</strong> {msg.content} <span style={{ fontSize: '0.8em', color: 'gray' }}>{msg.timestamp}</span>
          </p>
        ))}
      </div>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;



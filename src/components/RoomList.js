import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const RoomList = () => {
  const [roomId, setRoomId] = useState('');

  const handleJoinRoom = () => {
    if (roomId) {
      // Redirect to the debate room with the selected ID
      window.location.href = `/debate-room/${roomId}`;
    }
  };

  return (
    <div className="room-list">
      <h1>Join a Debate Room</h1>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={handleJoinRoom}>Join Room</button>

      {/* List of example rooms */}
      <ul>
        <li><Link to="/debate-room/room1">Room 1</Link></li>
        <li><Link to="/debate-room/room2">Room 2</Link></li>
        <li><Link to="/debate-room/room3">Room 3</Link></li>
      </ul>
    </div>
  );
};

export default RoomList;

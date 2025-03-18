const path = require('path');
const User = require(path.resolve(__dirname, '../models/User'));
console.log('Resolved path for User model:', path.resolve(__dirname, '../models/User'));

const roomVotes = {};
const userVotes = {};
const roomUsers = {}; // Track users in each room

const initWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle user joining a debate room
    socket.on('joinRoom', async (data) => {
      const { roomId, user } = data;

      if (!roomId || !user || !user._id) {
        console.warn('Invalid data for joining room:', data);
        socket.emit('error', { message: 'Invalid room or user data.' });
        return;
      }

      try {
        const userExists = await User.findById(user._id);
        if (!userExists) {
          socket.emit('error', { message: 'User not found.' });
          return;
        }

        if (!roomVotes[roomId]) roomVotes[roomId] = { for: 0, against: 0 };
        if (!userVotes[roomId]) userVotes[roomId] = {};
        if (!roomUsers[roomId]) roomUsers[roomId] = [];

        socket.join(roomId);
        roomUsers[roomId].push(user);

        console.log(`${user.firstName} joined room: ${roomId}`);
        io.to(roomId).emit('userJoined', { userId: user._id, name: user.firstName, users: roomUsers[roomId] });
        io.to(roomId).emit('viewerCountUpdate', roomUsers[roomId].length);
      } catch (error) {
        console.error('Error processing joinRoom:', error);
        socket.emit('error', { message: 'An error occurred while joining the room.' });
      }
    });

    // Handle chat messages
    socket.on('chatMessage', (data) => {
      const { roomId, text, user } = data;

      if (!roomId || !text || !user || !user._id) {
        console.warn('Invalid chat message data:', data);
        return;
      }

      const message = {
        sender: user.firstName,
        text,
        timestamp: new Date(),
      };

      console.log(`New chat message in ${roomId}:`, message);
      io.to(roomId).emit('chatMessage', message);
    });

    // Handle voting
    socket.on('vote', (data) => {
      const { roomId, side, userId } = data;

      if (!roomId || !side || !userId || !['for', 'against'].includes(side)) {
        console.warn('Invalid vote data:', data);
        return;
      }

      if (userVotes[roomId][userId]) {
        console.warn(`User ${userId} already voted in ${roomId}`);
        return;
      }

      userVotes[roomId][userId] = side;
      roomVotes[roomId][side] += 1;

      console.log(`Vote update in ${roomId}:`, roomVotes[roomId]);
      io.to(roomId).emit('voteUpdate', roomVotes[roomId]);
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);

      for (const roomId in roomUsers) {
        roomUsers[roomId] = roomUsers[roomId].filter(user => user.socketId !== socket.id);
        io.to(roomId).emit('viewerCountUpdate', roomUsers[roomId].length);
      }
    });
  });
};

module.exports = initWebSocket;

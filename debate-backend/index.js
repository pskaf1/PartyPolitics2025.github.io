require('dotenv').config();
console.log("Current working directory:", process.cwd());

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const cron = require('node-cron');
const sendEmail = require('./utils/sendEmail');

// Import models and utilities
const User = require('./models/User');
const DebateTopic = require('./models/DebateTopic');
const DebateRequest = require('./models/DebateRequest');
const selectDebateParticipants = require('./debateSelection');

// Import routes
const authRoutes = require('./routes/auth');
const debateRequestRoutes = require('./routes/debateRequest');
const debateTopicsRoutes = require('./routes/debate-topics');

// Initialize Express and server instances
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/debate-platform')
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB connection error:', err));

// Register routes
app.use('/api', authRoutes);
app.use('/api/debate-request', debateRequestRoutes);
app.use('/api/debate-topics', debateTopicsRoutes);

// Scheduled participant selection and email notifications
cron.schedule('0 0 * * *', () => {
  console.log('Running daily participant selection...');
  selectDebateParticipants();
});

// Scheduled reminders for participants and attendees
cron.schedule('*/10 * * * *', async () => {
  const now = new Date();
  const fortyFiveMinutesAhead = new Date(now.getTime() + 45 * 60 * 1000);
  const twentyMinutesAhead = new Date(now.getTime() + 20 * 60 * 1000);

  try {
    const debatesForParticipants = await DebateTopic.find({ date: { $lte: fortyFiveMinutesAhead, $gt: now } });
    for (const debate of debatesForParticipants) {
      const participants = await DebateRequest.find({ topicId: debate._id, status: 'selected' });
      for (const participant of participants) {
        const emailContent = `Reminder: Your debate "${debate.title}" starts in 45 minutes. Please prepare!`;
        await sendEmail(participant.userId, '45-Minute Debate Reminder', emailContent);
      }
      console.log(`45-minute reminders sent for debate: "${debate.title}"`);
    }

    const debatesForAttendees = await DebateTopic.find({ date: { $lte: twentyMinutesAhead, $gt: now } });
    for (const debate of debatesForAttendees) {
      const attendees = await DebateRequest.find({ topicId: debate._id, status: 'attending' });
      for (const attendee of attendees) {
        const emailContent = `Reminder: The debate "${debate.title}" you’re attending begins in 20 minutes. Join to watch!`;
        await sendEmail(attendee.userId, '20-Minute Debate Reminder', emailContent);
      }
      console.log(`20-minute reminders sent for debate: "${debate.title}"`);
    }
  } catch (error) {
    console.error("Error sending reminders:", error);
  }
});

// Real-time updates for debate topics
cron.schedule('*/10 * * * *', async () => {
  console.log("Running job to delete expired debate topics...");
  const expirationTime = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago

  try {
    const result = await DebateTopic.deleteMany({ date: { $lt: expirationTime } });
    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} expired debate topics.`);
      io.emit('debateStatusChange', { message: 'Debate topics updated' });
    } else {
      console.log("No expired debate topics to delete.");
    }
  } catch (error) {
    console.error("Error deleting expired debate topics:", error);
  }
});

// WebSocket communication for debates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Handle joining a debate room
  socket.on('joinRoom', (data) => {
    const { roomId, user } = data;
    socket.join(roomId);
    console.log(`${socket.id} joined room ${roomId} as ${user?.name || 'Unknown'}`);
    io.to(roomId).emit('userJoined', { userId: socket.id, name: user?.name || 'Unknown' });
  });

  // Handle real-time chat messages
  socket.on('chatMessage', (data) => {
    const { roomId, text, user } = data;
    io.to(roomId).emit('chatMessage', { text, sender: user.name || 'Spectator' });
    console.log(`Message from ${user.name || 'Spectator'} in room ${roomId}: ${text}`);
  });
  

  // Handle voting events
  let voteCounts = { for: 0, against: 0 };
socket.on('vote', (data) => {
  const { roomId, side } = data;
  if (side === 'for') voteCounts.for += 1;
  else if (side === 'against') voteCounts.against += 1;

  io.to(roomId).emit('voteUpdate', voteCounts);
});

// index.js - Within your WebSocket handling for votes

// Track votes per user in each room
const userVotes = {}; // Structure: { roomId: { userId: true } }

io.on('connection', (socket) => {
  socket.on('vote', ({ roomId, side, userId }) => {
    // Check if user has already voted
    if (userVotes[roomId] && userVotes[roomId][userId]) {
      io.to(socket.id).emit('voteError', { message: 'You have already voted.' });
      return;
    }

    // Track that the user has voted in this room
    if (!userVotes[roomId]) userVotes[roomId] = {};
    userVotes[roomId][userId] = true;

    // Increment the vote count
    const voteCount = side === 'for' ? votes.for++ : votes.against++;
    io.to(roomId).emit('voteUpdate', { for: votes.for, against: votes.against });
  });
});


  // Track turns in debate
  socket.on('nextTurn', (data) => {
    const nextTurn = data.turn === 'participant1' ? 'participant2' : 'participant1';
    io.to(data.roomId).emit('updateTurn', { nextTurn });
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

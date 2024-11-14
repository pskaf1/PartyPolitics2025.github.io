// models/DebateTopic.js
const mongoose = require('mongoose');

const DebateTopicSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: { type: Date, required: true },  // Scheduled date and time for the debate
  status: { type: String, default: "Open for applications" },
  attendanceCount: { type: Number, default: 0 },
  isLive: { type: Boolean, default: false },  // Indicates if the debate is currently live
  selectedParticipants: {
    pro: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    con: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  }
});

module.exports = mongoose.model('DebateTopic', DebateTopicSchema);

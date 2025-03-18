const mongoose = require('mongoose');

const DebateTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  status: { type: String, default: 'Open for applications' },
  attendanceCount: { type: Number, default: 0 },
  isLive: { type: Boolean, default: false },
  selectedParticipants: {
    pro: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    con: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
}, { timestamps: true });

module.exports = mongoose.model('DebateTopic', DebateTopicSchema);

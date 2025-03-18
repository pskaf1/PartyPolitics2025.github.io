// models/DebateRequest.js

const mongoose = require('mongoose');

const DebateRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'DebateTopic', required: true },
    side: { type: String, enum: ['for', 'against'], required: true },
    consentForRecording: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['pending', 'selected', 'not_selected'],
      default: 'pending',
    }, // Tracks request status
    requestedAt: { type: Date, default: Date.now }, // When the request was made
    reminderSent: { type: Boolean, default: false }, // Indicates if a reminder has been sent to the requester
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('DebateRequest', DebateRequestSchema);

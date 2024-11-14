// routes/debateRequest.js
const express = require('express');
const DebateRequest = require('../models/DebateRequest');
const DebateTopic = require('../models/DebateTopic');
const router = express.Router();

// Submit a debate request
router.post('/request', async (req, res) => {
  const { userId, topicId, side, consentForRecording } = req.body;

  try {
    const topic = await DebateTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: 'Debate topic not found.' });
    }

    const now = new Date();
    const debateTime = new Date(topic.date);

    // Check if the debate is within 24 hours of start time
    if (debateTime - now < 24 * 60 * 60 * 1000) { // 24 hours in milliseconds
      return res.status(400).json({ message: 'Requests to debate are closed for this topic.' });
    }

    const existingRequest = await DebateRequest.findOne({ userId, topicId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists', status: existingRequest.status });
    }

    const request = new DebateRequest({ userId, topicId, side, consentForRecording });
    await request.save();
    res.status(201).json({ message: 'Request submitted successfully', status: request.status });
  } catch (error) {
    console.error('Error submitting debate request:', error);
    res.status(500).json({ message: 'Error submitting request', error });
  }
});

module.exports = router;

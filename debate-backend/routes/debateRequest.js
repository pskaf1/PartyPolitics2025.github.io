const express = require('express');
const DebateRequest = require('../models/DebateRequest');
const DebateTopic = require('../models/DebateTopic');
const User = require('../models/User');
const { sendEmail, generateTemplate } = require('../utils/sendEmail');
const router = express.Router();

router.post('/request', async (req, res) => {
  const { userId, topicId, side, consentForRecording } = req.body;

  try {
    const topic = await DebateTopic.findById(topicId);
    if (!topic) return res.status(404).json({ message: 'Debate topic not found.' });

    const now = new Date();
    const debateTime = new Date(topic.date);
    if (debateTime - now < 24 * 60 * 60 * 1000) {
      return res.status(400).json({ message: 'Requests to debate are closed for this topic.' });
    }

    const existingRequest = await DebateRequest.findOne({ userId, topicId });
    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists.', status: existingRequest.status });
    }

    const request = new DebateRequest({ userId, topicId, side, consentForRecording, status: 'pending' });
    await request.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const emailHtml = generateTemplate('debateRequest', { firstName: user.firstName, debateTitle: topic.title });
    await sendEmail(user.email, 'Debate Request Confirmation', '', emailHtml);

    res.status(201).json({ message: 'Request submitted successfully. Confirmation email sent.', status: request.status });
  } catch (error) {
    console.error('Error submitting debate request:', error);
    res.status(500).json({ message: 'An error occurred while submitting the request.', error: error.message });
  }
});

module.exports = router;

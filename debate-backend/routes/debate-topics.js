// routes/debate-topics.js
const express = require('express');
const router = express.Router();
const DebateTopic = require('../models/DebateTopic');

// Create a new debate topic with a scheduled date and time
router.post('/create', async (req, res) => {
  const { title, description, scheduledDateTime } = req.body;

  try {
    // Validate date
    if (!scheduledDateTime || isNaN(new Date(scheduledDateTime).getTime())) {
      return res.status(400).json({ message: "Invalid scheduled date and time." });
    }

    const debateTopic = new DebateTopic({
      title,
      description,
      date: new Date(scheduledDateTime), // Make sure to use 'date' if that's the field in your schema
    });

    await debateTopic.save();
    res.status(201).json({ message: "Debate topic created successfully", debateTopic });
  } catch (error) {
    console.error("Error creating debate topic:", error);
    res.status(500).json({ message: "Error creating debate topic" });
  }
});

// Get all debate topics
router.get('/', async (req, res) => {
  try {
    const topics = await DebateTopic.find({}, 'title description date status attendanceCount');
    res.json(topics);
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: 'Error fetching topics' });
  }
});

// Attendance tracking
router.post('/:topicId/attend', async (req, res) => {
  const { topicId } = req.params;
  try {
    const topic = await DebateTopic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Debate topic not found." });
    }
    // Increment attendance count
    topic.attendanceCount = (topic.attendanceCount || 0) + 1;
    await topic.save();
    res.status(200).json({ attendanceCount: topic.attendanceCount });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Error marking attendance." });
  }
});

module.exports = router;

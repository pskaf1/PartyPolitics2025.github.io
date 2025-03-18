const express = require('express');
const router = express.Router();
const DebateTopic = require('../models/DebateTopic');

// ✅ Fetch all debate topics
router.get('/', async (req, res) => {
  try {
    const topics = await DebateTopic.find({}, 'title description date status attendanceCount isLive');
    res.json(topics);
  } catch (error) {
    console.error("❌ Error fetching topics:", error);
    res.status(500).json({ message: "Error fetching topics" });
  }
});

// ✅ Create a new debate topic (Fix for 404 Not Found)
router.post('/create', async (req, res) => {
  const { title, description, scheduledDateTime } = req.body;

  if (!title || !description || !scheduledDateTime) {
    return res.status(400).json({ message: "All fields (title, description, scheduledDateTime) are required." });
  }

  try {
    const debateTopic = new DebateTopic({
      title,
      description,
      date: new Date(scheduledDateTime),
      status: "Open for applications",
      attendanceCount: 0,
      isLive: false,
    });

    await debateTopic.save();
    res.status(201).json({ message: "Debate topic created successfully!", debateTopic });
  } catch (error) {
    console.error("❌ Error creating debate topic:", error);
    res.status(500).json({ message: "Error creating debate topic." });
  }
});

// ✅ Mark Attendance
router.post('/:topicId/attend', async (req, res) => {
  const { topicId } = req.params;
  if (!topicId || topicId.length !== 24) {
    return res.status(400).json({ message: "Invalid topic ID." });
  }

  try {
    const topic = await DebateTopic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Debate topic not found." });

    topic.attendanceCount = (topic.attendanceCount || 0) + 1;
    await topic.save();
    res.status(200).json({ attendanceCount: topic.attendanceCount });
  } catch (error) {
    console.error("❌ Error marking attendance:", error);
    res.status(500).json({ message: "Error marking attendance." });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Roadmap = require('../models/Roadmap');
const Progress = require('../models/Progress');
const Drive = require('../models/Drive');
const { chatWithAgent } = require('../services/gemini');

// POST /api/chat/:studentId — AI chat with drive awareness
router.post('/:studentId', async (req, res) => {
  try {
    const { message } = req.body;
    const { studentId } = req.params;

    const [student, roadmap, progress] = await Promise.all([
      Student.findById(studentId).select('-password'),
      Roadmap.findOne({ studentId }),
      Progress.find({ studentId }).sort({ date: -1 }),
    ]);

    if (!student) return res.status(404).json({ error: 'Student not found.' });

    // Fetch upcoming drives at student's college for context
    let drives = [];
    if (student.college) {
      const collegeRegex = new RegExp('^' + student.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
      drives = await Drive.find({ college: collegeRegex, status: { $in: ['upcoming', 'ongoing'] } }).sort({ driveDate: 1 }).limit(5);
    }

    console.log(`💬 Chat from ${student.name}: "${message}"`);
    const reply = await chatWithAgent(student, roadmap, progress, message, drives);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({ error: 'Chat failed. Try again.' });
  }
});

module.exports = router;

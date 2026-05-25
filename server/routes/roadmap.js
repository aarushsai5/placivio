const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const { generateRoadmap } = require('../services/gemini');

// POST /api/roadmap/generate — Generate AI roadmap for student
router.post('/generate', async (req, res) => {
  try {
    const { studentId } = req.body;
    if (!studentId) {
      return res.status(400).json({ error: 'studentId is required.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    console.log(`🤖 Generating roadmap for ${student.name}...`);
    const aiResponse = await generateRoadmap(student);

    // Build weeks array from AI response
    const weeks = (aiResponse.roadmap || []).map((w, i) => ({
      weekNumber: w.week || i + 1,
      topic: w.topic,
      skills: w.skills || [],
      resources: (w.resources || []).map(r => ({
        title: r.title,
        url: r.url,
        type: r.type || 'link',
      })),
      estimatedHours: w.estimatedHours || 5,
      completed: false,
    }));

    // Delete any existing roadmap for this student
    await Roadmap.deleteMany({ studentId });

    const roadmap = new Roadmap({
      studentId,
      weeks,
      totalWeeks: weeks.length,
      placementScore: aiResponse.placementScore || 0,
      scoreReason: aiResponse.scoreReason || '',
      skillGaps: aiResponse.skillGaps || [],
      immediateActions: aiResponse.immediateActions || [],
      encouragement: aiResponse.encouragement || '',
    });

    await roadmap.save();

    // Update student's placement score
    student.placementScore = aiResponse.placementScore || 0;
    await student.save();

    // Create welcome alert
    await Notification.create({
      userId: studentId,
      userType: 'student',
      title: '🚀 Roadmap Ready!',
      message: `Welcome to Placivio, ${student.name}! Your personalized ${weeks.length}-week roadmap is ready. Start with Week 1 today!`,
      type: 'reminder',
    });

    console.log(`✅ Roadmap generated: ${weeks.length} weeks for ${student.name}`);
    res.status(201).json(roadmap);
  } catch (error) {
    console.error('❌ Error generating roadmap:', error.message);
    res.status(500).json({ error: 'Failed to generate roadmap. Please try again.' });
  }
});

// GET /api/roadmap/:studentId — Get roadmap by student ID
router.get('/:studentId', async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({ studentId: req.params.studentId });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    res.json(roadmap);
  } catch (error) {
    console.error('❌ Error fetching roadmap:', error.message);
    res.status(500).json({ error: 'Failed to fetch roadmap.' });
  }
});

// POST /api/roadmap/complete-week — Mark a week as completed
router.post('/complete-week', async (req, res) => {
  try {
    const { studentId, weekNumber } = req.body;
    const roadmap = await Roadmap.findOne({ studentId });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    const week = roadmap.weeks.find(w => w.weekNumber === weekNumber);
    if (!week) {
      return res.status(404).json({ error: 'Week not found.' });
    }

    week.completed = !week.completed;
    week.completedAt = week.completed ? new Date() : null;
    await roadmap.save();

    res.json(roadmap);
  } catch (error) {
    console.error('❌ Error completing week:', error.message);
    res.status(500).json({ error: 'Failed to update week.' });
  }
});

module.exports = router;

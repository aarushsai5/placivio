const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Drive = require('../models/Drive');
const Student = require('../models/Student');
const Notification = require('../models/Notification');
const { authenticateToken, requireStudent } = require('../middleware/auth');
const { calculateMatch } = require('../services/alerts');
const { checkAndGrantAchievements } = require('../services/achievements');

// POST /api/applications — Student applies to a drive
router.post('/', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { driveId } = req.body;
    const student = await Student.findById(req.user.id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ error: 'Drive not found.' });

    // Check eligibility
    if (student.cgpa < drive.cgpaCutoff) {
      return res.status(400).json({ error: `CGPA ${student.cgpa} is below cutoff ${drive.cgpaCutoff}.` });
    }
    if (drive.branchesAllowed.length > 0 && !drive.branchesAllowed.includes(student.branch)) {
      return res.status(400).json({ error: `Your branch ${student.branch} is not eligible.` });
    }

    // Check deadline
    if (new Date() > new Date(drive.registrationDeadline)) {
      return res.status(400).json({ error: 'Registration deadline has passed.' });
    }

    // Check duplicate
    const existing = await Application.findOne({ studentId: student._id, driveId });
    if (existing) return res.status(409).json({ error: 'Already applied.' });

    const matchPct = calculateMatch(student.skills, drive.requiredSkills);

    const app = new Application({
      studentId: student._id,
      driveId,
      matchPercentage: matchPct,
      studentSnapshot: {
        skills: student.skills,
        cgpa: student.cgpa,
        branch: student.branch,
        semester: student.semester,
      },
    });
    await app.save();

    // Add to drive applicants
    if (!drive.applicants.includes(student._id)) {
      drive.applicants.push(student._id);
      await drive.save();
    }

    // Notify student
    await Notification.create({
      userId: student._id, userType: 'student',
      title: '✅ Application Submitted!',
      message: `You've applied to ${drive.companyName} (${drive.jobRole}). Match: ${matchPct}%. TPO has been notified.`,
      type: 'application', driveId: drive._id,
    });

    // Notify TPO
    await Notification.create({
      userId: drive.postedBy, userType: 'tpo',
      title: '📩 New Application',
      message: `${student.name} (${student.branch}, CGPA ${student.cgpa}) applied to ${drive.companyName}. Match: ${matchPct}%.`,
      type: 'application', driveId: drive._id,
    });

    // Trigger achievement
    await checkAndGrantAchievements(student._id, 'drive_apply');

    console.log(`📋 ${student.name} applied to ${drive.companyName} (${matchPct}% match)`);
    res.status(201).json(app);
  } catch (error) {
    console.error('❌ Apply error:', error.message);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

// GET /api/applications/student/:studentId
router.get('/student/:studentId', authenticateToken, async (req, res) => {
  try {
    const apps = await Application.find({ studentId: req.params.studentId })
      .populate('driveId', 'companyName jobRole packageLPA driveDate status requiredSkills')
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});

// GET /api/applications/drive/:driveId
router.get('/drive/:driveId', authenticateToken, async (req, res) => {
  try {
    const apps = await Application.find({ driveId: req.params.driveId })
      .populate('studentId', 'name email branch semester cgpa skills placementScore')
      .sort({ matchPercentage: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
});

// PATCH /api/applications/:id/status
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');
const Student = require('../models/Student');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const { authenticateToken, requireTpo } = require('../middleware/auth');
const { calculateMatch } = require('../services/alerts');
const { generateAIShortlist } = require('../services/gemini');

// POST /api/drives — TPO posts a new drive
router.post('/', authenticateToken, requireTpo, async (req, res) => {
  try {
    const drive = new Drive({ ...req.body, postedBy: req.user.id, college: req.user.college });
    await drive.save();

    // Auto-notify all students at this college
    const students = await Student.find({ college: { $regex: new RegExp('^' + req.user.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }, profileCompleted: true });
    const notifications = students.map(s => {
      const match = calculateMatch(s.skills, drive.requiredSkills);
      return {
        userId: s._id, userType: 'student',
        title: '🏢 New Campus Drive!',
        message: `${drive.companyName} is visiting on ${new Date(drive.driveDate).toLocaleDateString('en-IN')} for ${drive.jobRole} (${drive.packageLPA} LPA). You're ${match}% match! Register by ${new Date(drive.registrationDeadline).toLocaleDateString('en-IN')}.`,
        type: 'drive', driveId: drive._id,
      };
    });
    if (notifications.length > 0) await Notification.insertMany(notifications);

    console.log(`📋 Drive posted: ${drive.companyName} at ${drive.college} | Notified ${notifications.length} students`);
    res.status(201).json(drive);
  } catch (error) {
    console.error('❌ Post drive error:', error.message);
    res.status(500).json({ error: 'Failed to post drive.' });
  }
});

// GET /api/drives/college/:college — drives for a college (students use this)
router.get('/college/:college', async (req, res) => {
  try {
    const drives = await Drive.find({ college: { $regex: new RegExp('^' + req.params.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } }).sort({ driveDate: 1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drives.' });
  }
});

// GET /api/drives/tpo/:tpoId — drives posted by a specific TPO
router.get('/tpo/:tpoId', authenticateToken, requireTpo, async (req, res) => {
  try {
    const drives = await Drive.find({ postedBy: req.params.tpoId }).sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drives.' });
  }
});

// GET /api/drives/:driveId — drive details (with applicants for TPO)
router.get('/:driveId', authenticateToken, async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ error: 'Drive not found.' });

    let applicants = [];
    if (req.user.userType === 'tpo') {
      const apps = await Application.find({ driveId: drive._id }).populate('studentId', 'name email branch semester cgpa skills placementScore');
      applicants = apps.map(a => ({
        _id: a._id,
        studentId: a.studentId?._id,
        studentName: a.studentId?.name,
        studentEmail: a.studentId?.email,
        branch: a.studentSnapshot?.branch || a.studentId?.branch,
        semester: a.studentSnapshot?.semester || a.studentId?.semester,
        cgpa: a.studentSnapshot?.cgpa || a.studentId?.cgpa,
        skills: a.studentSnapshot?.skills || a.studentId?.skills || [],
        matchPercentage: a.matchPercentage,
        status: a.status,
        appliedAt: a.appliedAt,
        studentSnapshot: a.studentSnapshot,
      }));
    }

    res.json({ drive, applicants });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drive.' });
  }
});

// PATCH /api/drives/:driveId/status — update drive status
router.patch('/:driveId/status', authenticateToken, requireTpo, async (req, res) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.driveId, { status: req.body.status }, { new: true });
    res.json(drive);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update drive.' });
  }
});

// POST /api/drives/:driveId/ai-shortlist — AI shortlists candidates
router.post('/:driveId/ai-shortlist', authenticateToken, requireTpo, async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ error: 'Drive not found.' });

    const apps = await Application.find({ driveId: drive._id }).populate('studentId', 'name email branch semester cgpa skills');
    const applicants = apps.map(a => ({
      _id: a._id,
      studentId: a.studentId?._id,
      studentName: a.studentId?.name,
      matchPercentage: a.matchPercentage,
      studentSnapshot: a.studentSnapshot || { skills: a.studentId?.skills, cgpa: a.studentId?.cgpa, branch: a.studentId?.branch },
    }));

    console.log(`🤖 AI shortlisting ${applicants.length} applicants for ${drive.companyName}...`);
    const result = await generateAIShortlist(drive, applicants);
    res.json(result);
  } catch (error) {
    console.error('❌ AI shortlist error:', error.message);
    res.status(500).json({ error: 'AI shortlist failed. Try again.' });
  }
});

// PATCH /api/drives/:driveId/applicants/:appId — shortlist/reject
router.patch('/:driveId/applicants/:appId', authenticateToken, requireTpo, async (req, res) => {
  try {
    const { status } = req.body; // shortlisted | selected | rejected
    const app = await Application.findByIdAndUpdate(req.params.appId, { status }, { new: true });
    if (!app) return res.status(404).json({ error: 'Application not found.' });

    const drive = await Drive.findById(req.params.driveId);

    // Update drive arrays
    if (status === 'shortlisted' && !drive.shortlisted.includes(app.studentId)) {
      drive.shortlisted.push(app.studentId);
    } else if (status === 'selected' && !drive.selected.includes(app.studentId)) {
      drive.selected.push(app.studentId);
    }
    await drive.save();

    // Notify student
    const statusMsg = { shortlisted: '⭐ Shortlisted!', selected: '🚀 Selected!', rejected: '📋 Application Update' };
    const statusDetail = {
      shortlisted: `Congratulations! You've been shortlisted for ${drive.companyName} (${drive.jobRole})!`,
      selected: `🎉 Amazing! You've been SELECTED for ${drive.companyName} (${drive.jobRole}, ${drive.packageLPA} LPA)!`,
      rejected: `Your application for ${drive.companyName} was not selected this time. Keep learning and try more drives!`,
    };

    await Notification.create({
      userId: app.studentId, userType: 'student',
      title: statusMsg[status] || 'Application Update',
      message: statusDetail[status] || `Your application status changed to ${status}.`,
      type: status === 'selected' ? 'achievement' : 'shortlist',
      driveId: drive._id,
    });

    // Trigger achievements
    const { checkAndGrantAchievements } = require('../services/achievements');
    if (status === 'shortlisted') await checkAndGrantAchievements(app.studentId, 'shortlisted');
    if (status === 'selected') await checkAndGrantAchievements(app.studentId, 'selected');

    res.json(app);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update applicant.' });
  }
});

module.exports = router;

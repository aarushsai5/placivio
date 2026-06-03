const express = require('express');
const router = express.Router();
const Tpo = require('../models/Tpo');
const Student = require('../models/Student');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const Achievement = require('../models/Achievement');
const Roadmap = require('../models/Roadmap');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');
const { authenticateToken, requireTpo } = require('../middleware/auth');
const { generateBatchReport } = require('../services/gemini');
const { calculateMatch } = require('../services/alerts');

// GET /api/tpo/dashboard — aggregated TPO dashboard data
router.get('/dashboard', authenticateToken, requireTpo, async (req, res) => {
  try {
    const tpo = await Tpo.findById(req.user.id);
    if (!tpo) return res.status(404).json({ error: 'TPO not found.' });

    const college = tpo.college;
    const collegeRegex = new RegExp('^' + college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');

    const drives = await Drive.find({ college: collegeRegex }).sort({ createdAt: -1 });
    const driveIds = drives.map(d => d._id);

    const [students, collegeApps] = await Promise.all([
      Student.find({ college: collegeRegex, profileCompleted: true }).select('-password'),
      Application.find({ driveId: { $in: driveIds } }).populate('driveId', 'college'),
    ]);

    const selectedCount = collegeApps.filter(a => a.status === 'selected').length;
    const activeDrives = drives.filter(d => d.status === 'upcoming' || d.status === 'ongoing');

    // Readiness distribution
    const ready = students.filter(s => (s.placementScore || 0) >= 70).length;
    const inProgress = students.filter(s => (s.placementScore || 0) >= 40 && (s.placementScore || 0) < 70).length;
    const needsAttention = students.filter(s => (s.placementScore || 0) < 40).length;
    const avgScore = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.placementScore || 0), 0) / students.length) : 0;

    // Top 10 leaderboard
    const leaderboard = [...students].sort((a, b) => (b.placementScore || 0) - (a.placementScore || 0)).slice(0, 10).map(s => ({
      _id: s._id, name: s.name, branch: s.branch, cgpa: s.cgpa, score: s.placementScore || 0,
    }));

    // At-risk: no recent activity
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const atRisk = students.filter(s => !s.updatedAt || new Date(s.updatedAt) < sevenDaysAgo).slice(0, 10).map(s => ({
      _id: s._id, name: s.name, branch: s.branch, score: s.placementScore || 0,
      lastActive: s.updatedAt,
    }));

    // Skill heatmap
    const skillFreq = {};
    students.forEach(s => (s.skills || []).forEach(sk => { skillFreq[sk] = (skillFreq[sk] || 0) + 1; }));
    const skillHeatmap = Object.entries(skillFreq).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([skill, count]) => ({ skill, count }));

    // Recent applications
    const recentApps = collegeApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 10);

    res.json({
      tpo: { name: tpo.name, college: tpo.college },
      stats: { totalStudents: students.length, activeDrives: activeDrives.length, studentsPlaced: selectedCount, avgScore },
      readiness: { ready, inProgress, needsAttention },
      leaderboard,
      atRisk,
      skillHeatmap,
      drives: drives.slice(0, 10),
      recentApps,
    });
  } catch (error) {
    console.error('❌ TPO dashboard error:', error.message);
    res.status(500).json({ error: 'Failed to load dashboard.' });
  }
});

// GET /api/tpo/students — all students at college
router.get('/students', authenticateToken, requireTpo, async (req, res) => {
  try {
    const tpo = await Tpo.findById(req.user.id);
    const collegeRegex = new RegExp('^' + tpo.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    const students = await Student.find({ college: collegeRegex, profileCompleted: true }).select('-password').sort({ placementScore: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
});

// GET /api/tpo/students/:studentId/profile — detailed student view
router.get('/students/:studentId/profile', authenticateToken, requireTpo, async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const [roadmap, progress, apps, achievements] = await Promise.all([
      Roadmap.findOne({ studentId: student._id }),
      Progress.find({ studentId: student._id }).sort({ date: -1 }),
      Application.find({ studentId: student._id }).populate('driveId', 'companyName jobRole packageLPA status'),
      Achievement.find({ studentId: student._id }),
    ]);

    res.json({ student, roadmap, progress, applications: apps, achievements });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student profile.' });
  }
});

// POST /api/tpo/batch-report — AI batch report
router.post('/batch-report', authenticateToken, requireTpo, async (req, res) => {
  try {
    const tpo = await Tpo.findById(req.user.id);
    const collegeRegex = new RegExp('^' + tpo.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    const [students, drives] = await Promise.all([
      Student.find({ college: collegeRegex, profileCompleted: true }).select('-password'),
      Drive.find({ college: collegeRegex, status: { $in: ['upcoming', 'ongoing'] } }),
    ]);

    console.log(`📊 Generating batch report for ${tpo.college} (${students.length} students)...`);
    const report = await generateBatchReport(students, drives);
    res.json(report);
  } catch (error) {
    console.error('❌ Batch report error:', error.message);
    res.status(500).json({ error: 'Failed to generate report.' });
  }
});

// POST /api/tpo/run-recommendations — simulate nightly drive recommendation
router.post('/run-recommendations', authenticateToken, requireTpo, async (req, res) => {
  try {
    const tpo = await Tpo.findById(req.user.id);
    const collegeRegex = new RegExp('^' + tpo.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');

    const [students, drives] = await Promise.all([
      Student.find({ college: collegeRegex, profileCompleted: true }),
      Drive.find({ college: collegeRegex, status: { $in: ['upcoming', 'ongoing'] } }),
    ]);

    const studentIds = students.map(s => s._id);
    const driveIds = drives.map(d => d._id);
    
    const [allApps, allNotifs] = await Promise.all([
      Application.find({ studentId: { $in: studentIds }, driveId: { $in: driveIds } }),
      Notification.find({ userId: { $in: studentIds }, driveId: { $in: driveIds }, type: { $in: ['drive', 'reminder'] } })
    ]);

    const appSet = new Set(allApps.map(a => `${a.studentId}_${a.driveId}`));
    const now = Date.now();
    const driveNotifMap = new Map();
    const reminderNotifMap = new Map();
    
    for (const n of allNotifs) {
      const key = `${n.userId}_${n.driveId}`;
      const age = now - new Date(n.createdAt).getTime();
      if (n.type === 'drive' && age < 3 * 86400000) driveNotifMap.set(key, true);
      if (n.type === 'reminder' && age < 2 * 86400000) reminderNotifMap.set(key, true);
    }

    let notifCount = 0;
    const newNotifications = [];

    for (const student of students) {
      for (const drive of drives) {
        const match = calculateMatch(student.skills, drive.requiredSkills);
        const daysToDeadline = Math.ceil((new Date(drive.registrationDeadline) - new Date()) / 86400000);

        const key = `${student._id}_${drive._id}`;
        if (appSet.has(key)) continue;

        if (match >= 75) {
          if (!driveNotifMap.has(key)) {
            newNotifications.push({
              userId: student._id, userType: 'student',
              title: '🎯 Great Match!',
              message: `You're ${match}% match for ${drive.companyName} (${drive.jobRole}). Apply before ${new Date(drive.registrationDeadline).toLocaleDateString('en-IN')}!`,
              type: 'drive', driveId: drive._id,
            });
            driveNotifMap.set(key, true);
            notifCount++;
          }
        } else if (match >= 60 && daysToDeadline > 0 && daysToDeadline <= 5) {
          if (!reminderNotifMap.has(key)) {
            newNotifications.push({
              userId: student._id, userType: 'student',
              title: '⏰ Deadline Approaching!',
              message: `${drive.companyName} deadline in ${daysToDeadline} days. You're ${match}% match — apply now!`,
              type: 'reminder', driveId: drive._id,
            });
            reminderNotifMap.set(key, true);
            notifCount++;
          }
        }
      }
    }

    if (newNotifications.length > 0) {
      await Notification.insertMany(newNotifications);
    }

    console.log(`🔔 Drive recommendations: sent ${notifCount} notifications`);
    res.json({ sent: notifCount, students: students.length, drives: drives.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run recommendations.' });
  }
});

module.exports = router;

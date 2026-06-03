const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Roadmap = require('../models/Roadmap');
const Progress = require('../models/Progress');
const Notification = require('../models/Notification');
const Company = require('../models/Company');
const Drive = require('../models/Drive');
const Achievement = require('../models/Achievement');
const { calculateMatch, generateSmartAlerts } = require('../services/alerts');
const { ACHIEVEMENT_DEFS } = require('../services/achievements');

// GET /api/dashboard/:studentId — Full dashboard with drives, achievements
router.get('/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    generateSmartAlerts(studentId).catch(e => console.error('Smart alerts error:', e.message));

    const [student, roadmap, progress, notifications, companies, achievements] = await Promise.all([
      Student.findById(studentId).select('-password'),
      Roadmap.findOne({ studentId }),
      Progress.find({ studentId }).sort({ date: -1 }),
      Notification.find({ userId: studentId }).sort({ createdAt: -1 }).limit(15),
      Company.find({}),
      Achievement.find({ studentId }),
    ]);

    if (!student) return res.status(404).json({ error: 'Student not found.' });

    // Company matches
    const companyMatches = companies.map(company => {
      const matchPercent = calculateMatch(student.skills, company.requiredSkills);
      const norm = student.skills.map(s => s.toLowerCase().trim());
      const missingSkills = (company.requiredSkills || []).filter(cs =>
        !norm.some(ss => ss === cs.toLowerCase().trim() || ss.includes(cs.toLowerCase().trim()) || cs.toLowerCase().trim().includes(ss))
      );
      return { name: company.name, type: company.type, matchPercent, boostSkill: missingSkills[0] || null, cgpaEligible: student.cgpa >= company.cgpaCutoff };
    }).sort((a, b) => b.matchPercent - a.matchPercent);

    // Upcoming drives at student's college
    let upcomingDrives = [];
    if (student.college) {
      const collegeRegex = new RegExp('^' + student.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
      const drives = await Drive.find({ college: collegeRegex, status: { $in: ['upcoming', 'ongoing'] } }).sort({ driveDate: 1 }).limit(5);
      upcomingDrives = drives.map(d => ({
        _id: d._id, companyName: d.companyName, jobRole: d.jobRole, packageLPA: d.packageLPA,
        driveDate: d.driveDate, registrationDeadline: d.registrationDeadline,
        matchPercent: calculateMatch(student.skills, d.requiredSkills),
        status: d.status, requiredSkills: d.requiredSkills,
      }));
    }

    // Achievement badges
    const earnedTypes = new Set(achievements.map(a => a.type));
    const allAchievements = Object.entries(ACHIEVEMENT_DEFS).map(([type, def]) => ({
      type, title: def.title, description: def.description,
      earned: earnedTypes.has(type),
      earnedAt: achievements.find(a => a.type === type)?.earnedAt || null,
    }));

    const unreadAlertCount = notifications.filter(a => !a.isRead).length;

    res.json({
      student,
      roadmap,
      progress,
      alerts: notifications,
      unreadAlertCount,
      topCompanies: companyMatches.slice(0, 3),
      allCompanyMatches: companyMatches,
      upcomingDrives,
      achievements: allAchievements,
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error.message);
    res.status(500).json({ error: 'Failed to load dashboard.' });
  }
});

module.exports = router;

const Notification = require('../models/Notification');
const Student = require('../models/Student');
const Roadmap = require('../models/Roadmap');
const Progress = require('../models/Progress');
const Company = require('../models/Company');
const Drive = require('../models/Drive');

function calculateMatch(studentSkills, requiredSkills) {
  if (!requiredSkills || requiredSkills.length === 0) return 100;
  const norm = studentSkills.map(s => s.toLowerCase().trim());
  const matched = requiredSkills.filter(cs =>
    norm.some(ss => ss === cs.toLowerCase().trim())
  );
  return Math.round((matched.length / requiredSkills.length) * 100);
}

function getMostImpactfulSkill(studentSkills, companies) {
  const norm = studentSkills.map(s => s.toLowerCase().trim());
  const freq = {};
  for (const c of companies) {
    const missing = (c.requiredSkills || []).filter(cs =>
      !norm.some(ss => ss === cs.toLowerCase().trim())
    );
    for (const s of missing) freq[s] = (freq[s] || 0) + 1;
  }
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : null;
}

async function generateSmartAlerts(studentId) {
  try {
    const [student, roadmap, progress, companies, drives] = await Promise.all([
      Student.findById(studentId),
      Roadmap.findOne({ studentId }),
      Progress.find({ studentId }).sort({ date: -1 }),
      Company.find({}),
      Drive.find({ status: { $in: ['upcoming', 'ongoing'] } }),
    ]);
    if (!student) return;

    const newAlerts = [];
    const collegeDrives = drives.filter(d => d.college?.toLowerCase() === student.college?.toLowerCase());

    const recentNotifs = await Notification.find({
      userId: studentId,
      createdAt: { $gte: new Date(Date.now() - 7 * 86400000) }
    });

    // Company match crosses 75%
    for (const company of companies) {
      const match = calculateMatch(student.skills, company.requiredSkills);
      if (match >= 80) {
        const exists = recentNotifs.some(n => n.message && n.message.includes(`ready for ${company.name}`));
        if (!exists) {
          newAlerts.push({
            userId: studentId, userType: 'student', title: '🎯 Company Match!',
            message: `You're ${match}% ready for ${company.name}! Keep pushing.`, type: 'alert',
          });
        }
      }
    }

    // Drive deadline approaching
    const twoDaysAgo = Date.now() - 2 * 86400000;
    for (const drive of collegeDrives) {
      const daysToDeadline = Math.ceil((new Date(drive.registrationDeadline) - new Date()) / 86400000);
      if (daysToDeadline > 0 && daysToDeadline <= 3) {
        const match = calculateMatch(student.skills, drive.requiredSkills);
        if (match >= 50) {
          const exists = recentNotifs.some(n => n.driveId && n.driveId.toString() === drive._id.toString() && n.type === 'reminder' && new Date(n.createdAt).getTime() >= twoDaysAgo);
          if (!exists) {
            newAlerts.push({
              userId: studentId, userType: 'student', title: '📅 Deadline Approaching!',
              message: `${drive.companyName} drive deadline is in ${daysToDeadline} day(s). You're ${match}% match. Apply now!`,
              type: 'reminder', driveId: drive._id,
            });
          }
        }
      }
    }

    // No check-in for 5+ days
    if (progress.length > 0) {
      const daysSince = Math.floor((Date.now() - new Date(progress[0].date).getTime()) / 86400000);
      if (daysSince >= 5) {
        const threeDaysAgo = Date.now() - 3 * 86400000;
        const exists = recentNotifs.some(n => n.type === 'reminder' && n.message && n.message.includes('falling behind') && new Date(n.createdAt).getTime() >= threeDaysAgo);
        if (!exists) {
          newAlerts.push({
            userId: studentId, userType: 'student', title: '⚠️ Stay on Track!',
            message: `It's been ${daysSince} days since your last check-in. You're falling behind on your roadmap!`,
            type: 'reminder',
          });
        }
      }
    }

    if (newAlerts.length > 0) {
      await Notification.insertMany(newAlerts);
      console.log(`🔔 Generated ${newAlerts.length} alerts for ${student.name}`);
    }
    return newAlerts;
  } catch (error) {
    console.error('❌ Smart alerts error:', error.message);
  }
}

async function generateWeekCompleteAlert(studentId, weekNumber) {
  try {
    const roadmap = await Roadmap.findOne({ studentId });
    if (!roadmap) return;
    const done = roadmap.weeks.filter(w => w.completed).length;
    const next = roadmap.weeks.find(w => !w.completed);
    await Notification.create({
      userId: studentId, userType: 'student', title: '🎉 Week Complete!',
      message: `Great job completing Week ${weekNumber}! (${done}/${roadmap.totalWeeks})${next ? ` Next: ${next.topic}` : ' — You finished your roadmap!'}`,
      type: 'achievement',
    });
  } catch (error) {
    console.error('❌ Week alert error:', error.message);
  }
}

module.exports = { calculateMatch, getMostImpactfulSkill, generateSmartAlerts, generateWeekCompleteAlert };

const { connectDB } = require('../../lib/mongodb');
const Tpo = require('../../lib/models/Tpo');
const Student = require('../../lib/models/Student');
const Drive = require('../../lib/models/Drive');
const Application = require('../../lib/models/Application');
const Notification = require('../../lib/models/Notification');
const { requireTpo } = require('../../lib/auth');
const { calculateMatch } = require('../../server/services/alerts');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = requireTpo(req, res);
    if (!user) return;

    const tpo = await Tpo.findById(user.id);
    const collegeRegex = new RegExp('^' + tpo.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');

    const [students, drives] = await Promise.all([
      Student.find({ college: collegeRegex, profileCompleted: true }),
      Drive.find({ college: collegeRegex, status: { $in: ['upcoming', 'ongoing'] } }),
    ]);

    let notifCount = 0;
    for (const student of students) {
      for (const drive of drives) {
        const match = calculateMatch(student.skills, drive.requiredSkills);
        const daysToDeadline = Math.ceil((new Date(drive.registrationDeadline) - new Date()) / 86400000);

        // Already applied?
        const applied = await Application.findOne({ studentId: student._id, driveId: drive._id });
        if (applied) continue;

        if (match >= 75) {
          const exists = await Notification.findOne({ userId: student._id, driveId: drive._id, type: 'drive', createdAt: { $gte: new Date(Date.now() - 3 * 86400000) } });
          if (!exists) {
            await Notification.create({
              userId: student._id, userType: 'student',
              title: '🎯 Great Match!',
              message: `You're ${match}% match for ${drive.companyName} (${drive.jobRole}). Apply before ${new Date(drive.registrationDeadline).toLocaleDateString('en-IN')}!`,
              type: 'drive', driveId: drive._id,
            });
            notifCount++;
          }
        } else if (match >= 60 && daysToDeadline > 0 && daysToDeadline <= 5) {
          const exists = await Notification.findOne({ userId: student._id, driveId: drive._id, type: 'reminder', createdAt: { $gte: new Date(Date.now() - 2 * 86400000) } });
          if (!exists) {
            await Notification.create({
              userId: student._id, userType: 'student',
              title: '⏰ Deadline Approaching!',
              message: `${drive.companyName} deadline in ${daysToDeadline} days. You're ${match}% match — apply now!`,
              type: 'reminder', driveId: drive._id,
            });
            notifCount++;
          }
        }
      }
    }

    console.log(`🔔 Drive recommendations: sent ${notifCount} notifications`);
    res.json({ sent: notifCount, students: students.length, drives: drives.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to run recommendations.' });
  }
};

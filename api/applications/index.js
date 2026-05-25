const { connectDB } = require('../../lib/mongodb');
const Application = require('../../lib/models/Application');
const Drive = require('../../lib/models/Drive');
const Student = require('../../lib/models/Student');
const Notification = require('../../lib/models/Notification');
const { requireStudent } = require('../../lib/auth');
const { calculateMatch } = require('../../lib/alerts');
const { checkAndGrantAchievements } = require('../../lib/achievements');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    await connectDB();
    
    const user = requireStudent(req, res);
    if (!user) return;

    const { driveId } = req.body;
    const student = await Student.findById(user.id);
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ error: 'Drive not found.' });

    // Check eligibility
    if (student.cgpa < drive.cgpaCutoff) {
      return res.status(400).json({ error: `CGPA ${student.cgpa} is below cutoff ${drive.cgpaCutoff}.` });
    }
    if (drive.branchesAllowed && drive.branchesAllowed.length > 0 && !drive.branchesAllowed.includes(student.branch)) {
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
};

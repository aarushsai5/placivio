const { connectDB } = require('../../lib/mongodb');
const Drive = require('../../lib/models/Drive');
const Student = require('../../lib/models/Student');
const Notification = require('../../lib/models/Notification');
const { verifyAuth } = require('../../lib/auth');
const { calculateMatch } = require('../../lib/alerts');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.userType !== 'tpo') return res.status(403).json({ error: 'Forbidden' });

    const drive = new Drive({ ...req.body, postedBy: user.id, college: user.college });
    await drive.save();

    // Auto-notify all students at this college
    const students = await Student.find({ 
      college: { $regex: new RegExp('^' + user.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }, 
      profileCompleted: true 
    });
    
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
};

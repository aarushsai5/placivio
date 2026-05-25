const { connectDB } = require('../../../../lib/mongodb');
const Drive = require('../../../../lib/models/Drive');
const Application = require('../../../../lib/models/Application');
const Notification = require('../../../../lib/models/Notification');
const { verifyAuth } = require('../../../../lib/auth');
const { checkAndGrantAchievements } = require('../../../../lib/achievements');

module.exports = async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.userType !== 'tpo') return res.status(403).json({ error: 'Forbidden' });

    const { driveId, appId } = req.query;
    const { status } = req.body; // shortlisted | selected | rejected
    
    const app = await Application.findByIdAndUpdate(appId, { status }, { new: true });
    if (!app) return res.status(404).json({ error: 'Application not found.' });

    const drive = await Drive.findById(driveId);

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
    if (status === 'shortlisted') await checkAndGrantAchievements(app.studentId, 'shortlisted');
    if (status === 'selected') await checkAndGrantAchievements(app.studentId, 'selected');

    res.json(app);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update applicant.' });
  }
};

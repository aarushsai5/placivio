const { connectDB } = require('../../../lib/mongodb');
const Drive = require('../../../lib/models/Drive');
const Application = require('../../../lib/models/Application');
const { verifyAuth } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { driveId } = req.query;
    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ error: 'Drive not found.' });

    let applicants = [];
    if (user.userType === 'tpo') {
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
};

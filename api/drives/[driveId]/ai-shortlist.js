const { connectDB } = require('../../../lib/mongodb');
const Drive = require('../../../lib/models/Drive');
const Application = require('../../../lib/models/Application');
const { verifyAuth } = require('../../../lib/auth');
const { generateAIShortlist } = require('../../../lib/gemini');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.userType !== 'tpo') return res.status(403).json({ error: 'Forbidden' });

    const { driveId } = req.query;
    const drive = await Drive.findById(driveId);
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
};

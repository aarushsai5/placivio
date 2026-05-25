const { connectDB } = require('../../../lib/mongodb');
const Application = require('../../../lib/models/Application');
const { verifyAuth } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    await connectDB();
    
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { studentId } = req.query;

    const apps = await Application.find({ studentId })
      .populate('driveId', 'companyName jobRole packageLPA driveDate status requiredSkills')
      .sort({ appliedAt: -1 });
      
    res.json(apps);
  } catch (error) {
    console.error('❌ Fetch applications error:', error.message);
    res.status(500).json({ error: 'Failed to fetch applications.' });
  }
};

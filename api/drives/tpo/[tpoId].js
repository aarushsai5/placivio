const { connectDB } = require('../../../lib/mongodb');
const Drive = require('../../../lib/models/Drive');
const { verifyAuth } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.userType !== 'tpo') return res.status(403).json({ error: 'Forbidden' });

    const { tpoId } = req.query;
    const drives = await Drive.find({ postedBy: tpoId }).sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drives.' });
  }
};

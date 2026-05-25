const { connectDB } = require('../../../lib/mongodb');
const Drive = require('../../../lib/models/Drive');
const { verifyAuth } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (user.userType !== 'tpo') return res.status(403).json({ error: 'Forbidden' });

    const { driveId } = req.query;
    const drive = await Drive.findByIdAndUpdate(driveId, { status: req.body.status }, { new: true });
    res.json(drive);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update drive.' });
  }
};

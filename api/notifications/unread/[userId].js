const { connectDB } = require('../../../lib/mongodb');
const Notification = require('../../../lib/models/Notification');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const { userId } = req.query;
    const count = await Notification.countDocuments({ userId, isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count notifications.' });
  }
};

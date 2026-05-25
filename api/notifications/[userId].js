const { connectDB } = require('../../lib/mongodb');
const Notification = require('../../lib/models/Notification');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const { userId } = req.query;
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
};

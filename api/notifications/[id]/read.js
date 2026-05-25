const { connectDB } = require('../../../lib/mongodb');
const Notification = require('../../../lib/models/Notification');

module.exports = async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const { id } = req.query;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
};

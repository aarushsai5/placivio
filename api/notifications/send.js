const { connectDB } = require('../../lib/mongodb');
const Notification = require('../../lib/models/Notification');
const { verifyAuth } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { userIds, title, message, type } = req.body;
    const notifs = userIds.map(uid => ({
      userId: uid, userType: 'student', title, message, type: type || 'alert',
    }));
    await Notification.insertMany(notifs);
    res.json({ sent: notifs.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notifications.' });
  }
};

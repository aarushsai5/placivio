const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticateToken } = require('../middleware/auth');

// GET /api/notifications/:userId
router.get('/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// GET /api/notifications/unread/:userId
router.get('/unread/:userId', async (req, res) => {
  try {
    const count = await Notification.countDocuments({ userId: req.params.userId, isRead: false });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to count notifications.' });
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
});

// PATCH /api/notifications/read-all/:userId
router.patch('/read-all/:userId', async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId, isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notifications.' });
  }
});

// POST /api/notifications/send — TPO sends notification to students
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const { userIds, title, message, type } = req.body;
    const notifs = userIds.map(uid => ({
      userId: uid, userType: 'student', title, message, type: type || 'alert',
    }));
    await Notification.insertMany(notifs);
    res.json({ sent: notifs.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send notifications.' });
  }
});

module.exports = router;

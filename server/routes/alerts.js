const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// GET /api/alerts/:studentId — Get alerts for student
router.get('/:studentId', async (req, res) => {
  try {
    const alerts = await Alert.find({ studentId: req.params.studentId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts.' });
  }
});

// GET /api/alerts/unread/:studentId — Get unread count
router.get('/unread/:studentId', async (req, res) => {
  try {
    const count = await Alert.countDocuments({
      studentId: req.params.studentId,
      isRead: false,
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch unread count.' });
  }
});

// PATCH /api/alerts/:id/read — Mark alert as read
router.patch('/:id/read', async (req, res) => {
  try {
    await Alert.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark alert as read.' });
  }
});

// PATCH /api/alerts/read-all/:studentId — Mark all as read
router.patch('/read-all/:studentId', async (req, res) => {
  try {
    await Alert.updateMany(
      { studentId: req.params.studentId, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark alerts as read.' });
  }
});

module.exports = router;

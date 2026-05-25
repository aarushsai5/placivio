const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const { ACHIEVEMENT_DEFS } = require('../services/achievements');

// GET /api/achievements/:studentId — get all achievements (earned + available)
router.get('/:studentId', async (req, res) => {
  try {
    const earned = await Achievement.find({ studentId: req.params.studentId });
    const earnedTypes = new Set(earned.map(a => a.type));

    const all = Object.entries(ACHIEVEMENT_DEFS).map(([type, def]) => ({
      type,
      title: def.title,
      description: def.description,
      earned: earnedTypes.has(type),
      earnedAt: earned.find(a => a.type === type)?.earnedAt || null,
    }));

    res.json(all);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements.' });
  }
});

module.exports = router;

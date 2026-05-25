const { connectDB } = require('../../lib/mongodb');
const Roadmap = require('../../lib/models/Roadmap');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await connectDB();

    const { studentId, weekNumber } = req.body;
    const roadmap = await Roadmap.findOne({ studentId });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    const week = roadmap.weeks.find(w => w.weekNumber === weekNumber);
    if (!week) {
      return res.status(404).json({ error: 'Week not found.' });
    }

    week.completed = !week.completed;
    week.completedAt = week.completed ? new Date() : null;
    await roadmap.save();

    res.json(roadmap);
  } catch (error) {
    console.error('❌ Error completing week:', error.message);
    res.status(500).json({ error: 'Failed to update week.' });
  }
};

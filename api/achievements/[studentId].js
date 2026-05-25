const { connectDB } = require('../../lib/mongodb');
const Achievement = require('../../lib/models/Achievement');
const { ACHIEVEMENT_DEFS } = require('../../lib/achievements');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  try {
    await connectDB();
    
    const { studentId } = req.query;

    const earned = await Achievement.find({ studentId });
    const earnedTypes = new Set(earned.map(a => a.type));

    const all = Object.entries(ACHIEVEMENT_DEFS).map(([type, def]) => ({
      type,
      title: def.title,
      description: def.description,
      earned: earnedTypes.has(type),
      earnedAt: earned.find(a => a.type === type)?.earnedAt || null,
    }));

    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch achievements.' });
  }
};

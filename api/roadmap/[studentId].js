const { connectDB } = require('../../lib/mongodb');
const Roadmap = require('../../lib/models/Roadmap');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    await connectDB();
    
    const { studentId } = req.query;

    const roadmap = await Roadmap.findOne({ studentId });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }
    res.json(roadmap);
  } catch (error) {
    console.error('❌ Error fetching roadmap:', error.message);
    res.status(500).json({ error: 'Failed to fetch roadmap.' });
  }
};

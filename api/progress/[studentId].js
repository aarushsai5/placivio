const { connectDB } = require('../../lib/mongodb');
const Progress = require('../../lib/models/Progress');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    
    const { studentId } = req.query;

    const progress = await Progress.find({ studentId }).sort({ date: -1 });
    res.status(200).json(progress);
  } catch (error) {
    console.error('❌ Error fetching progress:', error.message);
    res.status(500).json({ error: 'Failed to fetch progress.' });
  }
};

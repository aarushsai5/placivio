const { connectDB } = require('../../../lib/mongodb');
const Drive = require('../../../lib/models/Drive');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const { college } = req.query;
    
    const drives = await Drive.find({ 
      college: { $regex: new RegExp('^' + college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') } 
    }).sort({ driveDate: 1 });
    
    res.json(drives);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch drives.' });
  }
};

const { connectDB } = require('../../lib/mongodb');
const Company = require('../../lib/models/Company');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    console.error('❌ Error fetching companies:', error.message);
    res.status(500).json({ error: 'Failed to load companies.' });
  }
};

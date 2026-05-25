const { connectDB } = require('../../lib/mongodb');
const Student = require('../../lib/models/Student');
const { verifyAuth } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    
    const { id } = req.query;

    const student = await Student.findById(id).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student.' });
  }
};

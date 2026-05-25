const { connectDB } = require('../../lib/mongodb');
const Tpo = require('../../lib/models/Tpo');
const Student = require('../../lib/models/Student');
const { requireTpo } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = requireTpo(req, res);
    if (!user) return;

    const tpo = await Tpo.findById(user.id);
    const collegeRegex = new RegExp('^' + tpo.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    const students = await Student.find({ college: collegeRegex, profileCompleted: true }).select('-password').sort({ placementScore: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students.' });
  }
};

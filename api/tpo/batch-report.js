const { connectDB } = require('../../lib/mongodb');
const Tpo = require('../../lib/models/Tpo');
const Student = require('../../lib/models/Student');
const Drive = require('../../lib/models/Drive');
const { requireTpo } = require('../../lib/auth');
const { generateBatchReport } = require('../../lib/gemini');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = requireTpo(req, res);
    if (!user) return;

    const tpo = await Tpo.findById(user.id);
    const collegeRegex = new RegExp('^' + tpo.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
    const [students, drives] = await Promise.all([
      Student.find({ college: collegeRegex, profileCompleted: true }).select('-password'),
      Drive.find({ college: collegeRegex, status: { $in: ['upcoming', 'ongoing'] } }),
    ]);

    console.log(`📊 Generating batch report for ${tpo.college} (${students.length} students)...`);
    const report = await generateBatchReport(students, drives);
    res.json(report);
  } catch (error) {
    console.error('❌ Batch report error:', error.message);
    res.status(500).json({ error: 'Failed to generate report.' });
  }
};

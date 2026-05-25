const { connectDB } = require('../../../../lib/mongodb');
const Student = require('../../../../lib/models/Student');
const Roadmap = require('../../../../lib/models/Roadmap');
const Progress = require('../../../../lib/models/Progress');
const Application = require('../../../../lib/models/Application');
const Achievement = require('../../../../lib/models/Achievement');
const { requireTpo } = require('../../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = requireTpo(req, res);
    if (!user) return;

    const { studentId } = req.query;
    const student = await Student.findById(studentId).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found.' });

    const [roadmap, progress, apps, achievements] = await Promise.all([
      Roadmap.findOne({ studentId: student._id }),
      Progress.find({ studentId: student._id }).sort({ date: -1 }),
      Application.find({ studentId: student._id }).populate('driveId', 'companyName jobRole packageLPA status'),
      Achievement.find({ studentId: student._id }),
    ]);

    res.json({ student, roadmap, progress, applications: apps, achievements });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student profile.' });
  }
};

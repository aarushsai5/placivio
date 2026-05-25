const { connectDB } = require('../../lib/mongodb');
const Student = require('../../lib/models/Student');
const Roadmap = require('../../lib/models/Roadmap');
const Progress = require('../../lib/models/Progress');
const Drive = require('../../lib/models/Drive');
const { chatWithAgent } = require('../../lib/gemini');
const { verifyAuth } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    await connectDB();
    
    // Auth is optional for this based on original code, but we can verify it if needed.
    // const user = verifyAuth(req);
    // if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { message } = req.body;
    const { studentId } = req.query;

    const [student, roadmap, progress] = await Promise.all([
      Student.findById(studentId).select('-password'),
      Roadmap.findOne({ studentId }),
      Progress.find({ studentId }).sort({ date: -1 }),
    ]);

    if (!student) return res.status(404).json({ error: 'Student not found.' });

    // Fetch upcoming drives at student's college for context
    let drives = [];
    if (student.college) {
      const collegeRegex = new RegExp('^' + student.college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
      drives = await Drive.find({ college: collegeRegex, status: { $in: ['upcoming', 'ongoing'] } }).sort({ driveDate: 1 }).limit(5);
    }

    console.log(`💬 Chat from ${student.name}: "${message}"`);
    const reply = await chatWithAgent(student, roadmap, progress, message, drives);
    res.json({ reply });
  } catch (error) {
    console.error('❌ Chat error:', error.message);
    res.status(500).json({ error: 'Chat failed. Try again.' });
  }
};

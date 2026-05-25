const { connectDB } = require('../../lib/mongodb');
const Student = require('../../lib/models/Student');
const { verifyAuth } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    
    const { studentId, college, branch, semester, cgpa, skills, targetCompanies, targetCompanyType, timeline } = req.body;

    if (studentId) {
      // Update existing student (profile completion after auth)
      const student = await Student.findByIdAndUpdate(studentId, {
        college, branch, semester, cgpa, skills, targetCompanies, targetCompanyType, timeline, profileCompleted: true,
      }, { new: true }).select('-password');

      if (!student) return res.status(404).json({ error: 'Student not found.' });
      console.log(`✅ Profile updated: ${student.name} (${student._id})`);
      return res.json(student);
    }

    // Legacy: create new (shouldn't happen with auth flow but kept for compatibility)
    const { name, email, password } = req.body;
    const student = new Student({ name, email, password, college, branch, semester, cgpa, skills, targetCompanies, targetCompanyType, timeline, profileCompleted: true });
    await student.save();
    console.log(`✅ Student created: ${student.name} (${student._id})`);
    res.status(201).json(student);
  } catch (error) {
    console.error('❌ Student error:', error.message);
    res.status(500).json({ error: 'Failed to save student profile.' });
  }
};

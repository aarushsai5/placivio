const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// POST /api/students — Create or update student profile (used by Setup page after auth)
router.post('/', async (req, res) => {
  try {
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
});

// GET /api/students/:id
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ error: 'Student not found.' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student.' });
  }
});

module.exports = router;

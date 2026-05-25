const { connectDB } = require('../../../lib/mongodb');
const Student = require('../../../lib/models/Student');
const { generateToken } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    await connectDB();
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const existing = await Student.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const student = new Student({ name, email: email.toLowerCase(), password });
    await student.save();

    const token = generateToken(student, 'student');
    console.log(`✅ Student registered: ${name} (${student._id})`);

    res.status(201).json({
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        userType: 'student',
        profileCompleted: student.profileCompleted,
      },
    });
  } catch (error) {
    console.error('❌ Student register error:', error.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

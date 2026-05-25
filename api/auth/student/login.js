const { connectDB } = require('../../../lib/mongodb');
const Student = require('../../../lib/models/Student');
const { generateToken } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(student, 'student');
    console.log(`✅ Student logged in: ${student.name}`);

    res.json({
      token,
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        college: student.college,
        userType: 'student',
        profileCompleted: student.profileCompleted,
      },
    });
  } catch (error) {
    console.error('❌ Student login error:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

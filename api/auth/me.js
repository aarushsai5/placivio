const { connectDB } = require('../../lib/mongodb');
const Student = require('../../lib/models/Student');
const Tpo = require('../../lib/models/Tpo');
const { verifyAuth } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    if (user.userType === 'student') {
      const student = await Student.findById(user.id).select('-password');
      if (!student) return res.status(404).json({ error: 'User not found.' });
      res.json({ ...student.toObject(), userType: 'student' });
    } else if (user.userType === 'tpo') {
      const tpo = await Tpo.findById(user.id).select('-password');
      if (!tpo) return res.status(404).json({ error: 'User not found.' });
      res.json({ ...tpo.toObject(), userType: 'tpo' });
    } else {
      res.status(400).json({ error: 'Unknown user type.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
};

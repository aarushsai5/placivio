const { connectDB } = require('../../../lib/mongodb');
const Tpo = require('../../../lib/models/Tpo');
const { generateToken } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const { name, email, password, college, designation } = req.body;
    if (!name || !email || !password || !college) {
      return res.status(400).json({ error: 'Name, email, password, and college are required.' });
    }

    const existing = await Tpo.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const tpo = new Tpo({ name, email: email.toLowerCase(), password, college, designation });
    await tpo.save();

    const token = generateToken(tpo, 'tpo');
    console.log(`✅ TPO registered: ${name} at ${college}`);

    res.status(201).json({
      token,
      user: {
        id: tpo._id,
        name: tpo.name,
        email: tpo.email,
        college: tpo.college,
        designation: tpo.designation,
        userType: 'tpo',
      },
    });
  } catch (error) {
    console.error('❌ TPO register error:', error.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

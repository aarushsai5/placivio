const { connectDB } = require('../../../lib/mongodb');
const Tpo = require('../../../lib/models/Tpo');
const { generateToken } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const tpo = await Tpo.findOne({ email: email.toLowerCase() });
    if (!tpo) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await tpo.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken(tpo, 'tpo');
    console.log(`✅ TPO logged in: ${tpo.name}`);

    res.json({
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
    console.error('❌ TPO login error:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

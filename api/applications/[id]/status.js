const { connectDB } = require('../../../lib/mongodb');
const Application = require('../../../lib/models/Application');
const { verifyAuth } = require('../../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'PATCH') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    await connectDB();
    
    const user = verifyAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.query;
    const { status } = req.body;

    const app = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    res.json(app);
  } catch (error) {
    console.error('❌ Update application status error:', error.message);
    res.status(500).json({ error: 'Failed to update application.' });
  }
};

const app = require('../server/server.js');
const { connectDB } = require('../lib/mongodb.js');

module.exports = async function handler(req, res) {
  console.log('API invoked:', req.method, req.url);
  try {
    console.log('Connecting to DB...');
    await connectDB();
    console.log('DB connected, handing off to Express...');
    return app(req, res);
  } catch (e) {
    console.error('API Error:', e);
    res.status(500).json({ error: 'Server error', details: e.message, stack: e.stack });
  }
};

const app = require('../server/server.js');
const { connectDB } = require('../lib/mongodb.js');

module.exports = async function handler(req, res) {
  // Connect to DB before handling request
  await connectDB();
  return app(req, res);
};

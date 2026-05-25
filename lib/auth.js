const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'placivio_secret_key_2026';

function generateToken(user, userType) {
  return jwt.sign(
    { id: user._id, userType, college: user.college || '' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function verifyAuth(req) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function requireStudent(req, res) {
  const user = verifyAuth(req);
  if (!user || user.userType !== 'student') {
    res.status(401).json({ error: 'Student authentication required.' });
    return null;
  }
  return user;
}

function requireTpo(req, res) {
  const user = verifyAuth(req);
  if (!user || user.userType !== 'tpo') {
    res.status(401).json({ error: 'TPO authentication required.' });
    return null;
  }
  return user;
}

module.exports = { generateToken, verifyAuth, requireStudent, requireTpo };

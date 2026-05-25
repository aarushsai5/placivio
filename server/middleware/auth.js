const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'placivio_jwt_secret_2024';

function generateToken(user, userType) {
  return jwt.sign(
    { id: user._id, userType, college: user.college || '' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

function requireStudent(req, res, next) {
  if (req.user?.userType !== 'student') {
    return res.status(403).json({ error: 'Student access required.' });
  }
  next();
}

function requireTpo(req, res, next) {
  if (req.user?.userType !== 'tpo') {
    return res.status(403).json({ error: 'TPO access required.' });
  }
  next();
}

// Optional auth - doesn't fail if no token, but attaches user if present
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {}
  }
  next();
}

module.exports = { generateToken, authenticateToken, requireStudent, requireTpo, optionalAuth };

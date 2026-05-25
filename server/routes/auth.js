const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Tpo = require('../models/Tpo');
const { generateToken, authenticateToken } = require('../middleware/auth');

// POST /api/auth/student/register
router.post('/student/register', async (req, res) => {
  try {
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
});

// POST /api/auth/student/login
router.post('/student/login', async (req, res) => {
  try {
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
});

// POST /api/auth/tpo/register
router.post('/tpo/register', async (req, res) => {
  try {
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
});

// POST /api/auth/tpo/login
router.post('/tpo/login', async (req, res) => {
  try {
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
});

// GET /api/auth/me — verify token and return current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType === 'student') {
      const student = await Student.findById(req.user.id).select('-password');
      if (!student) return res.status(404).json({ error: 'User not found.' });
      res.json({ ...student.toObject(), userType: 'student' });
    } else if (req.user.userType === 'tpo') {
      const tpo = await Tpo.findById(req.user.id).select('-password');
      if (!tpo) return res.status(404).json({ error: 'User not found.' });
      res.json({ ...tpo.toObject(), userType: 'tpo' });
    } else {
      res.status(400).json({ error: 'Unknown user type.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

module.exports = router;

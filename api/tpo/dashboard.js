const { connectDB } = require('../../lib/mongodb');
const Tpo = require('../../lib/models/Tpo');
const Student = require('../../lib/models/Student');
const Drive = require('../../lib/models/Drive');
const Application = require('../../lib/models/Application');
const { requireTpo } = require('../../lib/auth');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    const user = requireTpo(req, res);
    if (!user) return;

    const tpo = await Tpo.findById(user.id);
    if (!tpo) return res.status(404).json({ error: 'TPO not found.' });

    const college = tpo.college;
    const collegeRegex = new RegExp('^' + college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');

    const [students, drives, apps] = await Promise.all([
      Student.find({ college: collegeRegex, profileCompleted: true }).select('-password'),
      Drive.find({ college: collegeRegex }).sort({ createdAt: -1 }),
      Application.find({}).populate('driveId', 'college'),
    ]);

    const collegeApps = apps.filter(a => a.driveId && collegeRegex.test(a.driveId.college));
    const selectedCount = collegeApps.filter(a => a.status === 'selected').length;
    const activeDrives = drives.filter(d => d.status === 'upcoming' || d.status === 'ongoing');

    // Readiness distribution
    const ready = students.filter(s => (s.placementScore || 0) >= 70).length;
    const inProgress = students.filter(s => (s.placementScore || 0) >= 40 && (s.placementScore || 0) < 70).length;
    const needsAttention = students.filter(s => (s.placementScore || 0) < 40).length;
    const avgScore = students.length > 0 ? Math.round(students.reduce((s, st) => s + (st.placementScore || 0), 0) / students.length) : 0;

    // Top 10 leaderboard
    const leaderboard = [...students].sort((a, b) => (b.placementScore || 0) - (a.placementScore || 0)).slice(0, 10).map(s => ({
      _id: s._id, name: s.name, branch: s.branch, cgpa: s.cgpa, score: s.placementScore || 0,
    }));

    // At-risk: no recent activity
    const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
    const atRisk = students.filter(s => !s.updatedAt || new Date(s.updatedAt) < sevenDaysAgo).slice(0, 10).map(s => ({
      _id: s._id, name: s.name, branch: s.branch, score: s.placementScore || 0,
      lastActive: s.updatedAt,
    }));

    // Skill heatmap
    const skillFreq = {};
    students.forEach(s => (s.skills || []).forEach(sk => { skillFreq[sk] = (skillFreq[sk] || 0) + 1; }));
    const skillHeatmap = Object.entries(skillFreq).sort((a, b) => b[1] - a[1]).slice(0, 15).map(([skill, count]) => ({ skill, count }));

    // Recent applications
    const recentApps = collegeApps.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)).slice(0, 10);

    res.json({
      tpo: { name: tpo.name, college: tpo.college },
      stats: { totalStudents: students.length, activeDrives: activeDrives.length, studentsPlaced: selectedCount, avgScore },
      readiness: { ready, inProgress, needsAttention },
      leaderboard,
      atRisk,
      skillHeatmap,
      drives: drives.slice(0, 10),
      recentApps,
    });
  } catch (error) {
    console.error('❌ TPO dashboard error:', error.message);
    res.status(500).json({ error: 'Failed to load dashboard.' });
  }
};

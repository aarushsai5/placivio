const { connectDB } = require('../../lib/mongodb');
const Progress = require('../../lib/models/Progress');
const Student = require('../../lib/models/Student');
const Roadmap = require('../../lib/models/Roadmap');
const { generateFeedback } = require('../../lib/gemini');
const { generateSmartAlerts, generateWeekCompleteAlert } = require('../../lib/alerts');
const { checkAndGrantAchievements } = require('../../lib/achievements');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  try {
    await connectDB();
    
    const { studentId, weekNumber, skillsLearned, hoursSpent, selfRating, blockers } = req.body;

    if (!studentId || !weekNumber) {
      return res.status(400).json({ error: 'studentId and weekNumber are required.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found.' });
    }

    const roadmap = await Roadmap.findOne({ studentId });
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    // Save progress
    const progress = new Progress({
      studentId,
      weekNumber,
      skillsLearned: skillsLearned || [],
      hoursSpent: hoursSpent || 0,
      selfRating: selfRating || 3,
      blockers: blockers || '',
    });

    // Generate AI feedback
    console.log(`🤖 Generating feedback for ${student.name} - Week ${weekNumber}...`);
    const feedback = await generateFeedback(student, progress, roadmap);

    progress.agentFeedback = feedback.feedback || '';
    await progress.save();

    // Mark week as completed in roadmap
    const week = roadmap.weeks.find(w => w.weekNumber === weekNumber);
    if (week) {
      week.completed = true;
      week.completedAt = new Date();
      await roadmap.save();
    }

    // Update student placement score
    if (feedback.updatedScore) {
      student.placementScore = feedback.updatedScore;

      // Add new skills learned to student profile
      const newSkills = (skillsLearned || []).filter(s => !student.skills.includes(s));
      if (newSkills.length > 0) {
        student.skills.push(...newSkills);
      }
      await student.save();
    }

    // Generate smart alerts (week complete + general)
    await generateWeekCompleteAlert(studentId, weekNumber);
    await generateSmartAlerts(studentId);

    // Trigger achievements
    await checkAndGrantAchievements(studentId, 'checkin');
    if (feedback.updatedScore >= 70) {
      await checkAndGrantAchievements(studentId, 'score_update', { score: feedback.updatedScore });
    }

    console.log(`✅ Progress saved for ${student.name} - Week ${weekNumber}`);
    res.status(201).json({ progress, feedback });
  } catch (error) {
    console.error('❌ Error saving progress:', error.message);
    res.status(500).json({ error: 'Failed to save progress.' });
  }
};

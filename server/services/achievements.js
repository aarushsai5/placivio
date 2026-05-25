const Achievement = require('../models/Achievement');
const Notification = require('../models/Notification');

const ACHIEVEMENT_DEFS = {
  first_checkin: { title: '🥇 First Step', description: 'Completed your first weekly check-in' },
  week_complete: { title: '📅 Week Warrior', description: 'Completed a full week of learning' },
  score_milestone: { title: '🎯 On Target', description: 'Reached 70% placement readiness score' },
  applied_first_drive: { title: '🏢 Bold Move', description: 'Applied to your first campus drive' },
  got_shortlisted: { title: '⭐ Rising Star', description: 'Got shortlisted for a campus drive' },
  got_placed: { title: '🚀 Placed!', description: 'Got selected in a campus drive' },
};

async function checkAndGrantAchievements(studentId, trigger, context = {}) {
  const granted = [];

  try {
    const existing = await Achievement.find({ studentId });
    const earned = new Set(existing.map(a => a.type));

    const tryGrant = async (type) => {
      if (earned.has(type)) return;
      const def = ACHIEVEMENT_DEFS[type];
      if (!def) return;
      await Achievement.create({ studentId, type, title: def.title, description: def.description });
      await Notification.create({
        userId: studentId, userType: 'student', title: '🏆 Achievement Unlocked!',
        message: `${def.title} — ${def.description}`, type: 'achievement',
      });
      granted.push(type);
      console.log(`🏆 Achievement unlocked for ${studentId}: ${def.title}`);
    };

    if (trigger === 'checkin') {
      await tryGrant('first_checkin');
      await tryGrant('week_complete');
    }

    if (trigger === 'score_update' && context.score >= 70) {
      await tryGrant('score_milestone');
    }

    if (trigger === 'drive_apply') {
      await tryGrant('applied_first_drive');
    }

    if (trigger === 'shortlisted') {
      await tryGrant('got_shortlisted');
    }

    if (trigger === 'selected') {
      await tryGrant('got_placed');
    }
  } catch (error) {
    console.error('❌ Achievement error:', error.message);
  }

  return granted;
}

module.exports = { checkAndGrantAchievements, ACHIEVEMENT_DEFS };

const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  weekNumber: { type: Number, required: true },
  skillsLearned: [{ type: String, trim: true }],
  hoursSpent: { type: Number, default: 0 },
  selfRating: { type: Number, min: 1, max: 5 },
  blockers: { type: String, default: '' },
  agentFeedback: { type: String, default: '' },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Progress', progressSchema);

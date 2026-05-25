const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type: {
    type: String,
    enum: [
      'first_checkin',
      'week_complete',
      'score_milestone',
      'applied_first_drive',
      'got_shortlisted',
      'got_placed',
    ],
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  earnedAt: { type: Date, default: Date.now },
}, { timestamps: true });

achievementSchema.index({ studentId: 1 });
achievementSchema.index({ studentId: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);

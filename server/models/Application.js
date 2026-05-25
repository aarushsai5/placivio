const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive', required: true },
  appliedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['applied', 'shortlisted', 'selected', 'rejected'],
    default: 'applied',
  },
  matchPercentage: { type: Number, default: 0 },
  studentSnapshot: {
    skills: [String],
    cgpa: Number,
    branch: String,
    semester: String,
  },
}, { timestamps: true });

applicationSchema.index({ studentId: 1, driveId: 1 }, { unique: true });
applicationSchema.index({ driveId: 1 });

module.exports = mongoose.model('Application', applicationSchema);

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: String,
}, { _id: false });

const weekSchema = new mongoose.Schema({
  weekNumber: Number,
  topic: String,
  skills: [String],
  resources: [resourceSchema],
  estimatedHours: Number,
  completed: { type: Boolean, default: false },
  completedAt: Date,
}, { _id: false });

const roadmapSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
    index: true
  },
  weeks: [weekSchema],
  totalWeeks: Number,
  placementScore: Number,
  scoreReason: String,
  skillGaps: [String],
  immediateActions: [String],
  encouragement: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);

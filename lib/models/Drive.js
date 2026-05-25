const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema({
  companyName: { type: String, required: true, trim: true },
  jobRole: { type: String, required: true, trim: true },
  packageLPA: { type: Number, required: true },
  driveDate: { type: Date, required: true },
  registrationDeadline: { type: Date, required: true },
  requiredSkills: [{ type: String, trim: true }],
  cgpaCutoff: { type: Number, default: 0, min: 0, max: 10 },
  branchesAllowed: [{ type: String, enum: ['CSE', 'CSBS', 'IT', 'ECE', 'ME', 'CE', 'Other'] }],
  seatsAvailable: { type: Number, default: 0 },
  driveType: { type: String, enum: ['oncampus', 'offcampus'], default: 'oncampus' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Tpo', required: true },
  college: { type: String, required: true, trim: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  shortlisted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  selected: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
}, { timestamps: true });

driveSchema.index({ college: 1, status: 1 });
driveSchema.index({ driveDate: 1 });

module.exports = mongoose.model('Drive', driveSchema);

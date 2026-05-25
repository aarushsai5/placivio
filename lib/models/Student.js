const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  college: { type: String, trim: true, default: '' },
  branch: {
    type: String,
    enum: ['CSE', 'CSBS', 'IT', 'ECE', 'ME', 'CE', 'Other', ''],
    default: '',
  },
  semester: { type: String, default: '' },
  cgpa: { type: Number, default: 0, min: 0, max: 10 },
  skills: [{ type: String, trim: true }],
  targetCompanies: [{ type: String, trim: true }],
  targetCompanyType: [{ type: String, trim: true }],
  timeline: { type: String, default: '6 months' },
  placementScore: { type: Number, default: 0 },
  profileCompleted: { type: Boolean, default: false },
}, { timestamps: true });

studentSchema.index({ email: 1 });
studentSchema.index({ college: 1 });

studentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

studentSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Student', studentSchema);

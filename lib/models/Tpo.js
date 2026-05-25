const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const tpoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  college: { type: String, required: true, trim: true },
  designation: { type: String, default: 'Training & Placement Officer', trim: true },
}, { timestamps: true });

tpoSchema.index({ email: 1 });
tpoSchema.index({ college: 1 });

tpoSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

tpoSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Tpo', tpoSchema);

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  type: {
    type: String,
    required: true,
    enum: ['product', 'service', 'startup'],
  },
  requiredSkills: [{ type: String, trim: true }],
  cgpaCutoff: { type: Number, default: 0 },
  branchesAllowed: [{ type: String, trim: true }],
  visitsColleges: [{ type: String, trim: true }],
});

module.exports = mongoose.model('Company', companySchema);

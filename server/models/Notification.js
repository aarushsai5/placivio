const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userType: { type: String, enum: ['student', 'tpo'], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['drive', 'alert', 'reminder', 'achievement', 'application', 'shortlist'],
    default: 'alert',
  },
  isRead: { type: Boolean, default: false },
  driveId: { type: mongoose.Schema.Types.ObjectId, ref: 'Drive' },
}, { timestamps: true });

notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

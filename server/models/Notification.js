import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  recipientRole: { type: String, required: true, index: true },
  recipientId: { type: String },
  title: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() },
  read: { type: Boolean, default: false },
  requestId: { type: String }
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', NotificationSchema);

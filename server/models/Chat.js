import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  requestId: { type: String, required: true, index: true },
  channel: { 
    type: String, 
    enum: ['vol_donor', 'vol_ngo', 'donor_ngo'], 
    default: 'vol_donor' 
  },
  senderRole: { type: String, required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, default: () => new Date().toISOString() }
}, {
  timestamps: true
});

export const Chat = mongoose.model('Chat', ChatSchema);

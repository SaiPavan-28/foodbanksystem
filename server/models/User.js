import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['donor', 'volunteer', 'admin', 'ngo', 'public', 'login'], 
    default: 'donor' 
  },
  phone: { type: String, default: '' },
  establishmentName: { type: String, default: '' },
  vehicleType: { type: String, default: '' },
  points: { type: Number, default: 0 },
  tier: { 
    type: String, 
    enum: ['Bronze Donor', 'Silver Rescuer', 'Gold Champion', 'Platinum Hero'], 
    default: 'Bronze Donor' 
  },
  quizPassed: { type: Boolean, default: false },
  location: {
    lat: { type: Number, default: 17.3850 },
    lng: { type: Number, default: 78.4867 },
    address: { type: String, default: '' },
    areaName: { type: String, default: '' }
  },
  serviceRadiusKm: { type: Number, default: 10 }
}, {
  timestamps: true
});

export const User = mongoose.model('User', UserSchema);

import mongoose from 'mongoose';

const VolunteerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['available', 'busy', 'offline'], 
    default: 'available' 
  },
  certificationLevel: { 
    type: String, 
    default: 'Level-1 Verified Rescue Volunteer' 
  },
  vehicleType: { 
    type: String, 
    enum: ['Two Wheeler (Bike)', 'Three Wheeler (Auto)', 'Mini Van / Truck', 'Refrigerated Van'],
    default: 'Two Wheeler (Bike)' 
  },
  vehicleCapacityKg: { type: Number, default: 25 },
  currentLocation: {
    lat: { type: Number, default: 17.3850 },
    lng: { type: Number, default: 78.4867 },
    address: { type: String, default: '' },
    areaName: { type: String, default: '' }
  },
  rating: { type: Number, default: 4.8 },
  totalRescues: { type: Number, default: 0 },
  volunteerPoints: { type: Number, default: 0 },
  foodSafetyBadges: { type: [String], default: ['Hygiene Certified', 'Fast Responder'] },
  currentAssignedRequestId: { type: String },
  quizPassed: { type: Boolean, default: false },
  quizScore: { type: Number, default: 0 },
  serviceRadiusKm: { type: Number, default: 10 }
}, {
  timestamps: true
});

export const Volunteer = mongoose.model('Volunteer', VolunteerSchema);

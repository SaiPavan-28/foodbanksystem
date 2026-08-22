import mongoose from 'mongoose';

const DonationRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  donorId: { type: String },
  donorName: { type: String, required: true },
  donorPhone: { type: String, default: '' },
  requestType: { 
    type: String, 
    enum: ['donor_offer', 'shelter_need'], 
    default: 'donor_offer' 
  },
  matchedDonorRequestId: { type: String },
  matchedShelterName: { type: String },
  foodType: { 
    type: String, 
    enum: ['Veg Meals', 'Non-Veg Meals', 'Raw Grocery/Produce', 'Packaged Food', 'Bakery/Bread'],
    required: true 
  },
  quantityKg: { type: Number, required: true },
  estimatedServings: { type: Number, required: true },
  photoUrl: { type: String, default: '' },
  cookedTimestamp: { type: String, default: () => new Date().toISOString() },
  goldenHourDeadline: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true },
    areaName: { type: String, required: true }
  },
  status: { 
    type: String, 
    enum: ['requested', 'pooled', 'needy_demand', 'matched', 'accepted', 'picked_up', 'in_transit', 'delivered', 'rejected', 'fallback_routed'],
    default: 'requested' 
  },
  isSmallQuantity: { type: Boolean, default: false },
  pooledBatchId: { type: String },
  assignedVolunteerId: { type: String },
  assignedVehicleId: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  notes: { type: String, default: '' },
  earnedPoints: { type: Number, default: 0 },
  pickupProof: {
    photoUrl: { type: String, default: '' },
    timestamp: { type: String, default: '' },
    temperatureChecked: { type: Boolean, default: false },
    packagingVerified: { type: Boolean, default: false },
    hygienePassed: { type: Boolean, default: false }
  },
  deliveryProof: {
    photoUrl: { type: String, default: '' },
    recipientName: { type: String, default: '' },
    timestamp: { type: String, default: '' },
    locationConfirmed: { type: Boolean, default: false }
  },
  fallbackRoutedTo: { type: String }
}, {
  timestamps: true
});

export const DonationRequest = mongoose.model('DonationRequest', DonationRequestSchema);

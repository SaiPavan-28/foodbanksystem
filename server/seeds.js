import { User } from './models/User.js';
import { DonationRequest } from './models/DonationRequest.js';
import { Volunteer } from './models/Volunteer.js';
import { Notification } from './models/Notification.js';

export const seedDatabaseIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding default Users into MongoDB...');
      await User.insertMany([
        {
          id: 'usr-donor-1',
          name: 'Sri Grand Marriage Hall',
          email: 'donor@foodbridge.org',
          password: 'password123',
          role: 'donor',
          phone: '+91 98401 22334',
          establishmentName: 'Sri Grand Marriage Hall',
          points: 450,
          tier: 'Gold Champion',
          location: { lat: 13.0400, lng: 80.2300, address: '45 Pondy Bazaar, T. Nagar, Chennai', areaName: 'T. Nagar' }
        },
        {
          id: 'usr-vol-1',
          name: 'Karthik Raja',
          email: 'volunteer@foodbridge.org',
          password: 'password123',
          role: 'volunteer',
          phone: '+91 98401 23456',
          vehicleType: 'Three Wheeler (Auto)',
          points: 2400,
          quizPassed: true,
          location: { lat: 13.0418, lng: 80.2341, address: 'Usman Road, T. Nagar', areaName: 'T. Nagar' }
        },
        {
          id: 'usr-admin-1',
          name: 'System Administrator',
          email: 'admin@foodbridge.org',
          password: 'password123',
          role: 'admin',
          phone: '+91 98401 99999'
        },
        {
          id: 'usr-ngo-1',
          name: 'Hope Children Shelter & NGO',
          email: 'ngo@foodbridge.org',
          password: 'password123',
          role: 'ngo',
          phone: '+91 98400 55443',
          establishmentName: 'Hope Children Shelter',
          points: 120,
          tier: 'Bronze Donor',
          location: { lat: 13.0410, lng: 80.2320, address: '88 Usman Road, T. Nagar, Chennai', areaName: 'T. Nagar' }
        }
      ]);
    }

    const volCount = await Volunteer.countDocuments();
    if (volCount === 0) {
      console.log('🌱 Seeding default Volunteers into MongoDB...');
      await Volunteer.insertMany([
        {
          id: 'vol-1',
          name: 'Karthik Raja',
          phone: '+91 98401 23456',
          status: 'available',
          certificationLevel: 'Master Rescue Specialist',
          vehicleType: 'Three Wheeler (Auto)',
          vehicleCapacityKg: 80,
          currentLocation: { lat: 13.0418, lng: 80.2341, address: 'Usman Road, T. Nagar', areaName: 'T. Nagar' },
          rating: 4.9,
          totalRescues: 48,
          volunteerPoints: 2400,
          foodSafetyBadges: ['Hygiene Master', 'Golden Hour Speedster', 'Cold Chain Certified'],
          quizPassed: true,
          quizScore: 100
        },
        {
          id: 'vol-2',
          name: 'Priya Sundaram',
          phone: '+91 97100 87654',
          status: 'available',
          certificationLevel: 'Certified Safety Handler',
          vehicleType: 'Two Wheeler (Bike)',
          vehicleCapacityKg: 20,
          currentLocation: { lat: 12.9780, lng: 80.2180, address: '100 Feet Road, Velachery', areaName: 'Velachery' },
          rating: 4.8,
          totalRescues: 32,
          volunteerPoints: 1600,
          foodSafetyBadges: ['Food Hygiene Certified', 'Punctuality Champion'],
          quizPassed: true,
          quizScore: 90
        }
      ]);
    }

    const reqCount = await DonationRequest.countDocuments();
    if (reqCount === 0) {
      console.log('🌱 Seeding default Requests & Donations into MongoDB...');
      await DonationRequest.insertMany([
        {
          id: 'req-101',
          donorName: 'Sri Grand Marriage Hall',
          donorPhone: '+91 94440 99887',
          foodType: 'Veg Meals',
          quantityKg: 35,
          estimatedServings: 120,
          photoUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=60',
          cookedTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          goldenHourDeadline: new Date(Date.now() + 135 * 60 * 1000).toISOString(),
          location: { lat: 13.0400, lng: 80.2300, address: '45 Pondy Bazaar, T. Nagar, Chennai', areaName: 'T. Nagar' },
          status: 'matched',
          matchedShelterName: 'Hope Children Shelter & NGO',
          matchedDonorRequestId: 'req-102',
          isSmallQuantity: false,
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          notes: 'Pure vegetarian meal (rice, sambar, vada, payasam). Hot and packed in stainless steel containers.',
          earnedPoints: 400
        },
        {
          id: 'req-102',
          donorName: 'Hope Children Shelter & NGO',
          donorPhone: '+91 98400 55443',
          foodType: 'Veg Meals',
          quantityKg: 35,
          estimatedServings: 120,
          photoUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=60',
          cookedTimestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          goldenHourDeadline: new Date(Date.now() + 135 * 60 * 1000).toISOString(),
          location: { lat: 13.0410, lng: 80.2320, address: '88 Usman Road, T. Nagar, Chennai', areaName: 'T. Nagar' },
          status: 'matched',
          requestType: 'shelter_need',
          matchedDonorRequestId: 'req-101',
          matchedShelterName: 'Hope Children Shelter & NGO',
          isSmallQuantity: false,
          createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
          notes: '[NGO RELIEF NEED] 120 children at shelter. Hot meals needed for dinner.',
          earnedPoints: 300
        }
      ]);
    }
  } catch (err) {
    console.error('Error during database seed:', err);
  }
};

export type UserRole = 'donor' | 'volunteer' | 'admin' | 'ngo' | 'public' | 'login';

export type FoodType = 'Veg Meals' | 'Non-Veg Meals' | 'Raw Grocery/Produce' | 'Packaged Food' | 'Bakery/Bread';

export type RequestStatus = 'requested' | 'pooled' | 'needy_demand' | 'matched' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'rejected' | 'fallback_routed';

export type VolunteerStatus = 'available' | 'busy' | 'offline';

export type VehicleType = 'Two Wheeler (Bike)' | 'Three Wheeler (Auto)' | 'Mini Van / Truck' | 'Refrigerated Van';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  establishmentName?: string;
  vehicleType?: string;
  points?: number;
  tier?: 'Bronze Donor' | 'Silver Rescuer' | 'Gold Champion' | 'Platinum Hero';
  quizPassed?: boolean;
  location?: Location;
  serviceRadiusKm?: number;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  establishmentName?: string;
  vehicleType?: string;
  points?: number;
  tier?: 'Bronze Donor' | 'Silver Rescuer' | 'Gold Champion' | 'Platinum Hero';
  quizPassed?: boolean;
  location?: Location;
  serviceRadiusKm?: number;
}

export interface ChatMessage {
  id: string;
  requestId: string;
  channel?: 'vol_donor' | 'vol_ngo' | 'donor_ngo';
  senderRole: UserRole;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface NotificationAlert {
  id: string;
  recipientRole: UserRole;
  recipientId?: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  requestId?: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  areaName: string;
}

export interface DonationRequest {
  id: string;
  donorId?: string;
  donorName: string;
  donorPhone: string;
  requestType?: 'donor_offer' | 'shelter_need';
  matchedDonorRequestId?: string;
  matchedShelterName?: string;
  foodType: FoodType;
  quantityKg: number;
  estimatedServings: number;
  photoUrl: string;
  cookedTimestamp: string;
  goldenHourDeadline: string;
  location: Location;
  status: RequestStatus;
  isSmallQuantity: boolean;
  pooledBatchId?: string;
  assignedVolunteerId?: string;
  assignedVehicleId?: string;
  createdAt: string;
  notes?: string;
  earnedPoints?: number;
  pickupProof?: {
    photoUrl: string;
    timestamp: string;
    temperatureChecked: boolean;
    packagingVerified: boolean;
    hygienePassed: boolean;
  };
  deliveryProof?: {
    photoUrl: string;
    recipientName: string;
    timestamp: string;
    locationConfirmed: boolean;
  };
  fallbackRoutedTo?: string;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  status: VolunteerStatus;
  certificationLevel: 'Level-1 Verified Rescue Volunteer' | 'Basic' | 'Certified Safety Handler' | 'Master Rescue Specialist';
  vehicleType: VehicleType;
  vehicleCapacityKg: number;
  currentLocation: Location;
  rating: number;
  totalRescues: number;
  volunteerPoints: number;
  foodSafetyBadges: string[];
  currentAssignedRequestId?: string;
  quizPassed: boolean;
  quizScore?: number;
  serviceRadiusKm?: number;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: VehicleType;
  capacityKg: number;
  status: 'active' | 'in_transit' | 'maintenance';
  gpsDeviceId: string;
  currentLocation: Location;
}

export interface HungerHotspot {
  id: string;
  areaName: string;
  lat: number;
  lng: number;
  recipientDensityScore: number;
  estimatedNeedyCount: number;
  activeSheltersCount: number;
  primaryContact: string;
}

export interface PoolingBatch {
  id: string;
  requestIds: string[];
  totalQuantityKg: number;
  totalServings: number;
  assignedVolunteerId?: string;
  routeArea: string;
  status: 'grouping' | 'assigned' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface MatchingScore {
  volunteerId: string;
  volunteerName: string;
  distanceKm: number;
  totalScore: number;
  breakdown: {
    distanceScore: number;
    capacityScore: number;
    availabilityScore: number;
    certificationScore: number;
    urgencyScore: number;
    pastPerformanceScore: number;
  };
}

export interface TrainingModule {
  id: string;
  title: string;
  duration: string;
  category: 'Food Hygiene' | 'Golden Hour Protocol' | 'Cold Chain Storage' | 'Emergency Routing';
  completed: boolean;
  score?: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DonationRequest,
  Volunteer,
  Vehicle,
  HungerHotspot,
  PoolingBatch,
  UserRole,
  MatchingScore,
  TrainingModule,
  RequestStatus,
  VolunteerStatus,
  AuthUser,
  ChatMessage,
  NotificationAlert
} from '../types/foodbridge';

interface FoodBridgeContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  targetLoginRole: UserRole;
  setTargetLoginRole: (role: UserRole) => void;
  openLoginForRole: (role: UserRole) => void;
  authUser: AuthUser | null;
  login: (role: UserRole, email: string) => void;
  logout: () => void;
  passVolunteerQuiz: (score: number) => void;
  requests: DonationRequest[];
  volunteers: Volunteer[];
  vehicles: Vehicle[];
  hotspots: HungerHotspot[];
  batches: PoolingBatch[];
  trainingModules: TrainingModule[];
  // Chat & Notifications
  chatMessages: ChatMessage[];
  sendChatMessage: (requestId: string, text: string) => void;
  notifications: NotificationAlert[];
  clearNotification: (id: string) => void;
  // Actions
  addDonationRequest: (requestData: Omit<DonationRequest, 'id' | 'createdAt' | 'status' | 'isSmallQuantity'>) => string;
  updateRequestStatus: (requestId: string, status: RequestStatus, extraData?: Partial<DonationRequest>) => void;
  assignVolunteerToRequest: (requestId: string, volunteerId: string) => void;
  toggleVolunteerStatus: (volunteerId: string, status: VolunteerStatus) => void;
  calculateMatchingScores: (requestId: string) => MatchingScore[];
  triggerSmallBatchPooling: () => void;
  routeToFallbackShelter: (requestId: string, shelterName: string) => void;
  completeTrainingModule: (moduleId: string) => void;
  simulateNewRequest: () => void;
  // Dual Points
  donorPoints: number;
  donorTier: string;
  volunteerPoints: number;
  stats: {
    totalRescuedKg: number;
    totalMealsServed: number;
    fulfillmentRate: number;
    goldenHourSuccessRate: number;
    activeVolunteersCount: number;
  };
}

const FoodBridgeContext = createContext<FoodBridgeContextType | undefined>(undefined);

const INITIAL_VOLUNTEERS: Volunteer[] = [
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
];

const INITIAL_REQUESTS: DonationRequest[] = [
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
    status: 'requested',
    isSmallQuantity: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    notes: 'Pure vegetarian meal (rice, sambar, vada, payasam). Hot and packed in stainless steel containers.',
    earnedPoints: 400
  }
];

const INITIAL_HOTSPOTS: HungerHotspot[] = [
  {
    id: 'hs-1',
    areaName: 'Koyambedu Slum Settlement',
    lat: 13.0694,
    lng: 80.1948,
    recipientDensityScore: 94,
    estimatedNeedyCount: 450,
    activeSheltersCount: 3,
    primaryContact: 'Anitha (Shelter In-charge)'
  }
];

const INITIAL_VEHICLES: Vehicle[] = [
  { id: 'veh-1', plateNumber: 'TN 07 CA 4921', type: 'Three Wheeler (Auto)', capacityKg: 100, status: 'active', gpsDeviceId: 'GPS-AUTO-01', currentLocation: { lat: 13.0418, lng: 80.2341, address: 'T. Nagar', areaName: 'T. Nagar' } }
];

const INITIAL_TRAINING: TrainingModule[] = [
  { id: 'tr-1', title: 'Food Safety Protocol Level 1', duration: '15 mins', category: 'Food Hygiene', completed: true, score: 95 }
];

export const FoodBridgeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('public');
  const [targetLoginRole, setTargetLoginRole] = useState<UserRole>('donor');

  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('foodbridge_auth');
    return saved ? JSON.parse(saved) : null;
  });

  const [requests, setRequests] = useState<DonationRequest[]>(INITIAL_REQUESTS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [vehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [hotspots] = useState<HungerHotspot[]>(INITIAL_HOTSPOTS);
  const [batches, setBatches] = useState<PoolingBatch[]>([]);
  const [trainingModules, setTrainingModules] = useState<TrainingModule[]>(INITIAL_TRAINING);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('foodbridge_auth', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('foodbridge_auth');
    }
  }, [authUser]);

  const openLoginForRole = (role: UserRole) => {
    const target = role === 'public' || role === 'login' ? 'donor' : role;
    setTargetLoginRole(target);
    setCurrentRole('login');
  };

  const login = (role: UserRole, email: string) => {
    const name = role === 'donor' ? 'Sri Grand Marriage Hall' : role === 'volunteer' ? 'Karthik Raja' : 'System Administrator';
    const user: AuthUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      role,
      points: role === 'donor' ? 450 : undefined,
      tier: role === 'donor' ? 'Gold Champion' : undefined,
      quizPassed: role === 'volunteer' ? true : undefined
    };
    setAuthUser(user);
    setCurrentRole(role);
  };

  const logout = () => {
    setAuthUser(null);
    setCurrentRole('public');
  };

  const passVolunteerQuiz = (score: number) => {
    setVolunteers(prev =>
      prev.map(v => (v.id === 'vol-1' ? { ...v, quizPassed: true, quizScore: score } : v))
    );
    if (authUser) {
      setAuthUser({ ...authUser, quizPassed: true });
    }
  };

  const sendChatMessage = (requestId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      senderRole: authUser?.role || currentRole,
      senderName: authUser?.name || (currentRole === 'donor' ? 'Donor' : 'Volunteer'),
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
  };

  const addNotification = (recipientRole: UserRole, title: string, message: string, requestId?: string) => {
    const notif: NotificationAlert = {
      id: `notif-${Date.now()}`,
      recipientRole,
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      requestId
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addDonationRequest = (requestData: Omit<DonationRequest, 'id' | 'createdAt' | 'status' | 'isSmallQuantity'>): string => {
    const id = `req-${Date.now().toString().slice(-4)}`;
    const isSmallQuantity = requestData.quantityKg <= 5 || requestData.estimatedServings <= 15;
    const earnedPoints = Math.round(requestData.quantityKg * 10 + 50);

    const newReq: DonationRequest = {
      ...requestData,
      id,
      status: isSmallQuantity ? 'pooled' : 'requested',
      isSmallQuantity,
      earnedPoints,
      createdAt: new Date().toISOString()
    };

    setRequests(prev => [newReq, ...prev]);

    addNotification(
      'volunteer',
      '⚡ New Swiggy-Style Rescue Dispatch!',
      `Incoming surplus food order from ${requestData.donorName} (${requestData.quantityKg} kg in ${requestData.location.areaName}).`,
      id
    );

    return id;
  };

  const updateRequestStatus = (requestId: string, status: RequestStatus, extraData?: Partial<DonationRequest>) => {
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          const updated = { ...req, status, ...extraData };

          if (status === 'delivered') {
            setVolunteers(vPrev =>
              vPrev.map(vol =>
                vol.id === req.assignedVolunteerId
                  ? { ...vol, volunteerPoints: vol.volunteerPoints + 70, totalRescues: vol.totalRescues + 1, status: 'available' }
                  : vol
              )
            );

            addNotification(
              'donor',
              '🎉 Food Delivered & Impact Points Earned!',
              `Your food donation from ${req.donorName} was delivered successfully. +${req.earnedPoints || 300} points awarded!`,
              requestId
            );
          }

          return updated;
        }
        return req;
      })
    );
  };

  const assignVolunteerToRequest = (requestId: string, volunteerId: string) => {
    const vol = volunteers.find(v => v.id === volunteerId);
    setRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'accepted',
            assignedVolunteerId: volunteerId,
            assignedVehicleId: vol?.vehicleType === 'Three Wheeler (Auto)' ? 'veh-1' : 'veh-2'
          };
        }
        return req;
      })
    );

    setVolunteers(prev =>
      prev.map(v => (v.id === volunteerId ? { ...v, status: 'busy', currentAssignedRequestId: requestId } : v))
    );

    const req = requests.find(r => r.id === requestId);
    if (req) {
      addNotification(
        'donor',
        '🚀 Volunteer Accepted Your Food Order!',
        `Volunteer ${vol?.name} (${vol?.vehicleType}) accepted your request and is on the way to ${req.location.areaName}.`,
        requestId
      );
    }
  };

  const toggleVolunteerStatus = (volunteerId: string, status: VolunteerStatus) => {
    setVolunteers(prev => prev.map(v => (v.id === volunteerId ? { ...v, status } : v)));
  };

  const calculateMatchingScores = (requestId: string): MatchingScore[] => {
    const req = requests.find(r => r.id === requestId);
    if (!req) return [];

    return volunteers.map(vol => {
      const distanceScore = 90;
      const capacityScore = vol.vehicleCapacityKg >= req.quantityKg ? 100 : 50;
      const availabilityScore = vol.status === 'available' ? 100 : 30;
      const certificationScore = 90;
      const urgencyScore = 85;
      const pastPerformanceScore = (vol.rating / 5) * 100;

      const totalScore = Math.round(
        distanceScore * 0.35 +
          capacityScore * 0.2 +
          availabilityScore * 0.15 +
          certificationScore * 0.1 +
          urgencyScore * 0.1 +
          pastPerformanceScore * 0.1
      );

      return {
        volunteerId: vol.id,
        volunteerName: vol.name,
        distanceKm: 1.8,
        totalScore,
        breakdown: {
          distanceScore: 90,
          capacityScore: Math.round(capacityScore),
          availabilityScore: Math.round(availabilityScore),
          certificationScore: 90,
          urgencyScore: 85,
          pastPerformanceScore: Math.round(pastPerformanceScore)
        }
      };
    }).sort((a, b) => b.totalScore - a.totalScore);
  };

  const triggerSmallBatchPooling = () => {
    const smallReqs = requests.filter(r => r.isSmallQuantity && (r.status === 'requested' || r.status === 'pooled'));
    if (smallReqs.length === 0) return;

    const totalKg = smallReqs.reduce((acc, r) => acc + r.quantityKg, 0);
    const totalServings = smallReqs.reduce((acc, r) => acc + r.estimatedServings, 0);
    const batchId = `batch-${Date.now().toString().slice(-4)}`;

    const newBatch: PoolingBatch = {
      id: batchId,
      requestIds: smallReqs.map(r => r.id),
      totalQuantityKg: totalKg,
      totalServings,
      routeArea: smallReqs[0]?.location.areaName || 'Velachery Cluster',
      status: 'grouping',
      createdAt: new Date().toISOString()
    };

    setBatches(prev => [newBatch, ...prev]);
    setRequests(prev =>
      prev.map(r => (smallReqs.some(sr => sr.id === r.id) ? { ...r, status: 'pooled', pooledBatchId: batchId } : r))
    );
  };

  const routeToFallbackShelter = (requestId: string, shelterName: string) => {
    updateRequestStatus(requestId, 'fallback_routed', { fallbackRoutedTo: shelterName });
  };

  const completeTrainingModule = (moduleId: string) => {
    setTrainingModules(prev =>
      prev.map(m => (m.id === moduleId ? { ...m, completed: true, score: 100 } : m))
    );
  };

  const simulateNewRequest = () => {
    addDonationRequest({
      donorName: 'Hotel Saravana Bhavan',
      donorPhone: '+91 98400 00099',
      foodType: 'Veg Meals',
      quantityKg: 28,
      estimatedServings: 90,
      photoUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=60',
      cookedTimestamp: new Date().toISOString(),
      goldenHourDeadline: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
      location: { lat: 13.0320, lng: 80.2100, address: 'Guindy Main Road, Chennai', areaName: 'Guindy' },
      notes: 'Simulated fresh donation request for Golden Hour rescue demo.'
    });
  };

  const donorPoints = (authUser?.points || 0) + requests.reduce((acc, r) => acc + (r.earnedPoints || 0), 0);
  const donorTier = donorPoints > 800 ? 'Platinum Hero' : donorPoints > 400 ? 'Gold Champion' : 'Silver Rescuer';
  const currentVolObj = volunteers.find(v => v.id === 'vol-1');
  const volunteerPoints = currentVolObj?.volunteerPoints || 2400;

  const totalRescuedKg = requests.filter(r => r.status === 'delivered').reduce((acc, r) => acc + r.quantityKg, 342);

  return (
    <FoodBridgeContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        targetLoginRole,
        setTargetLoginRole,
        openLoginForRole,
        authUser,
        login,
        logout,
        passVolunteerQuiz,
        requests,
        volunteers,
        vehicles,
        hotspots,
        batches,
        trainingModules,
        chatMessages,
        sendChatMessage,
        notifications,
        clearNotification,
        addDonationRequest,
        updateRequestStatus,
        assignVolunteerToRequest,
        toggleVolunteerStatus,
        calculateMatchingScores,
        triggerSmallBatchPooling,
        routeToFallbackShelter,
        completeTrainingModule,
        simulateNewRequest,
        donorPoints,
        donorTier,
        volunteerPoints,
        stats: {
          totalRescuedKg,
          totalMealsServed: Math.round(totalRescuedKg * 3.2),
          fulfillmentRate: 95,
          goldenHourSuccessRate: 98.4,
          activeVolunteersCount: volunteers.filter(v => v.status === 'available').length
        }
      }}
    >
      {children}
    </FoodBridgeContext.Provider>
  );
};

export const useFoodBridge = () => {
  const context = useContext(FoodBridgeContext);
  if (!context) {
    throw new Error('useFoodBridge must be used within a FoodBridgeProvider');
  }
  return context;
};

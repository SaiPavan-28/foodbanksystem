import React, { useState } from 'react';
import { Navigation, CheckSquare, ShieldCheck, Camera, MapPin, Award, CheckCircle2, ChevronRight, Upload, AlertCircle, MessageSquare, Star, Zap, PackageCheck } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { VolunteerStatus, DonationRequest } from '../types/foodbridge';
import { GoldenHourBadge } from '../components/GoldenHourBadge';
import { VolunteerQuizModal } from '../components/VolunteerQuizModal';
import { LiveChatModal } from '../components/LiveChatModal';
import confetti from 'canvas-confetti';

export const VolunteerApp: React.FC = () => {
  const { authUser, volunteers, requests, updateRequestStatus, assignVolunteerToRequest, toggleVolunteerStatus, trainingModules, completeTrainingModule, volunteerPoints } = useFoodBridge();
  const [activeTab, setActiveTab] = useState<'tasks' | 'incoming' | 'completed' | 'training' | 'profile'>('incoming');
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [activeChatRequest, setActiveChatRequest] = useState<DonationRequest | null>(null);

  const currentVolunteer = volunteers.find(v => v.id === authUser?.id || v.name === authUser?.name) || {
    id: authUser?.id || 'vol-1',
    name: authUser?.name || 'Rescue Volunteer',
    phone: authUser?.phone || '+91 98400 12345',
    status: 'available' as VolunteerStatus,
    certificationLevel: 'Level-1 Verified Rescue Volunteer',
    vehicleType: (authUser?.vehicleType as any) || 'Two Wheeler (Bike)',
    vehicleCapacityKg: 25,
    currentLocation: { lat: 13.0400, lng: 80.2300, address: 'T. Nagar, Chennai', areaName: 'T. Nagar' },
    rating: 5.0,
    totalRescues: 0,
    volunteerPoints: authUser?.points || volunteerPoints || 50,
    foodSafetyBadges: ['Food Hygiene Certified', 'Golden Hour Qualified'],
    quizPassed: true,
    quizScore: 100
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const volunteerInitials = getInitials(currentVolunteer.name);

  const [checklist, setChecklist] = useState({
    packagingVerified: true,
    coveringChecked: true,
    temperatureChecked: true,
    hygienePassed: true
  });

  const [pickupPhotoFile, setPickupPhotoFile] = useState<string | null>(null);
  const [deliveryPhotoFile, setDeliveryPhotoFile] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState('Anitha (Koyambedu Shelter)');

  const unassignedRequests = requests.filter(r => 
    (r.status === 'requested' || r.status === 'pooled' || r.status === 'matched') && 
    r.requestType !== 'shelter_need' && 
    !r.assignedVolunteerId
  );
  
  const unmatchedShelterNeeds = requests.filter(r => r.status === 'needy_demand');
  const activeMissions = requests.filter(r => 
    (r.assignedVolunteerId === currentVolunteer.id || (r.assignedVolunteerId && r.assignedVolunteerId === authUser?.id)) &&
    r.status !== 'delivered'
  );

  const completedMissions = requests.filter(r => 
    (r.assignedVolunteerId === currentVolunteer.id || (r.assignedVolunteerId && r.assignedVolunteerId === authUser?.id)) &&
    r.status === 'delivered'
  );

  const handleAcceptOrder = (reqId: string) => {
    if (currentVolunteer.status === 'busy') {
      alert("⚠️ You have an active rescue mission! Complete & receive NGO delivery confirmation for your current order before accepting a new request.");
      return;
    }
    assignVolunteerToRequest(reqId, currentVolunteer.id);
    setActiveTab('tasks');
    confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 } });
  };

  const handlePickupFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPickupPhotoFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDeliveryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setDeliveryPhotoFile(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePickup = (reqId: string) => {
    updateRequestStatus(reqId, 'in_transit', {
      pickupProof: {
        photoUrl: pickupPhotoFile || 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=60',
        timestamp: new Date().toLocaleTimeString(),
        temperatureChecked: checklist.temperatureChecked,
        packagingVerified: checklist.packagingVerified,
        hygienePassed: checklist.hygienePassed
      }
    });
  };

  const handleDeliver = (reqId: string) => {
    updateRequestStatus(reqId, 'delivered', {
      deliveryProof: {
        photoUrl: deliveryPhotoFile || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=60',
        recipientName,
        timestamp: new Date().toLocaleTimeString(),
        locationConfirmed: true
      }
    });
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="min-h-screen bg-[#F0FDFA] text-slate-900 pb-20 selection:bg-teal-500 selection:text-white">
      
      {/* Header Banner - Deep Teal & Electric Lime */}
      <div className="bg-gradient-to-r from-[#0F766E] via-[#0D9488] to-[#115E59] text-white p-6 shadow-xl sticky top-16 z-30">
        <div className="max-w-md mx-auto space-y-4">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-950 border-2 border-[#84CC16] flex items-center justify-center font-bold text-lg text-[#84CC16] shadow-md">
                {volunteerInitials}
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight text-white">{currentVolunteer.name}</h1>
                <div className="flex items-center gap-1.5 text-xs text-teal-200">
                  <Award className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>{currentVolunteer.certificationLevel}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xl font-black text-[#84CC16] font-mono">{volunteerPoints} pts</div>
              <div className="text-[10px] text-teal-200 uppercase font-bold tracking-wider">Volunteer Reward Points</div>
            </div>
          </div>

          {/* Availability Status Toggle */}
          <div className="bg-teal-950/80 p-2 rounded-2xl border border-teal-600/60 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-teal-200 pl-2">Field Status:</span>
            <div className="flex items-center gap-1">
              {(['available', 'busy', 'offline'] as VolunteerStatus[]).map(status => (
                <button
                  key={status}
                  onClick={() => toggleVolunteerStatus(currentVolunteer.id, status)}
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold capitalize transition-all ${
                    currentVolunteer.status === status
                      ? status === 'available'
                        ? 'bg-[#84CC16] text-slate-950 shadow scale-105 font-black'
                        : status === 'busy'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-700 text-white'
                      : 'text-teal-300 hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Nav Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-teal-950/90 rounded-2xl border border-teal-700/60 text-center text-[11px] font-bold">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`py-2 rounded-xl transition-all ${activeTab === 'incoming' ? 'bg-[#84CC16] text-slate-950 shadow font-black' : 'text-teal-300'}`}
            >
              Incoming ({unassignedRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`py-2 rounded-xl transition-all ${activeTab === 'tasks' ? 'bg-[#0D9488] text-white shadow font-black' : 'text-teal-300'}`}
            >
              Active ({activeMissions.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-2 rounded-xl transition-all ${activeTab === 'completed' ? 'bg-[#0D9488] text-white shadow font-black' : 'text-teal-300'}`}
            >
              Completed ({completedMissions.length})
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`py-2 rounded-xl transition-all ${activeTab === 'training' ? 'bg-[#0D9488] text-white shadow font-black' : 'text-teal-300'}`}
            >
              Training
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-md mx-auto px-4 mt-6">
        
        {/* Tab 1: Incoming Feed */}
        {activeTab === 'incoming' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Nearby Rescue Orders (Swiggy Feed)
              </h3>
              <span className="text-[10px] text-teal-700 font-bold uppercase">Real-time Feed</span>
            </div>

            {currentVolunteer.status !== 'available' ? (
              <div className="bg-amber-950 border-2 border-amber-500 rounded-3xl p-6 text-white text-center space-y-4 shadow-xl">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="font-extrabold text-lg text-white">You Are Currently Offline / Busy</h4>
                <p className="text-xs text-amber-200">
                  Order requests are hidden when you are offline. Toggle your status to <b>AVAILABLE</b> to view & accept live food rescue orders.
                </p>
                <button
                  onClick={() => toggleVolunteerStatus(currentVolunteer.id, 'available')}
                  className="px-6 py-3 bg-[#84CC16] hover:bg-lime-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all"
                >
                  ✓ Set Status to AVAILABLE
                </button>
              </div>
            ) : (
              <>
                {/* Unmatched Shelter Needs (Waiting for Donor Food) */}
            {unmatchedShelterNeeds.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Food Relief Requests (Awaiting Food Donor Match)
                </h4>
                {unmatchedShelterNeeds.map(req => (
                  <div key={req.id} className="bg-amber-950 text-white rounded-3xl p-5 border-2 border-amber-600 shadow-xl space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-800/80 pb-2.5">
                      <div>
                        <span className="bg-amber-500 text-slate-950 font-black text-[9px] uppercase px-2 py-0.5 rounded-full">
                          Awaiting Food Donor Match
                        </span>
                        <h4 className="font-extrabold text-base text-white mt-1">{req.donorName}</h4>
                        <p className="text-xs text-amber-200">{req.location.address}</p>
                      </div>
                      <GoldenHourBadge deadlineIso={req.goldenHourDeadline} size="sm" />
                    </div>

                    <div className="p-3 bg-amber-900/50 rounded-2xl border border-amber-800 text-xs space-y-1">
                      <span className="text-amber-200 block font-bold">Requested Food Need:</span>
                      <span className="font-extrabold text-white">{req.estimatedServings} Meals Needed ({req.foodType})</span>
                      <p className="text-[10px] text-amber-300 italic pt-1">
                        ⚠️ Waiting for a nearby donor to submit surplus food before volunteer pickup can begin.
                      </p>
                    </div>

                    <button
                      disabled
                      className="w-full py-3 bg-slate-900/80 text-amber-400 font-extrabold text-xs rounded-2xl border border-amber-600/40 cursor-not-allowed opacity-90 flex items-center justify-center gap-2"
                    >
                      <span>⏳ Awaiting Food Donor to Post Food...</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Donor Food Offers Ready for Pickup */}
            {unassignedRequests.length === 0 && unmatchedShelterNeeds.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-teal-200 text-center space-y-2 shadow">
                <p className="font-bold text-slate-800 text-sm">No Pending Orders Nearby</p>
                <p className="text-xs text-slate-500">New donor requests will broadcast instant alert popups here.</p>
              </div>
            ) : (
              unassignedRequests.map(req => (
                <div key={req.id} className="bg-teal-950 text-white rounded-3xl p-5 border-2 border-teal-600 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-teal-800 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#84CC16]">⚡ Donor Surplus Food Available #{req.id}</span>
                      <h4 className="font-extrabold text-base text-white">{req.donorName}</h4>
                      <p className="text-xs text-teal-200">{req.location.address}</p>
                    </div>
                    <GoldenHourBadge deadlineIso={req.goldenHourDeadline} size="sm" />
                  </div>

                  <div className="bg-teal-900/60 p-3 rounded-2xl border border-teal-800 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-teal-200 block">Available Food</span>
                      <span className="font-bold text-white">{req.foodType}</span>
                    </div>
                    <div>
                      <span className="text-teal-200 block">Weight</span>
                      <span className="font-bold text-[#84CC16]">{req.quantityKg} kg (~{req.estimatedServings} meals)</span>
                    </div>
                  </div>

                  {req.matchedShelterName && (
                    <div className="p-2.5 bg-emerald-900/70 border border-emerald-500/60 rounded-xl text-xs text-emerald-200 flex items-center justify-between">
                      <span>Destination: <b>{req.matchedShelterName}</b></span>
                      <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full">MATCHED</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleAcceptOrder(req.id)}
                    disabled={currentVolunteer.status === 'busy'}
                    className={`w-full py-3.5 font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all ${
                      currentVolunteer.status === 'busy'
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : 'bg-[#84CC16] hover:bg-lime-400 text-slate-950 hover:scale-105'
                    }`}
                  >
                    <span>
                      {currentVolunteer.status === 'busy'
                        ? '🔒 Active Mission in Progress — Complete current order first'
                        : 'Accept Rescue Order & Start Step 2 (+70 Pts)'}
                    </span>
                  </button>
                </div>
              ))
            )}
            </>
          )}
          </div>
        )}

        {/* Tab 2: My Active Missions */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {activeMissions.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-teal-200 text-center space-y-3 shadow-md">
                <ShieldCheck className="w-12 h-12 text-teal-600 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No Active Accepted Missions</h3>
                <p className="text-xs text-slate-500">Go to "Incoming" tab to accept nearby Swiggy requests.</p>
              </div>
            ) : (
              activeMissions.map(req => (
                <div key={req.id} className="bg-white text-slate-900 rounded-3xl border border-teal-200 shadow-xl overflow-hidden space-y-4">
                  
                  <div className="bg-teal-950 p-4 text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-teal-300">Active Task #{req.id}</span>
                      <h3 className="font-extrabold text-base text-white">{req.donorName}</h3>
                    </div>
                    
                    <button
                      onClick={() => setActiveChatRequest(req)}
                      className="px-3.5 py-1.5 bg-[#84CC16] text-slate-950 font-black text-xs rounded-xl flex items-center gap-1 shadow"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat with Donor</span>
                    </button>
                  </div>

                  <div className="p-4 space-y-4">
                    {req.status === 'accepted' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-teal-50 border border-teal-200 rounded-2xl text-xs text-teal-900 space-y-1">
                          <span className="font-extrabold block text-teal-900">Step 2 Active: Arrived at Pickup</span>
                          <p className="text-[11px] text-slate-600">Complete checklist & ask Donor to click <b>"Confirm Food Handed Over"</b> on Step 3!</p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs font-semibold text-slate-700">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={checklist.packagingVerified} onChange={e => setChecklist(prev => ({ ...prev, packagingVerified: e.target.checked }))} className="w-4 h-4 rounded text-teal-600" />
                            <span>Packaging intact & clean containers</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={checklist.temperatureChecked} onChange={e => setChecklist(prev => ({ ...prev, temperatureChecked: e.target.checked }))} className="w-4 h-4 rounded text-teal-600" />
                            <span>Freshness & temperature check passed</span>
                          </label>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-[10px] font-bold uppercase text-slate-600">Pickup Photo Proof Capture</label>
                          <input type="file" accept="image/*" onChange={handlePickupFileUpload} className="text-xs text-slate-600 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-teal-700 file:text-white" />
                        </div>

                        <button onClick={() => handlePickup(req.id)} className="w-full py-3 bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs rounded-2xl shadow flex items-center justify-center gap-2">
                          <Camera className="w-4 h-4" />
                          <span>Capture Pickup Proof & Start Step 3 Transit</span>
                        </button>
                      </div>
                    )}

                    {req.status === 'in_transit' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                          <span className="font-extrabold block text-amber-900">Step 3 Active: Food in Transit</span>
                          <p className="text-[11px] text-slate-600">Heading to shelter hotspot. Click below to submit delivery proof for Step 4!</p>
                        </div>

                        <input type="text" value={recipientName} onChange={e => setRecipientName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 text-slate-900 rounded-xl text-xs font-semibold" />
                        <input type="file" accept="image/*" onChange={handleDeliveryFileUpload} className="text-xs text-slate-600 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:bg-teal-700 file:text-white" />
                        
                        <button onClick={() => handleDeliver(req.id)} className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold text-xs rounded-2xl shadow">
                          <CheckCircle2 className="w-4 h-4" /> Submit Delivery Proof (+70 Pts)
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Completed Tasks History */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Completed Rescue Tasks History
              </h3>
              <span className="text-[10px] text-emerald-800 font-bold uppercase bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {completedMissions.length} Rescues Completed
              </span>
            </div>

            {completedMissions.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3 shadow-md">
                <PackageCheck className="w-12 h-12 text-slate-400 mx-auto" />
                <h3 className="font-bold text-slate-800 text-base">No Completed Missions Yet</h3>
                <p className="text-xs text-slate-500">
                  Once an NGO confirms food delivery receipt (Step 4), completed rescues will be archived here.
                </p>
              </div>
            ) : (
              completedMissions.map(req => (
                <div key={req.id} className="bg-white text-slate-900 rounded-3xl border border-slate-200 shadow-xl overflow-hidden space-y-4 p-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                        ✓ Step 4 Delivered & NGO Verified
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900 mt-1">Order #{req.id}</h4>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      +70 Pts Awarded
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">1. Food Donor</span>
                      <div className="font-extrabold text-slate-800 text-sm flex items-center justify-between">
                        <span>{req.donorName}</span>
                        <span className="text-xs text-slate-500 font-normal">{req.location.areaName}</span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{req.location.address}</p>
                    </div>

                    <div className="p-3 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 block">2. Food Given</span>
                      <div className="font-extrabold text-emerald-950 flex items-center justify-between">
                        <span>{req.foodType}</span>
                        <span className="text-emerald-700 font-bold">{req.quantityKg} kg (~{req.estimatedServings} meals)</span>
                      </div>
                    </div>

                    <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200/80 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-teal-700 block">3. NGO / Shelter Destination</span>
                      <div className="font-extrabold text-teal-950 flex items-center justify-between">
                        <span>{req.matchedShelterName || 'Hope Children Shelter & NGO'}</span>
                        <span className="text-xs text-teal-700 font-bold">Confirmed Received</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Training */}
        {activeTab === 'training' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-teal-200 shadow space-y-2">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" /> Training & Certification
              </h3>
            </div>
            {trainingModules.map(mod => (
              <div key={mod.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-xs">{mod.title}</h4>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-lg">Passed ({mod.score}%)</span>
              </div>
            ))}
          </div>
        )}

      </div>

      {activeChatRequest && (
        <LiveChatModal
          requestId={activeChatRequest.id}
          donorName={activeChatRequest.donorName}
          volunteerName={currentVolunteer.name}
          onClose={() => setActiveChatRequest(null)}
        />
      )}

      {showQuizModal && (
        <VolunteerQuizModal onClose={() => setShowQuizModal(false)} onSuccess={() => {}} />
      )}
    </div>
  );
};

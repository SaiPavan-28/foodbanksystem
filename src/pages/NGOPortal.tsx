import React, { useState } from 'react';
import { Building, HeartHandshake, Utensils, MapPin, Phone, Users, Clock, AlertCircle, CheckCircle2, Award, Star, Upload, Layers, MessageSquare, Navigation, Check, PackageCheck, Heart, Camera } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { FoodType, DonationRequest } from '../types/foodbridge';
import { GoldenHourBadge } from '../components/GoldenHourBadge';
import { LiveChatModal } from '../components/LiveChatModal';
import { LocationPickerMap } from '../components/LocationPickerMap';
import confetti from 'canvas-confetti';

export const NGOPortal: React.FC = () => {
  const { authUser, requests, addDonationRequest, updateRequestStatus, volunteers } = useFoodBridge();
  const [activeTab, setActiveTab] = useState<'create' | 'my-requests' | 'impact'>('create');

  // Form State
  const [shelterName, setShelterName] = useState(authUser?.establishmentName || authUser?.name || 'Hope Children Shelter & NGO');
  const [contactPerson, setContactPerson] = useState('Anitha (Shelter In-charge)');
  const [phone, setPhone] = useState(authUser?.phone || '+91 98400 55443');
  const [areaName, setAreaName] = useState('T. Nagar');
  const [address, setAddress] = useState('88 Usman Road, T. Nagar, Chennai');
  const [locationLat, setLocationLat] = useState(13.0400);
  const [locationLng, setLocationLng] = useState(80.2300);
  const [servingsNeeded, setServingsNeeded] = useState<number>(50);
  const [foodType, setFoodType] = useState<FoodType>('Veg Meals');
  const [urgency, setUrgency] = useState<'emergency' | 'evening' | 'daily'>('emergency');
  const [notes, setNotes] = useState('50 children at shelter. Hot meals needed for dinner.');

  // Modal State
  const [activeChatRequest, setActiveChatRequest] = useState<DonationRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const approxKg = Math.ceil(servingsNeeded / 3);

    addDonationRequest({
      donorId: authUser?.id,
      requestType: 'shelter_need',
      donorName: shelterName,
      donorPhone: phone,
      foodType,
      quantityKg: approxKg,
      estimatedServings: servingsNeeded,
      photoUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=60',
      cookedTimestamp: new Date().toISOString(),
      goldenHourDeadline: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
      location: { lat: locationLat, lng: locationLng, address, areaName },
      notes: `[NGO RELIEF NEED] ${notes} (Contact: ${contactPerson})`
    });

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    setActiveTab('my-requests');
  };

  const handleRecipientConfirmDelivery = (requestId: string) => {
    updateRequestStatus(requestId, 'delivered');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const currentNgoName = (authUser?.establishmentName || authUser?.name || shelterName || '').trim().toLowerCase();
  const currentNgoId = authUser?.id;

  const myRequests = requests.filter(r => {
    // 1. Must belong to this specific NGO (either created by this NGO or matched to this NGO)
    const isOwner = Boolean(
      (currentNgoId && r.donorId === currentNgoId) ||
      (currentNgoName && r.donorName.trim().toLowerCase() === currentNgoName)
    );

    const isMatchedRecipient = Boolean(
      currentNgoName && r.matchedShelterName && r.matchedShelterName.trim().toLowerCase() === currentNgoName
    );

    if (!isOwner && !isMatchedRecipient) {
      return false;
    }

    // 2. Prevent duplicate card when donor offer & shelter need are paired
    if (r.requestType !== 'shelter_need' && r.matchedDonorRequestId) {
      const hasPairedShelterNeed = requests.some(
        s => s.id === r.matchedDonorRequestId && (
          (currentNgoId && s.donorId === currentNgoId) ||
          (currentNgoName && s.donorName.trim().toLowerCase() === currentNgoName)
        )
      );
      if (hasPairedShelterNeed) return false;
    }

    return true;
  });

  const totalMealsReceived = myRequests
    .filter(r => r.status === 'delivered')
    .reduce((acc, r) => acc + r.estimatedServings, 0);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 selection:bg-teal-500 selection:text-white">
      
      {/* NGO Header - Teal & Emerald Theme */}
      <div className="bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] text-white py-10 px-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" /> NGO & Shelter Food Relief Desk
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">{shelterName}</h1>
            <p className="text-teal-100 text-xs mt-1">
              Submit food relief needs & track live volunteer deliveries directly to your shelter.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-teal-950/60 p-1.5 rounded-2xl border border-teal-500/40">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'create' ? 'bg-[#84CC16] text-slate-950 shadow font-black' : 'text-teal-200 hover:text-white'
              }`}
            >
              + Request Food Relief
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'my-requests' ? 'bg-[#84CC16] text-slate-950 shadow font-black' : 'text-teal-200 hover:text-white'
              }`}
            >
              My Orders ({myRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('impact')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'impact' ? 'bg-[#84CC16] text-slate-950 shadow font-black' : 'text-teal-200 hover:text-white'
              }`}
            >
              Shelter Impact ({totalMealsReceived} Meals)
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Tab 1: Submit Food Relief Request */}
        {activeTab === 'create' && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-teal-600" />
                Submit NGO Food Relief Request
              </h2>
              <p className="text-xs text-slate-500">Provide shelter meal requirements. We match your request with active food donors & dispatch volunteers.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">NGO / Shelter Name</label>
                  <input
                    type="text"
                    required
                    value={shelterName}
                    onChange={e => setShelterName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Meals / Servings Needed</label>
                  <input
                    type="number"
                    min={5}
                    max={500}
                    value={servingsNeeded}
                    onChange={e => setServingsNeeded(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Food Category Preference</label>
                  <select
                    value={foodType}
                    onChange={e => setFoodType(e.target.value as FoodType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Veg Meals">Veg Meals</option>
                    <option value="Non-Veg Meals">Non-Veg Meals</option>
                    <option value="Raw Grocery/Produce">Raw Grocery/Produce</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Bakery/Bread">Bakery/Bread</option>
                  </select>
                </div>
              </div>

              <LocationPickerMap
                value={{ lat: locationLat, lng: locationLng, address, areaName }}
                onChange={(loc) => {
                  setLocationLat(loc.lat);
                  setLocationLng(loc.lng);
                  setAddress(loc.address);
                  setAreaName(loc.areaName);
                }}
                height={300}
                accentColor="teal"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes / Beneficiary Details</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-500 hover:to-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-xl transition-all"
              >
                Submit Food Relief Request & Trigger Auto-Donor Match
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: My Food Relief Requests & Swiggy Tracker */}
        {activeTab === 'my-requests' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">NGO Food Relief Orders ({myRequests.length})</h2>

            {myRequests.length === 0 ? (
              <div className="bg-white border border-slate-200/80 rounded-3xl p-10 shadow-xl text-center space-y-4">
                <HeartHandshake className="w-12 h-12 text-teal-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No Active Relief Requests Submitted Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Your NGO <b>{shelterName}</b> has not submitted food relief requests. Click below to submit your first meal requirement!
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-700 text-white font-black text-xs rounded-xl shadow-lg transition-all"
                >
                  + Submit Food Relief Request
                </button>
              </div>
            ) : (
              myRequests.map(req => {
                const vol = volunteers.find(v => v.id === req.assignedVolunteerId);
                const matchedDonorOffer = req.matchedDonorRequestId 
                  ? requests.find(r => r.id === req.matchedDonorRequestId)
                  : null;

                const donorDisplayName = req.requestType === 'shelter_need'
                  ? (matchedDonorOffer?.donorName || (req.matchedDonorRequestId ? 'Matched Donor' : 'Awaiting Surplus Donor'))
                  : req.donorName;

                const isStep1Done = true;
                const isStep2Done = req.status === 'matched' || req.status === 'accepted' || req.status === 'in_transit' || req.status === 'delivered';
                const isStep3Done = req.status === 'in_transit' || req.status === 'delivered';
                const isStep4Done = req.status === 'delivered';

                // Status badge label and color
                const getStatusBadge = () => {
                  if (req.status === 'needy_demand') {
                    return { text: 'Awaiting Food Donor', cls: 'bg-amber-100 text-amber-900 border-amber-300' };
                  }
                  if (req.status === 'matched') {
                    return { text: `Matched: ${donorDisplayName}`, cls: 'bg-teal-100 text-teal-900 border-teal-300' };
                  }
                  if (req.status === 'accepted') {
                    return { text: `Volunteer ${vol ? vol.name.split(' ')[0] : ''} Dispatched`, cls: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
                  }
                  if (req.status === 'in_transit') {
                    return { text: 'Food In Transit 🚚', cls: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' };
                  }
                  if (req.status === 'delivered') {
                    return { text: 'Delivered & Received ✅', cls: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
                  }
                  return { text: req.status.toUpperCase(), cls: 'bg-slate-100 text-slate-800 border-slate-300' };
                };

                const statusBadge = getStatusBadge();

                return (
                  <div key={req.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                    
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                          <Building className="w-7 h-7" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-slate-900 text-base">{req.donorName}</h3>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${statusBadge.cls}`}>
                              {statusBadge.text}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">
                            {req.foodType} • <b>{req.estimatedServings} Meals Needed</b> • {req.location.areaName}
                          </p>
                        </div>
                      </div>
                      <GoldenHourBadge deadlineIso={req.goldenHourDeadline} />
                    </div>

                    {/* Connected Dot Stepper */}
                    <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-5 h-5 text-teal-400 animate-pulse" />
                          <span className="font-extrabold text-sm text-teal-300 tracking-wide">Live Swiggy Rescue Delivery Tracker</span>
                        </div>

                        {vol && (
                          <button
                            onClick={() => setActiveChatRequest(req)}
                            className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat with {vol.name.split(' ')[0]}</span>
                          </button>
                        )}
                      </div>

                      {/* 4 Connected Stepper Dots */}
                      <div className="relative px-4 py-2">
                        <div className="absolute top-5 left-10 right-10 h-1 bg-slate-800 rounded-full -z-0">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 via-emerald-400 to-amber-500 transition-all duration-500 rounded-full"
                            style={{
                              width: isStep4Done ? '100%' : isStep3Done ? '66%' : isStep2Done ? (req.status === 'matched' ? '25%' : '33%') : '0%'
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                          {/* Dot 1 */}
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center border-4 border-slate-950 shadow-lg">
                              <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                            <div className="text-[11px] font-bold text-teal-300">1. NGO Relief Need</div>
                            <span className="text-[9px] text-slate-400 font-mono">Request Registered</span>
                          </div>

                          {/* Dot 2 */}
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-950 transition-all ${
                              isStep2Done ? 'bg-teal-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isStep2Done ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
                            </div>
                            <div className={`text-[11px] font-bold ${isStep2Done ? 'text-teal-300' : 'text-slate-500'}`}>
                              2. Donor & Vol Matched
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono truncate max-w-[80px]">
                              {vol ? `${vol.name.split(' ')[0]}` : req.status === 'matched' ? 'Donor Matched' : 'Awaiting Match'}
                            </span>
                          </div>

                          {/* Dot 3 */}
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-950 transition-all ${
                              isStep3Done ? 'bg-emerald-400 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isStep3Done ? <Check className="w-5 h-5 stroke-[3]" /> : '3'}
                            </div>
                            <div className={`text-[11px] font-bold ${isStep3Done ? 'text-emerald-300' : 'text-slate-500'}`}>
                              3. Food Picked Up
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {req.status === 'in_transit' ? 'In Transit' : isStep3Done ? 'Completed' : 'Pending'}
                            </span>
                          </div>

                          {/* Dot 4 */}
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-950 transition-all ${
                              isStep4Done ? 'bg-amber-400 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isStep4Done ? <Check className="w-5 h-5 stroke-[3]" /> : '4'}
                            </div>
                            <div className={`text-[11px] font-bold ${isStep4Done ? 'text-amber-400' : 'text-slate-500'}`}>
                              4. Received at NGO
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {isStep4Done ? 'Delivered' : req.status === 'in_transit' ? 'Arriving' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Real-time Dynamic Tracker Action Box */}
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                        
                        {req.status === 'needy_demand' && (
                          <div className="p-3.5 bg-amber-950/70 border border-amber-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                                Step 1 Active: Searching for Nearby Surplus Food Donors
                              </h4>
                              <p className="text-[10px] text-slate-300">
                                Your food relief request is registered. Broadcasting to donors in <b>{req.location.areaName}</b> for auto-match dispatch.
                              </p>
                            </div>
                            <span className="px-3 py-1.5 bg-amber-900/80 text-amber-300 border border-amber-700/80 font-bold text-[10px] rounded-lg shrink-0">
                              Broadcasting...
                            </span>
                          </div>
                        )}

                        {req.status === 'matched' && (
                          <div className="p-3.5 bg-teal-950/70 border border-teal-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-xs text-teal-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-teal-400" />
                                Step 2 Active: Surplus Food Matched with {donorDisplayName}!
                              </h4>
                              <p className="text-[10px] text-slate-300">
                                Surplus food reserved from <b>{donorDisplayName}</b>. Dispatch alert broadcasted to nearby rescue volunteers.
                              </p>
                            </div>
                            <span className="px-3 py-1.5 bg-teal-900/80 text-teal-300 border border-teal-700/80 font-bold text-[10px] rounded-lg shrink-0">
                              Awaiting Volunteer
                            </span>
                          </div>
                        )}

                        {req.status === 'accepted' && (
                          <div className="p-3.5 bg-emerald-950/70 border border-emerald-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-xs text-emerald-300 flex items-center gap-1.5">
                                <Navigation className="w-4 h-4 text-emerald-400 animate-pulse" />
                                Step 2 Active: Volunteer {vol?.name || 'Rescue Volunteer'} Dispatched
                              </h4>
                              <p className="text-[10px] text-slate-300">
                                Volunteer <b>{vol?.name || 'Rescue Volunteer'}</b> ({vol?.vehicleType || 'Vehicle'}) is en route to pick up food from <b>{donorDisplayName}</b>.
                              </p>
                            </div>
                            <span className="px-3 py-1.5 bg-emerald-900/80 text-emerald-300 border border-emerald-700/80 font-bold text-[10px] rounded-lg shrink-0">
                              En Route to Pickup
                            </span>
                          </div>
                        )}

                        {req.status === 'in_transit' && (
                          <div className="p-3.5 bg-amber-950/80 border border-amber-500/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                                <PackageCheck className="w-4 h-4 text-amber-400 animate-pulse" />
                                Step 4 Action Required: Confirm Food Arrival at Shelter
                              </h4>
                              <p className="text-[10px] text-slate-300">
                                Volunteer <b>{vol?.name || 'Volunteer'}</b> has picked up the food from {donorDisplayName} and is arriving at <b>{shelterName}</b>. Click below to verify delivery!
                              </p>
                            </div>
                            <button
                              onClick={() => handleRecipientConfirmDelivery(req.id)}
                              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all whitespace-nowrap"
                            >
                              ✓ Confirm Food Received at NGO/Shelter
                            </button>
                          </div>
                        )}

                        {req.status === 'delivered' && (
                          <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 font-extrabold text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Food Relief Received! {req.estimatedServings} Meals Served to Shelter Beneficiaries.</span>
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab 3: Shelter Impact */}
        {activeTab === 'impact' && (
          <div className="space-y-8">
            {/* Impact Hero Banner */}
            <div className="bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] text-white p-8 sm:p-10 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-300 bg-teal-950/60 px-3 py-1 rounded-full border border-teal-500/40">
                    Verified NGO Shelter Impact Desk
                  </span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-black font-mono text-white">
                  {Math.max(totalMealsReceived, 120)} Nutritious Meals Served
                </h3>
                <p className="text-xs sm:text-sm font-medium text-teal-100 max-w-xl">
                  Real-time feeding lifeline and hunger relief statistics for <b>{shelterName}</b>. Every meal rescued is delivered fresh within the Golden Hour window.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0 relative z-10">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
                  <span className="text-2xl font-black text-amber-300 font-mono block">
                    {Math.max(Math.ceil(totalMealsReceived / 3), 40)} kg
                  </span>
                  <span className="text-[10px] uppercase font-bold text-teal-100 tracking-wider">Food Rescued</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center">
                  <span className="text-2xl font-black text-emerald-300 font-mono block">100%</span>
                  <span className="text-[10px] uppercase font-bold text-teal-100 tracking-wider">Safety SLA</span>
                </div>
              </div>
            </div>

            {/* Live Operational Activity & Real-Time Photo Feed */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider">
                    <Camera className="w-4 h-4 text-teal-600" />
                    Live Ground Operations & Community Rescue Feed
                  </div>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-1">Real-Time Shelter & Food Relief Moments</h4>
                  <p className="text-xs text-slate-500">Live photographic documentation of community meals, shelter facilities, rescue transit vehicles, and partner donors.</p>
                </div>
              </div>

              {/* Photo Story Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Story 1: People Eating / Children Meal */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80"
                      alt="Children eating fresh meals"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                      🍲 Community Meals Served
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                        <Utensils className="w-3.5 h-3.5" /> 120 Meals Enjoyed
                      </span>
                      <span className="text-[10px] text-slate-300">Today, 7:30 PM</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h5 className="font-extrabold text-slate-900 text-base">Evening Hot Meals at Hope Shelter</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Children and resident beneficiaries sharing fresh vegetarian meals (rice, sambar, vada, payasam) received within 45 minutes of preparation from Sri Grand Marriage Hall.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" /> T. Nagar Shelter Hall
                      </span>
                      <span className="bg-teal-50 text-teal-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-teal-200">
                        ✓ Quality Verified
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story 2: Shelter Home Facility */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80"
                      alt="Shelter community home facility"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-teal-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                      🏢 Registered NGO Shelter
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
                        <Building className="w-3.5 h-3.5" /> Hope Children Home
                      </span>
                      <span className="text-[10px] text-slate-300">Reg #NGO-TN-042</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h5 className="font-extrabold text-slate-900 text-base">Hope Children Home & Care Shelter</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Permanent residential shelter center providing comprehensive care, daily nutritious sustenance, and education support for 150 underprivileged children and youth.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" /> 88 Usman Road, Chennai
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Active Hub
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story 3: Rescue Vehicles & Active Transit */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?w=800&auto=format&fit=crop&q=80"
                      alt="Food rescue electric vehicle"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                      🚚 Rescue Vehicle Fleet
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px]">
                        <Navigation className="w-3.5 h-3.5" /> TN 07 CA 4921
                      </span>
                      <span className="text-[10px] text-slate-300">Live GPS Active</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h5 className="font-extrabold text-slate-900 text-base">Rapid Thermal Transit Auto Fleet</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Equipped with food-grade insulated thermal carriers maintaining +65°C hot food safety throughout dispatch from commercial wedding halls directly to shelter gates.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-teal-600" /> Driver: Karthik Raja
                      </span>
                      <span className="bg-amber-50 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-amber-200">
                        100 kg Capacity
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story 4: Donors & Kitchen Packing */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80"
                      alt="Generous donor banquet kitchen"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-[#0F5132] text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                      ✨ Partner Food Donor
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-300 font-bold text-[11px]">
                        <Heart className="w-3.5 h-3.5 text-rose-400" /> Sri Grand Hall
                      </span>
                      <span className="text-[10px] text-slate-300">35 kg Donated</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h5 className="font-extrabold text-slate-900 text-base">Commercial Kitchen Surplus Recovery</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Professional banquet and wedding caterers sealing fresh, unserved surplus meals into sanitized containers immediately following banquet events to guarantee zero wastage.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" /> 45 Pondy Bazaar
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                        +400 Donor Credits
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story 5: Volunteers Serving Beneficiaries */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80"
                      alt="Volunteers serving hot food"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                      🤝 Volunteer Delivery Handover
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
                        <HeartHandshake className="w-3.5 h-3.5" /> Dignified Feeding
                      </span>
                      <span className="text-[10px] text-slate-300">Yesterday, 1:15 PM</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h5 className="font-extrabold text-slate-900 text-base">Dignified Shelter Meal Distribution</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      FoodBridge volunteers assisting shelter caregivers to organize warm lunch service for resident children and senior community members with hygienic standards.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" /> Dining Hall Annex
                      </span>
                      <span className="bg-teal-50 text-teal-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-teal-200">
                        Hygiene Passed
                      </span>
                    </div>
                  </div>
                </div>

                {/* Story 6: Cold & Thermal Chain Logistics */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&auto=format&fit=crop&q=80"
                      alt="Volunteers loading relief crates"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                      📦 Logistics & Verification
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-blue-300 font-bold text-[11px]">
                        <Clock className="w-3.5 h-3.5" /> 45 min Golden Hour
                      </span>
                      <span className="text-[10px] text-slate-300">Live Audit #882</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-3">
                    <h5 className="font-extrabold text-slate-900 text-base">Golden Hour Cold & Heat Chain Handover</h5>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Every rescue mission captures photographic proof and temperature validation logs before final handoff at shelter intake, ensuring safe, wholesome food relief.
                    </p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600" /> Intake Bay #1
                      </span>
                      <span className="bg-blue-50 text-blue-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-blue-200">
                        100% Compliant
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

      {/* Live Chat Modal */}
      {activeChatRequest && (
        <LiveChatModal
          requestId={activeChatRequest.id}
          donorName={activeChatRequest.donorName}
          volunteerName={volunteers.find(v => v.id === activeChatRequest.assignedVolunteerId)?.name || 'Karthik Raja'}
          onClose={() => setActiveChatRequest(null)}
        />
      )}

    </div>
  );
};

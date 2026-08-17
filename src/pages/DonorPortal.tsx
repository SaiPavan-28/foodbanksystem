import React, { useState } from 'react';
import { Utensils, Camera, MapPin, Clock, AlertCircle, CheckCircle2, Award, Star, Upload, Gift, Layers, ShieldCheck, MessageSquare, Navigation, Check, PackageCheck, HeartHandshake } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { FoodType, DonationRequest } from '../types/foodbridge';
import { GoldenHourBadge } from '../components/GoldenHourBadge';
import { LiveChatModal } from '../components/LiveChatModal';
import confetti from 'canvas-confetti';

export const DonorPortal: React.FC = () => {
  const { authUser, requests, addDonationRequest, updateRequestStatus, routeToFallbackShelter, donorPoints, donorTier, volunteers } = useFoodBridge();
  const [activeTab, setActiveTab] = useState<'create' | 'my-requests' | 'rewards'>('create');
  
  // Form State
  const [donorName, setDonorName] = useState(authUser?.name || 'Sri Grand Marriage Hall');
  const [donorPhone, setDonorPhone] = useState(authUser?.phone || '+91 98401 22334');
  const [foodType, setFoodType] = useState<FoodType>('Veg Meals');
  const [quantityKg, setQuantityKg] = useState<number>(25);
  const [estimatedServings, setEstimatedServings] = useState<number>(80);
  const [areaName, setAreaName] = useState('T. Nagar');
  const [address, setAddress] = useState('12 Pondy Bazaar, T. Nagar, Chennai');
  const [goldenHourHours, setGoldenHourHours] = useState<number>(3);
  const [photoUrl, setPhotoUrl] = useState('https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=60');
  const [customPhotoFile, setCustomPhotoFile] = useState<string | null>(null);
  const [notes, setNotes] = useState('Freshly prepared lunch meals. Containers ready for pickup.');

  // Modal States
  const [selectedCertRequest, setSelectedCertRequest] = useState<DonationRequest | null>(null);
  const [activeChatRequest, setActiveChatRequest] = useState<DonationRequest | null>(null);

  const isSmallQuantity = quantityKg <= 5 || estimatedServings <= 15;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomPhotoFile(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineIso = new Date(Date.now() + goldenHourHours * 60 * 60 * 1000).toISOString();
    
    let lat = 13.0400;
    let lng = 80.2300;
    if (areaName === 'Velachery') { lat = 12.9800; lng = 80.2200; }
    if (areaName === 'Guindy') { lat = 13.0300; lng = 80.2100; }
    if (areaName === 'Mylapore') { lat = 13.0550; lng = 80.2500; }

    addDonationRequest({
      donorName,
      donorPhone,
      foodType,
      quantityKg,
      estimatedServings,
      photoUrl,
      cookedTimestamp: new Date().toISOString(),
      goldenHourDeadline: deadlineIso,
      location: { lat, lng, address, areaName },
      notes
    });

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    setActiveTab('my-requests');
  };

  const handleDonorConfirmPickup = (requestId: string) => {
    updateRequestStatus(requestId, 'in_transit');
    confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
  };

  const handleRecipientConfirmDelivery = (requestId: string) => {
    updateRequestStatus(requestId, 'delivered');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const samplePhotos = [
    { label: 'Veg Meals', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=60' },
    { label: 'Biryani/Non-Veg', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=60' },
    { label: 'Bakery/Breads', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-20 selection:bg-emerald-500 selection:text-white">
      
      {/* Donor Header - Emerald & Amber Theme */}
      <div className="bg-gradient-to-r from-[#0F5132] via-[#059669] to-[#047857] text-white py-10 px-4 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
              <Utensils className="w-4 h-4" /> Donor Self-Service Portal
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Donate Food & Track Live Rescue Steps</h1>
            <p className="text-emerald-100 text-xs mt-1">
              Connected 4-step delivery tracker with direct Donor & Recipient confirmation controls.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-500/40">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'create' ? 'bg-amber-500 text-slate-950 shadow' : 'text-emerald-200 hover:text-white'
              }`}
            >
              + Submit Food Request
            </button>
            <button
              onClick={() => setActiveTab('my-requests')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                activeTab === 'my-requests' ? 'bg-amber-500 text-slate-950 shadow' : 'text-emerald-200 hover:text-white'
              }`}
            >
              My Orders ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('rewards')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ${
                activeTab === 'rewards' ? 'bg-amber-500 text-slate-950 shadow' : 'text-amber-300 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Credit Points ({donorPoints})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Tab 1: Form */}
        {activeTab === 'create' && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-emerald-600" />
                Submit Surplus Food Request
              </h2>
              <p className="text-xs text-slate-500">Provide details, upload food photo proof, and specify Golden Hour window.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Donor Name / Establishment</label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={e => setDonorName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={donorPhone}
                    onChange={e => setDonorPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Food Category</label>
                  <select
                    value={foodType}
                    onChange={e => setFoodType(e.target.value as FoodType)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Veg Meals">Veg Meals</option>
                    <option value="Non-Veg Meals">Non-Veg Meals</option>
                    <option value="Raw Grocery/Produce">Raw Grocery/Produce</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Bakery/Bread">Bakery/Bread</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Quantity (in kg)</label>
                  <input
                    type="number"
                    min={1}
                    max={500}
                    value={quantityKg}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setQuantityKg(val);
                      setEstimatedServings(val * 3);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Estimated Servings</label>
                  <input
                    type="number"
                    min={1}
                    value={estimatedServings}
                    onChange={e => setEstimatedServings(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {isSmallQuantity && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
                  <div className="p-2 bg-amber-500 text-white rounded-xl">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-900 text-sm">Small-Quantity Batch Pooling Active!</h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Donations under 5kg ({estimatedServings} servings) are automatically merged with nearby small donations in {areaName} into 1 efficient trip.
                    </p>
                  </div>
                </div>
              )}

              {/* Photo Evidence Upload */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">Food Photo Evidence</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-800 block">Upload Food Image File</span>
                      <span className="text-[10px] text-slate-500">Supports PNG, JPG, JPEG</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white"
                  />
                </div>

                {customPhotoFile ? (
                  <div className="relative w-40 h-28 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow">
                    <img src={customPhotoFile} alt="Uploaded evidence" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    {samplePhotos.map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoUrl(photo.url)}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all ${
                          photoUrl === photo.url ? 'border-emerald-600 ring-2 ring-emerald-500/40' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={photo.url} alt={photo.label} className="w-full h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Locality</label>
                  <select
                    value={areaName}
                    onChange={e => setAreaName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white"
                  >
                    <option value="T. Nagar">T. Nagar</option>
                    <option value="Velachery">Velachery</option>
                    <option value="Guindy">Guindy</option>
                    <option value="Mylapore">Mylapore</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-extrabold text-base rounded-2xl shadow-xl hover:scale-[1.01] transition-all"
              >
                Submit Donation Request (+ Earn {Math.round(quantityKg * 10 + 50)} Credit Points)
              </button>

            </form>
          </div>
        )}

        {/* Tab 2: Redesigned Swiggy Delivery Tracker (4 Connected Stepper Dots) */}
        {activeTab === 'my-requests' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Your Live Swiggy Delivery Tracker</h2>

            {requests.map(req => {
              const vol = volunteers.find(v => v.id === req.assignedVolunteerId);

              const isStep1Done = true;
              const isStep2Done = req.status === 'accepted' || req.status === 'in_transit' || req.status === 'delivered';
              const isStep3Done = req.status === 'in_transit' || req.status === 'delivered';
              const isStep4Done = req.status === 'delivered';

              return (
                <div key={req.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
                  
                  {/* Header info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <img src={req.photoUrl} alt={req.foodType} className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-sm" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-base">{req.donorName}</h3>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
                            +{req.earnedPoints || 300} Credit Points
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">{req.foodType} • <b>{req.quantityKg} kg</b> • {req.location.areaName}</p>
                      </div>
                    </div>
                    <GoldenHourBadge deadlineIso={req.goldenHourDeadline} />
                  </div>

                  {/* Connected Dot Stepper */}
                  <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Navigation className="w-5 h-5 text-emerald-400 animate-pulse" />
                        <span className="font-extrabold text-sm text-emerald-300 tracking-wide">Live Order Tracker & Confirmation Controls</span>
                      </div>
                      
                      {vol && (
                        <button
                          onClick={() => setActiveChatRequest(req)}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Chat with {vol.name.split(' ')[0]}</span>
                        </button>
                      )}
                    </div>

                    {/* 4 Connected Stepper Dots Bar */}
                    <div className="relative px-4 py-2">
                      
                      {/* Connecting Line Track */}
                      <div className="absolute top-5 left-10 right-10 h-1 bg-slate-800 rounded-full -z-0">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 transition-all duration-500 rounded-full"
                          style={{
                            width: isStep4Done ? '100%' : isStep3Done ? '66%' : isStep2Done ? '33%' : '0%'
                          }}
                        />
                      </div>

                      {/* 4 Stepper Nodes */}
                      <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                        
                        {/* Dot 1 */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-9 h-9 rounded-full bg-emerald-500 text-slate-950 font-black flex items-center justify-center border-4 border-slate-900 shadow-lg">
                            <Check className="w-5 h-5 stroke-[3]" />
                          </div>
                          <div className="text-[11px] font-bold text-emerald-400">1. Request Submitted</div>
                          <span className="text-[9px] text-slate-400 font-mono">Order Placed</span>
                        </div>

                        {/* Dot 2 */}
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-900 transition-all ${
                            isStep2Done ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {isStep2Done ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
                          </div>
                          <div className={`text-[11px] font-bold ${isStep2Done ? 'text-emerald-400' : 'text-slate-500'}`}>
                            2. Volunteer Matched
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {vol ? `${vol.name.split(' ')[0]} (${vol.vehicleType.split(' ')[0]})` : 'Awaiting Match'}
                          </span>
                        </div>

                        {/* Dot 3 */}
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-900 transition-all ${
                            isStep3Done ? 'bg-teal-400 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {isStep3Done ? <Check className="w-5 h-5 stroke-[3]" /> : '3'}
                          </div>
                          <div className={`text-[11px] font-bold ${isStep3Done ? 'text-teal-300' : 'text-slate-500'}`}>
                            3. Food Handed Over
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">Donor Pickup Confirmed</span>
                        </div>

                        {/* Dot 4 */}
                        <div className="flex flex-col items-center gap-2">
                          <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-900 transition-all ${
                            isStep4Done ? 'bg-amber-400 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {isStep4Done ? <Check className="w-5 h-5 stroke-[3]" /> : '4'}
                          </div>
                          <div className={`text-[11px] font-bold ${isStep4Done ? 'text-amber-400' : 'text-slate-500'}`}>
                            4. Delivered & Received
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono">Hotspot Verified</span>
                        </div>

                      </div>
                    </div>

                    {/* Step Action Confirmation Controls */}
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                      
                      {/* Step 3 Action: Donor Manual Confirmation */}
                      {req.status === 'accepted' && (
                        <div className="p-3 bg-teal-950/70 border border-teal-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-extrabold text-xs text-teal-300 flex items-center gap-1.5">
                              <PackageCheck className="w-4 h-4 text-teal-400" />
                              Step 3 Donor Confirmation Required
                            </h4>
                            <p className="text-[10px] text-slate-300">
                              Volunteer <b>{vol?.name}</b> is at your location. Click below once food is handed over!
                            </p>
                          </div>
                          <button
                            onClick={() => handleDonorConfirmPickup(req.id)}
                            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all whitespace-nowrap"
                          >
                            ✓ Confirm Food Handed Over to Volunteer
                          </button>
                        </div>
                      )}

                      {/* Step 4 Action: Recipient / Shelter Manual Confirmation */}
                      {req.status === 'in_transit' && (
                        <div className="p-3 bg-amber-950/70 border border-amber-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                              <HeartHandshake className="w-4 h-4 text-amber-400" />
                              Step 4 Recipient / Shelter Confirmation
                            </h4>
                            <p className="text-[10px] text-slate-300">
                              Food in transit to Koyambedu Shelter. Click below to verify final receipt!
                            </p>
                          </div>
                          <button
                            onClick={() => handleRecipientConfirmDelivery(req.id)}
                            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all whitespace-nowrap"
                          >
                            ✓ Confirm Food Received at Hotspot
                          </button>
                        </div>
                      )}

                      {req.status === 'delivered' && (
                        <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 font-extrabold text-center flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>All 4 Steps Completed! +{req.earnedPoints || 300} Donor Credit Points Awarded.</span>
                        </div>
                      )}

                    </div>
                  </div>

                  {req.status === 'delivered' && (
                    <button onClick={() => setSelectedCertRequest(req)} className="ml-auto text-xs font-bold bg-emerald-600 text-white px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow">
                      <Award className="w-4 h-4 text-amber-300" /> View Impact Certificate
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Rewards */}
        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0F5132] via-[#059669] to-[#047857] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-300">Donor Rewards Hub</span>
                <h3 className="text-4xl font-black mt-1 font-mono text-white">{donorPoints} Credit Points</h3>
                <p className="text-xs font-semibold mt-1 text-emerald-100">Current Rank: <b className="uppercase text-amber-300">{donorTier}</b></p>
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

      {/* Impact Certificate Modal */}
      {selectedCertRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-white border-4 border-emerald-600 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center space-y-4">
            <h3 className="text-2xl font-black text-slate-900">{selectedCertRequest.donorName}</h3>
            <button onClick={() => setSelectedCertRequest(null)} className="w-full py-3 bg-slate-900 text-white font-bold text-xs rounded-xl">Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

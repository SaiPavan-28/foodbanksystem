import React, { useState } from 'react';
import { Building, HeartHandshake, Utensils, MapPin, Phone, Users, Clock, AlertCircle, CheckCircle2, Award, Star, Upload, Layers, MessageSquare, Navigation, Check, PackageCheck, Heart } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { FoodType, DonationRequest } from '../types/foodbridge';
import { GoldenHourBadge } from '../components/GoldenHourBadge';
import { LiveChatModal } from '../components/LiveChatModal';
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
  const [servingsNeeded, setServingsNeeded] = useState<number>(50);
  const [foodType, setFoodType] = useState<FoodType>('Veg Meals');
  const [urgency, setUrgency] = useState<'emergency' | 'evening' | 'daily'>('emergency');
  const [notes, setNotes] = useState('50 children at shelter. Hot meals needed for dinner.');

  // Modal State
  const [activeChatRequest, setActiveChatRequest] = useState<DonationRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let lat = 13.0400;
    let lng = 80.2300;
    if (areaName === 'Velachery') { lat = 12.9800; lng = 80.2200; }
    if (areaName === 'Guindy') { lat = 13.0300; lng = 80.2100; }
    if (areaName === 'Mylapore') { lat = 13.0550; lng = 80.2500; }

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
      location: { lat, lng, address, areaName },
      notes: `[NGO RELIEF NEED] ${notes} (Contact: ${contactPerson})`
    });

    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    setActiveTab('my-requests');
  };

  const handleRecipientConfirmDelivery = (requestId: string) => {
    updateRequestStatus(requestId, 'delivered');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const myRequests = requests.filter(r => 
    (r.donorId && r.donorId === authUser?.id) || 
    r.donorName === authUser?.name ||
    (authUser?.establishmentName && r.donorName === authUser?.establishmentName)
  );

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
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Delivery Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium"
                  />
                </div>
              </div>

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

                const isStep1Done = true;
                const isStep2Done = req.status === 'accepted' || req.status === 'in_transit' || req.status === 'delivered';
                const isStep3Done = req.status === 'in_transit' || req.status === 'delivered';
                const isStep4Done = req.status === 'delivered';

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
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                              req.status === 'needy_demand' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}>
                              {req.status === 'needy_demand' ? 'Awaiting Food Donor' : 'Matched & Active'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{req.foodType} • <b>{req.estimatedServings} Meals Needed</b> • {req.location.areaName}</p>
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
                              width: isStep4Done ? '100%' : isStep3Done ? '66%' : isStep2Done ? '33%' : '0%'
                            }}
                          />
                        </div>

                        <div className="grid grid-cols-4 gap-2 relative z-10 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-teal-500 text-slate-950 font-black flex items-center justify-center border-4 border-slate-950 shadow-lg">
                              <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                            <div className="text-[11px] font-bold text-teal-300">1. NGO Relief Need</div>
                            <span className="text-[9px] text-slate-400 font-mono">Request Registered</span>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-950 transition-all ${
                              isStep2Done ? 'bg-teal-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isStep2Done ? <Check className="w-5 h-5 stroke-[3]" /> : '2'}
                            </div>
                            <div className={`text-[11px] font-bold ${isStep2Done ? 'text-teal-300' : 'text-slate-500'}`}>
                              2. Donor & Vol Matched
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {vol ? `${vol.name.split(' ')[0]}` : 'Awaiting Match'}
                            </span>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-950 transition-all ${
                              isStep3Done ? 'bg-emerald-400 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isStep3Done ? <Check className="w-5 h-5 stroke-[3]" /> : '3'}
                            </div>
                            <div className={`text-[11px] font-bold ${isStep3Done ? 'text-emerald-300' : 'text-slate-500'}`}>
                              3. Food Picked Up
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">In Transit</span>
                          </div>

                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-9 h-9 rounded-full font-black flex items-center justify-center border-4 border-slate-950 transition-all ${
                              isStep4Done ? 'bg-amber-400 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-500'
                            }`}>
                              {isStep4Done ? <Check className="w-5 h-5 stroke-[3]" /> : '4'}
                            </div>
                            <div className={`text-[11px] font-bold ${isStep4Done ? 'text-amber-400' : 'text-slate-500'}`}>
                              4. Received at NGO
                            </div>
                            <span className="text-[9px] text-slate-400 font-mono">Delivered</span>
                          </div>
                        </div>
                      </div>

                      {/* Step 4 Action: NGO Confirmation */}
                      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                        {req.status === 'in_transit' && (
                          <div className="p-3 bg-amber-950/70 border border-amber-500/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <h4 className="font-extrabold text-xs text-amber-300 flex items-center gap-1.5">
                                <PackageCheck className="w-4 h-4 text-amber-400" />
                                Step 4 NGO Delivery Confirmation
                              </h4>
                              <p className="text-[10px] text-slate-300">
                                Volunteer is arriving at <b>{shelterName}</b>. Click below to verify food arrival!
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
                          <div className="p-3 bg-emerald-950/60 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 font-extrabold text-center flex items-center justify-center gap-2">
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
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#0D9488] via-[#0F766E] to-[#115E59] text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-300">NGO Shelter Impact Desk</span>
                <h3 className="text-4xl font-black mt-1 font-mono text-white">{totalMealsReceived} Nutritious Meals Served</h3>
                <p className="text-xs font-semibold mt-1 text-teal-100">Beneficiary Shelter: <b className="uppercase text-amber-300">{shelterName}</b></p>
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

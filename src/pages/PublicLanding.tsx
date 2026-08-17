import React, { useState } from 'react';
import { ShieldCheck, HeartHandshake, Clock, Users, ArrowRight, Award, Zap, CheckCircle2, TrendingUp, Utensils, Heart, LogIn } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { FoodReliefModal } from '../components/FoodReliefModal';

export const PublicLanding: React.FC = () => {
  const { openLoginForRole, stats } = useFoodBridge();
  const [showFoodReliefModal, setShowFoodReliefModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FAF8F5] via-white to-[#F0FDF4] border-b border-slate-200/80">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Text & Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold shadow-sm">
                <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Share Food, Share Hope • Golden Hour Rescue Platform</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                  <span className="text-[#0F5132] block">FOOD DONATION</span>
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                    Share Food, Share Hope
                  </span>
                </h1>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium pt-2">
                  Transforming surplus food into timely Golden Hour rescues. Connecting donors, field volunteers, shelters, and hunger hotspots with zero delay.
                </p>
              </div>

              {/* Action Buttons (Including Request Food Relief for Shelters & Beneficiaries) */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                
                {/* 1. Request Food Relief (For Shelters & Needy) */}
                <button
                  onClick={() => setShowFoodReliefModal(true)}
                  className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all scale-100 hover:scale-105"
                  id="hero-request-food-relief-btn"
                >
                  <HeartHandshake className="w-4.5 h-4.5" />
                  <span>Request Food Relief (For Shelters/Needy)</span>
                </button>

                {/* 2. Donate Surplus Food */}
                <button
                  onClick={() => openLoginForRole('donor')}
                  className="px-6 py-4 bg-[#0F5132] hover:bg-[#064E3B] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Donate Surplus Food</span>
                </button>

                {/* 3. Join as Volunteer */}
                <button
                  onClick={() => openLoginForRole('volunteer')}
                  className="px-6 py-4 bg-teal-950 hover:bg-teal-900 border border-teal-700 text-teal-200 font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Users className="w-4 h-4 text-[#84CC16]" />
                  <span>Join as Volunteer</span>
                </button>

                {/* 4. Sign In / Register */}
                <button
                  onClick={() => openLoginForRole('donor')}
                  className="px-5 py-4 bg-white hover:bg-emerald-50 border-2 border-emerald-600 text-emerald-900 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
                  id="hero-sign-in-register-btn"
                >
                  <LogIn className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  <span>Sign In / Register</span>
                </button>

              </div>

              {/* Quick Feature Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Verified Food Safety
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> Golden Hour Countdown SLA
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Small-Quantity Batch Pooling
                </div>
              </div>

            </div>

            {/* Right Column: Hero Graphic */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white p-2 transform transition-all duration-300 hover:scale-[1.02]">
                <img
                  src="/hero-donation.png"
                  alt="FOOD DONATION - Share Food, Share Hope"
                  className="w-full h-auto rounded-2xl object-cover"
                />

                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <HeartHandshake className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-900 block">No Food Waste Platform</span>
                      <span className="text-[10px] text-slate-500 font-medium">Connecting Donors, Volunteers & Shelters</span>
                    </div>
                  </div>
                  <span className="bg-emerald-600 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-lg">
                    Active
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Live Impact Counters Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-950 text-white border border-slate-800 rounded-3xl shadow-2xl">
            <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">{stats.totalRescuedKg} kg</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Surplus Food Rescued</div>
            </div>
            <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">{stats.totalMealsServed}</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Nutritious Meals Served</div>
            </div>
            <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
              <div className="text-3xl sm:text-4xl font-black text-teal-400 font-mono">{stats.fulfillmentRate}%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Fulfillment Efficiency</div>
            </div>
            <div className="text-center p-3">
              <div className="text-3xl sm:text-4xl font-black text-[#84CC16] font-mono">{stats.goldenHourSuccessRate}%</div>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Golden Hour Compliance</div>
            </div>
          </div>

        </div>
      </section>

      {/* How Golden Hour Rescue Works */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700">4-Stage Rescue Workflow</span>
          <h2 className="text-3xl font-extrabold text-slate-900">How FoodBridge Operates in Real Time</h2>
          <p className="text-slate-600 text-sm">
            Bridging surplus food providers and vulnerable communities before food quality degrades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xl">1</div>
            <h3 className="font-bold text-lg text-slate-900">Donor Request</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donors upload food photos, quantity, cook time, and Golden Hour deadline window.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl">2</div>
            <h3 className="font-bold text-lg text-slate-900">Smart Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              6-factor deterministic engine matches nearby available volunteers by distance and vehicle capacity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-black text-xl">3</div>
            <h3 className="font-bold text-lg text-slate-900">Safety Inspection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Volunteers perform packaging checks, freshness verification, and timestamped photo proof capture.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 hover:shadow-xl transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#DCFCE7] text-emerald-900 flex items-center justify-center font-black text-xl">4</div>
            <h3 className="font-bold text-lg text-slate-900">Hotspot Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Food is delivered directly to verified shelters with manual recipient confirmation & credit points.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-bold text-slate-200">FoodBridge — Code for Good Hackathon Platform for No Food Waste</p>
          <p className="text-slate-500">Transforming manual helpline & spreadsheet coordination into real-time food rescue intelligence.</p>
        </div>
      </footer>

      {showFoodReliefModal && (
        <FoodReliefModal onClose={() => setShowFoodReliefModal(false)} />
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { Utensils, Heart, Shield, Sparkles, Navigation, LogIn, LogOut, Star, HeartHandshake } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    openLoginForRole,
    authUser,
    logout,
    simulateNewRequest,
    donorPoints,
    donorTier,
    volunteerPoints
  } = useFoodBridge();

  const [showFoodReliefModal, setShowFoodReliefModal] = useState<boolean>(false);

  return (
    <>
      <header className="bg-slate-950 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentRole('public')}>
              <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-950/80 ring-2 ring-emerald-400/40">
                <Utensils className="w-5 h-5 text-slate-950" />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 rounded-full p-0.5 shadow">
                  <Heart className="w-3 h-3 fill-slate-950 text-slate-950" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white">FoodBridge</span>
                  <span className="bg-emerald-950 border border-emerald-500 text-emerald-300 text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    Food Rescue App
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">No Food Waste • Golden Hour Platform</p>
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              
              {/* Donor Points Badge */}
              {authUser?.role === 'donor' && (
                <div className="hidden sm:flex items-center gap-1.5 bg-amber-950/80 border border-amber-600/80 px-3 py-1.5 rounded-xl text-amber-300 text-xs font-extrabold shadow-sm">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{donorPoints} Credit Points</span>
                  <span className="bg-amber-500 text-slate-950 text-[9px] uppercase px-1.5 py-0.5 rounded font-black ml-1">
                    {donorTier}
                  </span>
                </div>
              )}

              {/* Volunteer Points Badge */}
              {authUser?.role === 'volunteer' && (
                <div className="hidden sm:flex items-center gap-1.5 bg-teal-950/80 border border-teal-600/80 px-3 py-1.5 rounded-xl text-teal-300 text-xs font-extrabold shadow-sm">
                  <Star className="w-3.5 h-3.5 text-[#84CC16] fill-[#84CC16]" />
                  <span>{volunteerPoints} Volunteer Pts</span>
                </div>
              )}

              {/* NGO Badge */}
              {authUser?.role === 'ngo' && (
                <div className="hidden sm:flex items-center gap-1.5 bg-teal-950/80 border border-teal-600/80 px-3 py-1.5 rounded-xl text-teal-300 text-xs font-extrabold shadow-sm">
                  <HeartHandshake className="w-3.5 h-3.5 text-teal-400" />
                  <span>NGO / Shelter Desk</span>
                </div>
              )}

              {/* NGO Sign In Button when logged out */}
              {!authUser && (
                <button
                  onClick={() => openLoginForRole('ngo')}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
                  id="navbar-ngo-sign-in-btn"
                >
                  <HeartHandshake className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                  <span className="hidden sm:inline">NGO Sign In</span>
                </button>
              )}

              {/* Simulate Button */}
              <button
                onClick={simulateNewRequest}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow-md transition-all active:scale-95"
                title="Simulate incoming food request"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span className="hidden md:inline">Simulate Dispatch</span>
              </button>

              {/* Logged in User Controls */}
              {authUser && (
                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <div className="hidden xl:block text-right">
                    <div className="text-xs font-bold text-slate-200">{authUser.name}</div>
                    <div className="text-[10px] text-emerald-400 uppercase font-semibold">{authUser.role}</div>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl transition-all font-bold text-xs"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </header>
    </>
  );
};

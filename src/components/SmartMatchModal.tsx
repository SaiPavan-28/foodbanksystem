import React from 'react';
import { X, Award, CheckCircle, Navigation, Shield, Truck, Zap } from 'lucide-react';
import { MatchingScore, DonationRequest } from '../types/foodbridge';
import { useFoodBridge } from '../context/FoodBridgeContext';

interface SmartMatchModalProps {
  request: DonationRequest;
  onClose: () => void;
}

export const SmartMatchModal: React.FC<SmartMatchModalProps> = ({ request, onClose }) => {
  const { calculateMatchingScores, assignVolunteerToRequest } = useFoodBridge();
  const scores: MatchingScore[] = calculateMatchingScores(request.id);

  const handleAssign = (volunteerId: string) => {
    assignVolunteerToRequest(request.id, volunteerId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 shadow-sm">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Smart Matching & Decision Engine</h2>
              <p className="text-xs text-slate-500">
                Deterministic 6-factor score calculation for <span className="text-emerald-700 font-bold">{request.donorName}</span> ({request.quantityKg} kg, {request.foodType})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm Weighting Legend */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-teal-700 font-black block">35%</span>
            <span className="text-slate-500 font-medium">Distance</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-amber-700 font-black block">20%</span>
            <span className="text-slate-500 font-medium">Vehicle Cap</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-emerald-700 font-black block">15%</span>
            <span className="text-slate-500 font-medium">Availability</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-lime-700 font-black block">10%</span>
            <span className="text-slate-500 font-medium">Food Safety</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-rose-700 font-black block">10%</span>
            <span className="text-slate-500 font-medium">SLA Urgency</span>
          </div>
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-orange-700 font-black block">10%</span>
            <span className="text-slate-500 font-medium">Rating</span>
          </div>
        </div>

        {/* Ranked Match List */}
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
          {scores.map((score, index) => {
            const isBestMatch = index === 0;
            return (
              <div
                key={score.volunteerId}
                className={`p-4 rounded-2xl border transition-all ${
                  isBestMatch
                    ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isBestMatch && (
                        <span className="bg-[#0F5132] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                          <CheckCircle className="w-3 h-3" /> Recommended Match
                        </span>
                      )}
                      <h3 className="font-extrabold text-slate-900 text-base">{score.volunteerName}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                      <span className="flex items-center gap-1 text-teal-700 font-bold">
                        <Navigation className="w-3.5 h-3.5" /> {score.distanceKm} km away
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Truck className="w-3.5 h-3.5 text-amber-600" /> Cap score: <b>{score.breakdown.capacityScore}%</b>
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Shield className="w-3.5 h-3.5 text-emerald-600" /> Cert score: <b>{score.breakdown.certificationScore}%</b>
                      </span>
                    </div>
                  </div>

                  {/* Right Score & Action */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-700 flex items-baseline justify-end gap-1 font-mono">
                        <span>{score.totalScore}</span>
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Match Score</span>
                    </div>

                    <button
                      onClick={() => handleAssign(score.volunteerId)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all shadow-md ${
                        isBestMatch
                          ? 'bg-[#0F5132] hover:bg-[#064E3B] text-white shadow-emerald-900/20'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {isBestMatch ? 'Dispatch Now' : 'Select Volunteer'}
                    </button>
                  </div>
                </div>

                {/* Score breakdown bar */}
                <div className="mt-3 pt-3 border-t border-slate-200/70 grid grid-cols-6 gap-1 text-[10px] text-slate-500 font-medium">
                  <div>Dist: <span className="text-teal-700 font-bold font-mono">{score.breakdown.distanceScore}</span></div>
                  <div>Cap: <span className="text-amber-700 font-bold font-mono">{score.breakdown.capacityScore}</span></div>
                  <div>Avail: <span className="text-emerald-700 font-bold font-mono">{score.breakdown.availabilityScore}</span></div>
                  <div>Cert: <span className="text-lime-700 font-bold font-mono">{score.breakdown.certificationScore}</span></div>
                  <div>Urg: <span className="text-rose-700 font-bold font-mono">{score.breakdown.urgencyScore}</span></div>
                  <div>Rating: <span className="text-orange-700 font-bold font-mono">{score.breakdown.pastPerformanceScore}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

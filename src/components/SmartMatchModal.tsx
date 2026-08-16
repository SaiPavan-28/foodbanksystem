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
      <div className="bg-slate-900 border border-slate-700 text-slate-100 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900/60 border border-emerald-700 rounded-xl text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">Smart Matching & Decision Engine</h2>
              <p className="text-xs text-slate-400">
                Deterministic 6-factor score calculation for <span className="text-emerald-400 font-semibold">{request.donorName}</span> ({request.quantityKg} kg, {request.foodType})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm Weighting Legend */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 grid grid-cols-2 md:grid-cols-6 gap-2 text-center text-xs">
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-teal-400 font-bold block">35%</span>
            <span className="text-slate-400">Distance</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-amber-400 font-bold block">20%</span>
            <span className="text-slate-400">Vehicle Cap</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-bold block">15%</span>
            <span className="text-slate-400">Availability</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-lime-400 font-bold block">10%</span>
            <span className="text-slate-400">Food Safety</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-rose-400 font-bold block">10%</span>
            <span className="text-slate-400">SLA Urgency</span>
          </div>
          <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-orange-400 font-bold block">10%</span>
            <span className="text-slate-400">Rating</span>
          </div>
        </div>

        {/* Ranked Match List */}
        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {scores.map((score, index) => {
            const isBestMatch = index === 0;
            return (
              <div
                key={score.volunteerId}
                className={`p-4 rounded-xl border transition-all ${
                  isBestMatch
                    ? 'bg-emerald-950/40 border-emerald-600/80 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isBestMatch && (
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Recommended Match
                        </span>
                      )}
                      <h3 className="font-bold text-slate-100 text-base">{score.volunteerName}</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="flex items-center gap-1 text-teal-400">
                        <Navigation className="w-3.5 h-3.5" /> {score.distanceKm} km away
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Truck className="w-3.5 h-3.5 text-amber-400" /> Cap score: {score.breakdown.capacityScore}%
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Shield className="w-3.5 h-3.5 text-lime-400" /> Cert score: {score.breakdown.certificationScore}%
                      </span>
                    </div>
                  </div>

                  {/* Right Score & Action */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400 flex items-baseline justify-end gap-1">
                        <span>{score.totalScore}</span>
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">Match Score</span>
                    </div>

                    <button
                      onClick={() => handleAssign(score.volunteerId)}
                      className={`px-4 py-2 rounded-xl font-semibold text-xs tracking-wide transition-all shadow-md ${
                        isBestMatch
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {isBestMatch ? 'Dispatch Now' : 'Select Volunteer'}
                    </button>
                  </div>
                </div>

                {/* Score breakdown bar */}
                <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-6 gap-1 text-[10px] text-slate-400">
                  <div>Dist: <span className="text-teal-300 font-mono">{score.breakdown.distanceScore}</span></div>
                  <div>Cap: <span className="text-amber-300 font-mono">{score.breakdown.capacityScore}</span></div>
                  <div>Avail: <span className="text-emerald-300 font-mono">{score.breakdown.availabilityScore}</span></div>
                  <div>Cert: <span className="text-lime-300 font-mono">{score.breakdown.certificationScore}</span></div>
                  <div>Urg: <span className="text-rose-300 font-mono">{score.breakdown.urgencyScore}</span></div>
                  <div>Rating: <span className="text-orange-300 font-mono">{score.breakdown.pastPerformanceScore}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

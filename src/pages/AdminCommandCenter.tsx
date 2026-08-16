import React, { useState } from 'react';
import { Shield, Zap, Layers, Navigation, Clock, AlertTriangle, Users, TrendingUp, CheckCircle2, MapPin, Award, Eye, FileText } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { DonationRequest } from '../types/foodbridge';
import { LiveMap } from '../components/LiveMap';
import { GoldenHourBadge } from '../components/GoldenHourBadge';
import { SmartMatchModal } from '../components/SmartMatchModal';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

export const AdminCommandCenter: React.FC = () => {
  const { requests, volunteers, hotspots, batches, triggerSmallBatchPooling, stats } = useFoodBridge();
  const [selectedMatchRequest, setSelectedMatchRequest] = useState<DonationRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'requests' | 'volunteers' | 'pooling' | 'analytics'>('map');
  const [selectedProofAudit, setSelectedProofAudit] = useState<DonationRequest | null>(null);

  const trendData = [
    { day: 'Mon', rescuedKg: 180, meals: 570 },
    { day: 'Tue', rescuedKg: 240, meals: 760 },
    { day: 'Wed', rescuedKg: 310, meals: 990 },
    { day: 'Thu', rescuedKg: 280, meals: 890 },
    { day: 'Fri', rescuedKg: 420, meals: 1340 },
    { day: 'Sat', rescuedKg: 550, meals: 1760 },
    { day: 'Sun', rescuedKg: 490, meals: 1560 }
  ];

  const categoryData = [
    { name: 'Veg Meals', value: 450, color: '#10B981' },
    { name: 'Non-Veg', value: 280, color: '#F59E0B' },
    { name: 'Bakery', value: 120, color: '#84CC16' },
    { name: 'Raw Produce', value: 190, color: '#0D9488' }
  ];

  const unassignedCount = requests.filter(r => r.status === 'requested').length;
  const smallRequestsCount = requests.filter(r => r.isSmallQuantity && r.status !== 'delivered').length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 pb-20 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Command Bar */}
      <div className="bg-[#1E293B] border-b border-slate-800 py-4 px-4 sm:px-8 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-2xl text-emerald-400 shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white">Admin Command Center</h1>
                <span className="bg-emerald-950 border border-emerald-600 text-emerald-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full animate-pulse">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-400">Real-time dispatch, Golden Hour SLA monitoring, volunteer tracking, and hotspot intelligence.</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'map' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Map
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'requests' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'volunteers' ? 'bg-teal-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Volunteer Tracking ({volunteers.length})
            </button>
            <button
              onClick={() => setActiveTab('pooling')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'pooling' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pooling ({batches.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                activeTab === 'analytics' ? 'bg-emerald-600 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Analytics
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Unassigned Requests</span>
              <div className="text-2xl font-black text-rose-400 font-mono mt-0.5">{unassignedCount}</div>
              <span className="text-[10px] text-slate-400">Needs dispatch</span>
            </div>
            <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Small Donations</span>
              <div className="text-2xl font-black text-amber-400 font-mono mt-0.5">{smallRequestsCount}</div>
              <span className="text-[10px] text-amber-400 font-medium">Eligible for batching</span>
            </div>
            <button
              onClick={triggerSmallBatchPooling}
              className="p-2.5 bg-amber-950 border border-amber-700 text-amber-300 hover:bg-amber-900 rounded-xl text-xs font-bold transition-all"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Active Volunteers</span>
              <div className="text-2xl font-black text-teal-400 font-mono mt-0.5">{stats.activeVolunteersCount} / {volunteers.length}</div>
              <span className="text-[10px] text-teal-400 font-medium">Verified & Available</span>
            </div>
            <div className="p-3 bg-teal-950/60 border border-teal-800 text-teal-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#1E293B] border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Golden Hour Success</span>
              <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">{stats.goldenHourSuccessRate}%</div>
              <span className="text-[10px] text-emerald-400 font-medium">SLA compliance</span>
            </div>
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: Live Interactive Map */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[540px]">
              <LiveMap
                requests={requests}
                volunteers={volunteers}
                hotspots={hotspots}
                onSelectRequest={req => setSelectedMatchRequest(req)}
              />
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between h-[540px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    Live Request Dispatch Desk
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">{requests.length} Total</span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
                  {requests.map(req => (
                    <div
                      key={req.id}
                      className="p-3.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-100">{req.donorName}</h4>
                        <GoldenHourBadge deadlineIso={req.goldenHourDeadline} size="sm" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="text-emerald-400 font-bold">{req.quantityKg} kg</span> • {req.foodType} • {req.location.areaName}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Status: <b className="text-slate-300">{req.status}</b>
                        </span>
                        
                        {req.status === 'requested' && (
                          <button
                            onClick={() => setSelectedMatchRequest(req)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-all"
                          >
                            Run Match Engine
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={triggerSmallBatchPooling}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all mt-3"
              >
                <Layers className="w-4 h-4" />
                <span>Auto-Batch Small Donations (&lt; 5kg)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Requests Table View */}
        {activeTab === 'requests' && (
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-100">All Donation Requests Desk</h3>
              <button onClick={triggerSmallBatchPooling} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow">
                Batch Small Requests
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">ID / Donor</th>
                    <th className="p-3">Food & Weight</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Golden Hour SLA</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white text-sm">{req.donorName}</div>
                        <div className="text-[10px] text-slate-400">{req.id}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-emerald-400">{req.quantityKg} kg ({req.estimatedServings} meals)</div>
                        <div className="text-slate-400">{req.foodType}</div>
                      </td>
                      <td className="p-3">{req.location.areaName}</td>
                      <td className="p-3">
                        <GoldenHourBadge deadlineIso={req.goldenHourDeadline} size="sm" />
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                          req.status === 'delivered' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {req.status === 'requested' && (
                          <button onClick={() => setSelectedMatchRequest(req)} className="px-3 py-1 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg">
                            Dispatch
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Volunteer Work Tracker & Delivery Status Audit */}
        {activeTab === 'volunteers' && (
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-400" />
                  Volunteer Performance & Delivery Status Audit Desk
                </h3>
                <p className="text-xs text-slate-400">Track all volunteer task assignments, pickup proof photos, and delivery status audit logs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {volunteers.map(vol => {
                const assignedReq = requests.find(r => r.assignedVolunteerId === vol.id || r.id === vol.currentAssignedRequestId);
                return (
                  <div key={vol.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-white text-base">{vol.name}</h4>
                          {vol.quizPassed && (
                            <span className="bg-teal-950 text-teal-300 text-[9px] font-bold px-2 py-0.5 rounded border border-teal-700">
                              Quiz Verified
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400">{vol.vehicleType} • {vol.vehicleCapacityKg} kg Cap</span>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold capitalize ${
                        vol.status === 'available' ? 'bg-teal-950 text-teal-300 border border-teal-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}>
                        {vol.status}
                      </span>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block">Total Rescues</span>
                        <span className="font-extrabold text-emerald-400 text-sm">{vol.totalRescues} Rescues</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Rating Score</span>
                        <span className="font-extrabold text-amber-400 text-sm">{vol.rating} / 5.0</span>
                      </div>
                    </div>

                    {/* Active assigned request info */}
                    {assignedReq ? (
                      <div className="p-3 bg-slate-950 border border-teal-500/40 rounded-xl space-y-2 text-xs">
                        <span className="text-[10px] uppercase font-bold text-teal-400">Current Assigned Mission</span>
                        <div className="font-bold text-white">{assignedReq.donorName}</div>
                        <div className="text-slate-400">{assignedReq.quantityKg} kg • Status: <b className="text-emerald-400">{assignedReq.status}</b></div>
                        
                        {(assignedReq.pickupProof || assignedReq.deliveryProof) && (
                          <button
                            onClick={() => setSelectedProofAudit(assignedReq)}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all mt-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Inspect Proof Photos</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs text-slate-500 text-center">
                        No active mission assigned
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Pooling */}
        {activeTab === 'pooling' && (
          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  Small-Quantity Batch Pooling Engine
                </h3>
                <p className="text-xs text-slate-400">Combines small donations (&lt; 5kg) into single multi-stop routes to prevent rejections.</p>
              </div>
              <button onClick={triggerSmallBatchPooling} className="px-5 py-2.5 bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow">
                Run Auto-Pooling Batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map(b => (
                <div key={b.id} className="bg-slate-900 p-5 rounded-2xl border border-amber-500/40 space-y-3">
                  <span className="text-xs font-bold text-amber-400 uppercase">{b.id} • {b.routeArea}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div><span className="text-slate-400 block">Weight</span><span className="font-bold text-emerald-400">{b.totalQuantityKg} kg</span></div>
                    <div><span className="text-slate-400 block">Servings</span><span className="font-bold text-amber-400">{b.totalServings} Meals</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Daily Food Rescue Volume (kg)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }} />
                    <Area type="monotone" dataKey="rescuedKg" stroke="#10B981" fill="#10B981" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Category Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                    <YAxis stroke="#64748B" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#F8FAFC' }} />
                    <Bar dataKey="value">
                      {categoryData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Smart Match Modal */}
      {selectedMatchRequest && (
        <SmartMatchModal
          request={selectedMatchRequest}
          onClose={() => setSelectedMatchRequest(null)}
        />
      )}

      {/* Proof Audit Inspection Modal */}
      {selectedProofAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Proof Audit: {selectedProofAudit.donorName}</h3>
            
            {selectedProofAudit.pickupProof && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase">Pickup Photo Proof</span>
                <img src={selectedProofAudit.pickupProof.photoUrl} alt="Pickup proof" className="w-full h-40 object-cover rounded-xl border border-slate-700" />
                <span className="text-[10px] text-slate-400 block">Timestamp: {selectedProofAudit.pickupProof.timestamp}</span>
              </div>
            )}

            {selectedProofAudit.deliveryProof && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-400 uppercase">Delivery Photo Proof</span>
                <img src={selectedProofAudit.deliveryProof.photoUrl} alt="Delivery proof" className="w-full h-40 object-cover rounded-xl border border-slate-700" />
                <span className="text-[10px] text-slate-400 block">Recipient: {selectedProofAudit.deliveryProof.recipientName}</span>
              </div>
            )}

            <button onClick={() => setSelectedProofAudit(null)} className="w-full py-2.5 bg-slate-800 text-white font-bold text-xs rounded-xl">
              Close Audit
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

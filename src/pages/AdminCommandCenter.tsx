import React, { useState } from 'react';
import { Shield, Zap, Layers, Navigation, Clock, AlertTriangle, Users, TrendingUp, CheckCircle2, MapPin, Award, Eye, FileText, Check } from 'lucide-react';
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
    { name: 'Veg Meals', value: 450, color: '#059669' },
    { name: 'Non-Veg', value: 280, color: '#D97706' },
    { name: 'Bakery', value: 120, color: '#65A30D' },
    { name: 'Raw Produce', value: 190, color: '#0D9488' }
  ];

  const unassignedCount = requests.filter(r => r.status === 'requested' || r.status === 'needy_demand').length;
  const smallRequestsCount = requests.filter(r => r.isSmallQuantity && r.status !== 'delivered').length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 pb-20 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Command Bar */}
      <div className="bg-white border-b border-slate-200/80 py-5 px-4 sm:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-700 shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Admin Command Center</h1>
                <span className="bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                  Live Operations
                </span>
              </div>
              <p className="text-xs text-slate-500">Real-time dispatch, Golden Hour SLA monitoring, volunteer tracking, and hotspot intelligence.</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'map' ? 'bg-[#0F5132] text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live Map
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'requests' ? 'bg-[#0F5132] text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Requests ({requests.length})
            </button>
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'volunteers' ? 'bg-teal-700 text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volunteer Tracking ({volunteers.length})
            </button>
            <button
              onClick={() => setActiveTab('pooling')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'pooling' ? 'bg-[#0F5132] text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pooling ({batches.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                activeTab === 'analytics' ? 'bg-[#0F5132] text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
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
          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Unassigned Requests</span>
              <div className="text-2xl font-black text-rose-600 font-mono mt-0.5">{unassignedCount}</div>
              <span className="text-[10px] text-slate-400">Needs dispatch</span>
            </div>
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Small Donations</span>
              <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">{smallRequestsCount}</div>
              <span className="text-[10px] text-amber-600 font-medium">Eligible for batching</span>
            </div>
            <button
              onClick={triggerSmallBatchPooling}
              className="p-2.5 bg-amber-50 border border-amber-300 text-amber-800 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Run Auto-Batch Pooling"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Active Volunteers</span>
              <div className="text-2xl font-black text-teal-700 font-mono mt-0.5">{stats.activeVolunteersCount} / {volunteers.length}</div>
              <span className="text-[10px] text-teal-600 font-medium">Verified & Available</span>
            </div>
            <div className="p-3 bg-teal-50 border border-teal-200 text-teal-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500">Golden Hour Success</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">{stats.goldenHourSuccessRate}%</div>
              <span className="text-[10px] text-emerald-600 font-medium">SLA compliance</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Tab 1: Live Interactive Map */}
        {activeTab === 'map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-[540px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md">
              <LiveMap
                requests={requests}
                volunteers={volunteers}
                hotspots={hotspots}
                onSelectRequest={req => setSelectedMatchRequest(req)}
              />
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-md flex flex-col justify-between h-[540px]">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    Live Request Dispatch Desk
                  </h3>
                  <span className="text-[10px] text-slate-500 font-bold">{requests.length} Total</span>
                </div>

                <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
                  {requests.map(req => (
                    <div
                      key={req.id}
                      className="p-3.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl space-y-2 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900">{req.donorName}</h4>
                        <GoldenHourBadge deadlineIso={req.goldenHourDeadline} size="sm" />
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="text-emerald-700 font-bold">{req.quantityKg} kg</span> • {req.foodType} • {req.location.areaName}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Status: <b className="text-slate-800">{req.status}</b>
                        </span>
                        
                        {(req.status === 'requested' || req.status === 'matched') && (
                          <button
                            onClick={() => setSelectedMatchRequest(req)}
                            className="px-3 py-1 bg-[#0F5132] hover:bg-[#064E3B] text-white font-bold text-xs rounded-lg transition-all shadow-sm"
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
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all mt-3"
              >
                <Layers className="w-4 h-4" />
                <span>Auto-Batch Small Donations (&lt; 5kg)</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Requests Table View */}
        {activeTab === 'requests' && (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">All Donation Requests Desk</h3>
              <button onClick={triggerSmallBatchPooling} className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all">
                Batch Small Requests
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID / Donor</th>
                    <th className="p-3">Food & Weight</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Golden Hour SLA</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-900 text-sm">{req.donorName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{req.id}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-emerald-700">{req.quantityKg} kg ({req.estimatedServings} meals)</div>
                        <div className="text-slate-500">{req.foodType}</div>
                      </td>
                      <td className="p-3 font-medium">{req.location.areaName}</td>
                      <td className="p-3">
                        <GoldenHourBadge deadlineIso={req.goldenHourDeadline} size="sm" />
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase border ${
                          req.status === 'delivered' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          req.status === 'in_transit' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                          req.status === 'accepted' ? 'bg-teal-50 text-teal-800 border-teal-300' :
                          'bg-rose-50 text-rose-800 border-rose-300'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        {(req.status === 'requested' || req.status === 'matched') && (
                          <button onClick={() => setSelectedMatchRequest(req)} className="px-3 py-1 bg-[#0F5132] hover:bg-[#064E3B] text-white font-bold text-xs rounded-lg shadow-sm transition-all">
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
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" />
                  Volunteer Performance & Delivery Status Audit Desk
                </h3>
                <p className="text-xs text-slate-500">Track all volunteer task assignments, pickup proof photos, and delivery status audit logs.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {volunteers.map(vol => {
                const assignedReq = requests.find(r => r.assignedVolunteerId === vol.id || r.id === vol.currentAssignedRequestId);
                const initials = vol.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

                return (
                  <div
                    key={vol.id}
                    className="bg-gradient-to-b from-[#F0FDFA] via-white to-[#F8FAFC] border-2 border-slate-900 rounded-3xl p-5 space-y-4 shadow-lg hover:shadow-2xl transition-all relative overflow-hidden"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-teal-950 text-[#84CC16] font-black text-sm flex items-center justify-center border-2 border-slate-900 shadow-sm shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 text-base">{vol.name}</h4>
                            {vol.quizPassed && (
                              <span className="bg-teal-100 text-teal-900 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-teal-300">
                                ✓ Verified
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-600 font-semibold block">{vol.vehicleType} • {vol.vehicleCapacityKg} kg Cap</span>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-xl text-xs font-black capitalize border-2 shadow-xs shrink-0 ${
                        vol.status === 'available'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                          : vol.status === 'busy'
                          ? 'bg-amber-100 text-amber-950 border-amber-600 animate-pulse'
                          : 'bg-slate-200 text-slate-800 border-slate-400'
                      }`}>
                        {vol.status === 'available' ? '● Available' : vol.status === 'busy' ? '⚡ On Mission' : 'Offline'}
                      </span>
                    </div>

                    {/* Colored Stats Metrics Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200/90 shadow-2xs">
                        <span className="text-emerald-800 block font-bold text-[10px] uppercase">Total Rescues</span>
                        <span className="font-black text-emerald-950 text-base font-mono">{vol.totalRescues} Rescues</span>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200/90 shadow-2xs">
                        <span className="text-amber-800 block font-bold text-[10px] uppercase">Rating Score</span>
                        <span className="font-black text-amber-950 text-base font-mono">★ {vol.rating} / 5.0</span>
                      </div>

                      <div className="col-span-2 bg-blue-50/90 p-2.5 rounded-2xl border border-blue-200 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                          <span className="font-extrabold text-blue-950 truncate text-[11px]">
                            {vol.currentLocation?.areaName || 'Base Area'}
                          </span>
                        </div>
                        <span className="text-[10px] bg-blue-100 text-blue-900 font-extrabold px-2.5 py-0.5 rounded-full border border-blue-300 shrink-0">
                          {vol.serviceRadiusKm || 10} km Radius
                        </span>
                      </div>
                    </div>

                    {/* Active Assigned Request Info / Idle State */}
                    {assignedReq ? (
                      <div className="p-4 bg-gradient-to-r from-teal-950 via-teal-900 to-slate-900 text-white rounded-2xl border-2 border-teal-500 shadow-md space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-black tracking-wider text-[#84CC16] flex items-center gap-1">
                            <Zap className="w-3 h-3" /> Active Rescue Mission
                          </span>
                          <span className="bg-teal-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                            {assignedReq.status}
                          </span>
                        </div>
                        <div>
                          <div className="font-extrabold text-white text-sm">{assignedReq.donorName}</div>
                          <div className="text-teal-200 text-xs mt-0.5">
                            {assignedReq.quantityKg} kg ({assignedReq.foodType}) • {assignedReq.location.areaName}
                          </div>
                        </div>
                        
                        {(assignedReq.pickupProof || assignedReq.deliveryProof) && (
                          <button
                            onClick={() => setSelectedProofAudit(assignedReq)}
                            className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs rounded-xl shadow flex items-center justify-center gap-2 transition-all mt-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Inspect Verification Proof Photos</span>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-100 border border-slate-200 rounded-2xl text-xs text-slate-500 font-bold text-center flex items-center justify-center gap-1.5">
                        <span>Standby Mode • Available for live rescue dispatch</span>
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
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-600" />
                  Small-Quantity Batch Pooling Engine
                </h3>
                <p className="text-xs text-slate-500">Combines small donations (&lt; 5kg) into single multi-stop routes to prevent rejections.</p>
              </div>
              <button onClick={triggerSmallBatchPooling} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow transition-all">
                Run Auto-Pooling Batch
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map(b => (
                <div key={b.id} className="bg-amber-50/50 p-5 rounded-2xl border border-amber-200 space-y-3 shadow-sm">
                  <span className="text-xs font-bold text-amber-800 uppercase">{b.id} • {b.routeArea}</span>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-amber-100">
                    <div><span className="text-slate-500 block">Weight</span><span className="font-bold text-emerald-700">{b.totalQuantityKg} kg</span></div>
                    <div><span className="text-slate-500 block">Servings</span><span className="font-bold text-amber-700">{b.totalServings} Meals</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Analytics */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Daily Food Rescue Volume (kg)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Area type="monotone" dataKey="rescuedKg" stroke="#059669" fill="#10B981" fillOpacity={0.15} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-md space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-600" />
                Category Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                    <YAxis stroke="#94A3B8" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
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
          <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Proof Audit: {selectedProofAudit.donorName}</h3>
            
            {selectedProofAudit.pickupProof && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700 uppercase">Pickup Photo Proof</span>
                <img src={selectedProofAudit.pickupProof.photoUrl} alt="Pickup proof" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                <span className="text-[10px] text-slate-500 block">Timestamp: {selectedProofAudit.pickupProof.timestamp}</span>
              </div>
            )}

            {selectedProofAudit.deliveryProof && (
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-700 uppercase">Delivery Photo Proof</span>
                <img src={selectedProofAudit.deliveryProof.photoUrl} alt="Delivery proof" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                <span className="text-[10px] text-slate-500 block">Recipient: {selectedProofAudit.deliveryProof.recipientName}</span>
              </div>
            )}

            <button onClick={() => setSelectedProofAudit(null)} className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all">
              Close Audit
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

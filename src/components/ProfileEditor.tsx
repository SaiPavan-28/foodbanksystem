import React, { useState } from 'react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { LocationPickerMap } from './LocationPickerMap';
import { UserCircle, Save, CheckCircle2, Phone, MapPin, Navigation, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfileEditor: React.FC = () => {
  const { authUser, updateProfile } = useFoodBridge();
  
  const isVolunteer = authUser?.role === 'volunteer';
  const isDonorOrNgo = authUser?.role === 'donor' || authUser?.role === 'ngo';

  const [name, setName] = useState(authUser?.establishmentName || authUser?.name || '');
  const [phone, setPhone] = useState(authUser?.phone || '');
  const [vehicleType, setVehicleType] = useState(authUser?.vehicleType || 'Two Wheeler (Bike)');
  const [serviceRadiusKm, setServiceRadiusKm] = useState(authUser?.serviceRadiusKm || 10);
  
  const [locationLat, setLocationLat] = useState(authUser?.location?.lat || 13.0400);
  const [locationLng, setLocationLng] = useState(authUser?.location?.lng || 80.2300);
  const [address, setAddress] = useState(authUser?.location?.address || '');
  const [areaName, setAreaName] = useState(authUser?.location?.areaName || '');

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    const updateData: any = {
      phone,
      location: { lat: locationLat, lng: locationLng, address, areaName }
    };

    if (isDonorOrNgo) {
      updateData.establishmentName = name;
      updateData.name = name; 
    } else {
      updateData.name = name;
    }

    if (isVolunteer) {
      updateData.vehicleType = vehicleType;
      updateData.serviceRadiusKm = serviceRadiusKm;
    }

    const res = await updateProfile(updateData);
    setIsSaving(false);

    if (res.success) {
      setSuccess(true);
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      alert(res.error || 'Failed to update profile');
    }
  };

  if (!authUser) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-8">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <UserCircle className="w-6 h-6 text-emerald-600" />
          Edit Profile
        </h2>
        <p className="text-xs text-slate-500 mt-1">Update your registration details, location, and operational preferences.</p>
      </div>

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-sm font-bold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                {isDonorOrNgo ? 'Establishment / Name' : 'Full Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
                <UserCircle className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                />
                <Phone className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {isVolunteer && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vehicle Type</label>
                  <div className="relative">
                    <select
                      value={vehicleType}
                      onChange={e => setVehicleType(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Two Wheeler (Bike)">Two Wheeler (Bike)</option>
                      <option value="Three Wheeler (Auto)">Three Wheeler (Auto)</option>
                      <option value="Mini Van / Truck">Mini Van / Truck</option>
                      <option value="Refrigerated Van">Refrigerated Van</option>
                    </select>
                    <Truck className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Service Radius (km)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      max={999}
                      value={serviceRadiusKm}
                      onChange={e => setServiceRadiusKm(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                    />
                    <Navigation className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </>
            )}
            
            <div className="pt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={authUser.email}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-4">
             <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center gap-1.5">
               <MapPin className="w-4 h-4" /> Base Location
             </label>
             <div className="h-[350px] rounded-2xl overflow-hidden border border-slate-200">
               <LocationPickerMap
                 value={{ lat: locationLat, lng: locationLng, address, areaName }}
                 onChange={(loc) => {
                   setLocationLat(loc.lat);
                   setLocationLng(loc.lng);
                   setAddress(loc.address);
                   setAreaName(loc.areaName);
                 }}
                 height={350}
                 accentColor={isVolunteer ? "teal" : "emerald"}
               />
             </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full md:w-auto px-8 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
        >
          {isSaving ? (
             <span className="animate-pulse">Saving...</span>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Profile Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

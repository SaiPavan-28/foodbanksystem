import React, { useState } from 'react';
import { X, HeartHandshake, Utensils, MapPin, Phone, Users, Clock, AlertCircle, CheckCircle2, Sparkles, Building } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { FoodType } from '../types/foodbridge';
import confetti from 'canvas-confetti';

interface FoodReliefModalProps {
  onClose: () => void;
}

export const FoodReliefModal: React.FC<FoodReliefModalProps> = ({ onClose }) => {
  const { addDonationRequest } = useFoodBridge();

  const [shelterName, setShelterName] = useState('Hope Children Shelter');
  const [contactPerson, setContactPerson] = useState('Anitha (Shelter In-charge)');
  const [phone, setPhone] = useState('+91 98400 55443');
  const [areaName, setAreaName] = useState('T. Nagar');
  const [address, setAddress] = useState('88 Usman Road, T. Nagar, Chennai');
  const [servingsNeeded, setServingsNeeded] = useState<number>(50);
  const [foodType, setFoodType] = useState<FoodType>('Veg Meals');
  const [urgency, setUrgency] = useState<'emergency' | 'evening' | 'daily'>('emergency');
  const [notes, setNotes] = useState('50 children at shelter. Hot meals needed for dinner.');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let lat = 13.0400;
    let lng = 80.2300;
    if (areaName === 'Velachery') { lat = 12.9800; lng = 80.2200; }
    if (areaName === 'Guindy') { lat = 13.0300; lng = 80.2100; }
    if (areaName === 'Mylapore') { lat = 13.0550; lng = 80.2500; }

    const approxKg = Math.ceil(servingsNeeded / 3);

    addDonationRequest({
      donorName: `${shelterName} (Food Relief Request)`,
      donorPhone: phone,
      foodType,
      quantityKg: approxKg,
      estimatedServings: servingsNeeded,
      photoUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&auto=format&fit=crop&q=60',
      cookedTimestamp: new Date().toISOString(),
      goldenHourDeadline: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
      location: { lat, lng, address, areaName },
      notes: `[FOOD RELIEF REQUEST] ${notes} (Contact: ${contactPerson})`
    });

    setSubmitted(true);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4">
      <div className="bg-white border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-slate-900 relative space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-slate-900">Request Food Relief</h2>
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                For Shelters, NGOs, Orphanages & Needy Beneficiaries
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 rounded-xl bg-slate-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Shelter / NGO / Organization Name
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={shelterName}
                  onChange={e => setShelterName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contact Person</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Locality</label>
                <select
                  value={areaName}
                  onChange={e => setAreaName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="T. Nagar">T. Nagar</option>
                  <option value="Velachery">Velachery</option>
                  <option value="Guindy">Guindy</option>
                  <option value="Mylapore">Mylapore</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Servings Needed</label>
                <input
                  type="number"
                  min={5}
                  max={500}
                  value={servingsNeeded}
                  onChange={e => setServingsNeeded(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Delivery Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Food Category</label>
                <select
                  value={foodType}
                  onChange={e => setFoodType(e.target.value as FoodType)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="Veg Meals">Veg Meals</option>
                  <option value="Non-Veg Meals">Non-Veg Meals</option>
                  <option value="Raw Grocery/Produce">Raw Grocery/Produce</option>
                  <option value="Packaged Food">Packaged Food</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Urgency Level</label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="emergency">⚡ Emergency (Immediate)</option>
                  <option value="evening">🌆 Today Evening</option>
                  <option value="daily">📅 Scheduled Daily</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Notes / Requirements</label>
              <textarea
                rows={2}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-xl transition-all"
            >
              Submit Food Relief Request & Broadcast Match
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700">Request Broadcasted!</span>
              <h3 className="text-xl font-black text-slate-900">Food Relief Request Submitted</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Your request for <b>{servingsNeeded} meals</b> at <b>{shelterName}</b> has been broadcasted to nearby volunteers and highlighted on the Admin Dispatch map!
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all"
            >
              Close & Track Live Progress
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

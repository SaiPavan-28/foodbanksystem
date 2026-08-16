import React, { useState, useEffect } from 'react';
import { Utensils, Shield, Users, Lock, Mail, ArrowRight, Award, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { UserRole } from '../types/foodbridge';
import { VolunteerQuizModal } from '../components/VolunteerQuizModal';

export const LoginPage: React.FC = () => {
  const { login, setCurrentRole, targetLoginRole } = useFoodBridge();
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');
  const [email, setEmail] = useState('donor@foodbridge.org');
  const [password, setPassword] = useState('password123');
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);

  useEffect(() => {
    if (targetLoginRole === 'volunteer' || targetLoginRole === 'admin' || targetLoginRole === 'donor') {
      setSelectedRole(targetLoginRole);
      setEmail(`${targetLoginRole}@foodbridge.org`);
    }
  }, [targetLoginRole]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(`${role}@foodbridge.org`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole, email);
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    login(role, `${role}@foodbridge.org`);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Brand & Role Identity */}
        <div className="space-y-6 flex flex-col justify-between relative z-10 border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-6">
          <div>
            <button
              onClick={() => setCurrentRole('public')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white font-bold mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Platform</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg ring-2 ring-emerald-400/30">
                <Utensils className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <h1 className="font-extrabold text-2xl tracking-tight text-white">FoodBridge</h1>
                <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Role Authorization Portal</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed">
              Sign in with your authorized credentials to access your role workspace.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <Utensils className="w-4 h-4 text-emerald-400" />
              <span><b>Donor Portal:</b> Place food requests & track live Swiggy orders.</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <Users className="w-4 h-4 text-teal-400" />
              <span><b>Volunteer App:</b> Accept dispatch tasks & complete hygiene proof.</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <Shield className="w-4 h-4 text-amber-400" />
              <span><b>Admin Operations:</b> Live Leaflet map & SLA dispatch control desk.</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowQuizModal(true)}
              className="w-full py-3 bg-teal-950 hover:bg-teal-900 border border-teal-600 text-teal-300 text-xs font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Award className="w-4 h-4 text-[#84CC16]" />
              <span>New Volunteer? Take Qualification Quiz</span>
            </button>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="space-y-6 relative z-10 flex flex-col justify-center">
          
          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => handleRoleSelect('donor')}
              className={`py-2 rounded-xl transition-all ${selectedRole === 'donor' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400'}`}
            >
              Donor Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('volunteer')}
              className={`py-2 rounded-xl transition-all ${selectedRole === 'volunteer' ? 'bg-teal-600 text-white shadow' : 'text-slate-400'}`}
            >
              Volunteer Login
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2 rounded-xl transition-all ${selectedRole === 'admin' ? 'bg-slate-700 text-white shadow' : 'text-slate-400'}`}
            >
              Admin Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                {selectedRole.toUpperCase()} Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all scale-100 hover:scale-[1.01]"
              id="login-submit-btn"
            >
              <span>Authorize & Sign In as {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* One-Click Presets */}
          <div className="border-t border-slate-800 pt-4 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Instant 1-Click Role Login</span>
            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('donor')}
                className="px-3 py-1.5 bg-amber-950 text-amber-300 border border-amber-700/80 rounded-xl font-bold hover:bg-amber-900 transition-all"
              >
                Donor Login
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('volunteer')}
                className="px-3 py-1.5 bg-teal-950 text-teal-300 border border-teal-700/80 rounded-xl font-bold hover:bg-teal-900 transition-all"
              >
                Volunteer Login
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-3 py-1.5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold hover:bg-slate-700 transition-all"
              >
                Admin Login
              </button>
            </div>
          </div>

        </div>
      </div>

      {showQuizModal && (
        <VolunteerQuizModal
          onClose={() => setShowQuizModal(false)}
          onSuccess={() => {
            login('volunteer', 'volunteer@foodbridge.org');
          }}
        />
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Utensils, Shield, Users, Lock, Mail, ArrowRight, Award, ArrowLeft } from 'lucide-react';
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
    <div className="min-h-[calc(100vh-64px)] bg-[#FAF8F5] text-slate-900 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        
        {/* Soft Background Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Brand & Role Info */}
        <div className="space-y-6 flex flex-col justify-between relative z-10 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6">
          <div>
            <button
              onClick={() => setCurrentRole('public')}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-bold mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Public Platform</span>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F5132] to-[#059669] flex items-center justify-center shadow-lg ring-2 ring-emerald-400/30">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-extrabold text-2xl tracking-tight text-slate-900">FoodBridge</h1>
                <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">Role Authorization Portal</p>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              Sign in with your authorized credentials to access your role workspace.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <Utensils className="w-4.5 h-4.5 text-emerald-600" />
              <span><b>Donor Portal:</b> Place food requests & track live Swiggy orders.</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <Users className="w-4.5 h-4.5 text-teal-600" />
              <span><b>Volunteer App:</b> Accept dispatch tasks & complete hygiene proof.</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <Shield className="w-4.5 h-4.5 text-amber-600" />
              <span><b>Admin Operations:</b> Live Leaflet map & SLA dispatch control desk.</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowQuizModal(true)}
              className="w-full py-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Award className="w-4 h-4 text-emerald-700" />
              <span>New Volunteer? Take Qualification Quiz</span>
            </button>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="space-y-6 relative z-10 flex flex-col justify-center">
          
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => handleRoleSelect('donor')}
              className={`py-2.5 rounded-xl transition-all ${
                selectedRole === 'donor' ? 'bg-[#0F5132] text-white shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donor
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('volunteer')}
              className={`py-2.5 rounded-xl transition-all ${
                selectedRole === 'volunteer' ? 'bg-teal-700 text-white shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2.5 rounded-xl transition-all ${
                selectedRole === 'admin' ? 'bg-slate-900 text-white shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {selectedRole.toUpperCase()} Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#0F5132] to-[#059669] hover:from-[#064E3B] hover:to-[#047857] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all scale-100 hover:scale-[1.01]"
              id="login-submit-btn"
            >
              <span>Authorize & Sign In as {selectedRole.toUpperCase()}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Demo Logins */}
          <div className="border-t border-slate-100 pt-4 space-y-2 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Instant 1-Click Demo Login</span>
            <div className="flex items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('donor')}
                className="px-3.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-300 rounded-xl font-bold hover:bg-amber-100 transition-all"
              >
                Donor Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('volunteer')}
                className="px-3.5 py-1.5 bg-teal-50 text-teal-900 border border-teal-300 rounded-xl font-bold hover:bg-teal-100 transition-all"
              >
                Volunteer Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-3.5 py-1.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
              >
                Admin Demo
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

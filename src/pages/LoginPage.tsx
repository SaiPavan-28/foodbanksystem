import React, { useState, useEffect } from 'react';
import { Utensils, Shield, Users, Lock, Mail, ArrowRight, Award, ArrowLeft, UserPlus, LogIn, CheckCircle2, AlertTriangle, Phone, Building, Truck, AlertCircle } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';
import { UserRole } from '../types/foodbridge';
import { VolunteerQuizModal } from '../components/VolunteerQuizModal';

export const LoginPage: React.FC = () => {
  const { login, registerUser, setCurrentRole, targetLoginRole, passVolunteerQuiz } = useFoodBridge();

  // Mode: Sign In vs Register
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('donor');

  // Sign In State
  const [email, setEmail] = useState('donor@foodbridge.org');
  const [password, setPassword] = useState('password123');

  // Registration State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regEstablishment, setRegEstablishment] = useState('');
  const [regVehicleType, setRegVehicleType] = useState('Two Wheeler (Bike)');
  const [regAreaName, setRegAreaName] = useState('T. Nagar');

  // Modal & Error State
  const [authError, setAuthError] = useState<string | null>(null);
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
    setAuthError(null);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const res = login(selectedRole, email, password);
    if (!res.success && res.error) {
      setAuthError(res.error);
    }
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    setAuthError(null);
    const demoEmail = `${role}@foodbridge.org`;
    const res = login(role, demoEmail, 'password123');
    if (!res.success && res.error) {
      setAuthError(res.error);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (selectedRole === 'volunteer') {
      // Volunteer Registration Gate: Must pass qualification quiz first!
      setShowQuizModal(true);
    } else {
      // Donor or Admin Registration
      const res = registerUser({
        name: regName || 'Surplus Food Donor',
        email: regEmail,
        password: regPassword,
        role: selectedRole,
        phone: regPhone,
        establishmentName: regEstablishment || regName
      });

      if (!res.success && res.error) {
        setAuthError(res.error);
      }
    }
  };

  const handleQuizSuccess = (score?: number) => {
    setShowQuizModal(false);
    passVolunteerQuiz(score || 100);

    const res = registerUser({
      name: regName || 'Field Rescue Volunteer',
      email: regEmail || `vol_${Date.now()}@foodbridge.org`,
      password: regPassword || 'password123',
      role: 'volunteer',
      phone: regPhone,
      vehicleType: regVehicleType,
      quizPassed: true
    });

    if (!res.success && res.error) {
      setAuthError(res.error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#FAF8F5] text-slate-900 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        
        {/* Soft Background Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Brand & Overview */}
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
                <p className="text-xs text-emerald-700 font-bold uppercase tracking-wider">
                  {authMode === 'signin' ? 'Existing User Sign In' : 'New User Account Registration'}
                </p>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed font-medium">
              {authMode === 'signin'
                ? 'Sign in with your registered credentials or select a 1-click demo account below.'
                : 'Create your FoodBridge account. Volunteers must complete mandatory safety qualification.'}
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-700">
            <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <Utensils className="w-4.5 h-4.5 text-emerald-600" />
              <span><b>Donors:</b> Submit surplus food & earn +100 welcome credit points.</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <Users className="w-4.5 h-4.5 text-teal-600" />
              <span><b>Volunteers:</b> Must pass 4-question Food Safety Quiz (&ge; 75%) to qualify.</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <Shield className="w-4.5 h-4.5 text-amber-600" />
              <span><b>Admin Operations:</b> Live SLA dispatch tracking & volunteer audit desk.</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>100% Verified Credential Authentication</span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms & Mode Switcher */}
        <div className="space-y-6 relative z-10 flex flex-col justify-center">
          
          {/* Main Mode Toggle: Sign In vs Register */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setAuthMode('signin'); setAuthError(null); }}
              className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                authMode === 'signin' ? 'bg-slate-900 text-white shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In (Existing User)</span>
            </button>

            <button
              type="button"
              onClick={() => { setAuthMode('register'); setAuthError(null); }}
              className={`py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                authMode === 'register' ? 'bg-[#0F5132] text-white shadow-md font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register (New User)</span>
            </button>
          </div>

          {/* Role Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => handleRoleSelect('donor')}
              className={`py-2 rounded-xl transition-all ${
                selectedRole === 'donor' ? 'bg-[#0F5132] text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donor
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('volunteer')}
              className={`py-2 rounded-xl transition-all ${
                selectedRole === 'volunteer' ? 'bg-teal-700 text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`py-2 rounded-xl transition-all ${
                selectedRole === 'admin' ? 'bg-slate-900 text-white shadow font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Inline Error Alert */}
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-xs text-rose-900 font-bold flex items-start gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form 1: Existing User Sign In */}
          {authMode === 'signin' && (
            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
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
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
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
                className="w-full py-4 bg-gradient-to-r from-[#0F5132] to-[#059669] hover:from-[#064E3B] hover:to-[#047857] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>Authenticate & Sign In as {selectedRole.toUpperCase()}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Form 2: New User Registration */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98400 12345"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {selectedRole === 'donor' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Establishment / Marriage Hall / Hotel</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Royal Palace Marriage Hall"
                      value={regEstablishment}
                      onChange={e => setRegEstablishment(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    />
                  </div>
                </div>
              )}

              {selectedRole === 'volunteer' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vehicle Type</label>
                    <select
                      value={regVehicleType}
                      onChange={e => setRegVehicleType(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    >
                      <option value="Two Wheeler (Bike)">Two Wheeler (Bike)</option>
                      <option value="Three Wheeler (Auto)">Three Wheeler (Auto)</option>
                      <option value="Four Wheeler (Van)">Four Wheeler (Van)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Preferred Locality</label>
                    <select
                      value={regAreaName}
                      onChange={e => setRegAreaName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                    >
                      <option value="T. Nagar">T. Nagar</option>
                      <option value="Velachery">Velachery</option>
                      <option value="Guindy">Guindy</option>
                      <option value="Mylapore">Mylapore</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                />
              </div>

              {selectedRole === 'volunteer' && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-[11px] text-amber-900 space-y-1">
                  <span className="font-extrabold flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-700" /> Mandatory Volunteer Criteria Gate
                  </span>
                  <p>
                    New volunteers must score <b>75% or higher</b> on the Food Safety & Golden Hour Qualification Test to verify account status.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all"
              >
                <span>
                  {selectedRole === 'volunteer' ? 'Take Qualification Quiz & Register' : 'Complete Registration (+100 Pts)'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick 1-Click Demo Logins */}
          {authMode === 'signin' && (
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
          )}

        </div>
      </div>

      {showQuizModal && (
        <VolunteerQuizModal
          onClose={() => setShowQuizModal(false)}
          onSuccess={handleQuizSuccess}
        />
      )}
    </div>
  );
};

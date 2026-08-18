import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, HeartHandshake, Clock, Users, ArrowRight, Award, Zap, CheckCircle2, TrendingUp, Utensils, Heart, LogIn, Sparkles, Navigation, Shield, Compass } from 'lucide-react';
import { useFoodBridge } from '../context/FoodBridgeContext';

interface ScrollRevealProps {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ children, delayMs = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) observer.unobserve(domRef.current);
          }
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const PublicLanding: React.FC = () => {
  const { openLoginForRole, stats } = useFoodBridge();

  const workflowSteps = [
    {
      num: 1,
      badgeColor: 'bg-amber-100 text-amber-800',
      title: 'Donor Request',
      desc: 'Donors upload food photos, quantity, cook time, and Golden Hour deadline window.',
      icon: Utensils
    },
    {
      num: 2,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      title: 'Smart Matching',
      desc: '6-factor deterministic engine matches nearby available volunteers by distance & vehicle capacity.',
      icon: Zap
    },
    {
      num: 3,
      badgeColor: 'bg-teal-100 text-teal-800',
      title: 'Safety Inspection',
      desc: 'Volunteers perform packaging checks, freshness verification, and timestamped photo proof capture.',
      icon: ShieldCheck
    },
    {
      num: 4,
      badgeColor: 'bg-[#DCFCE7] text-emerald-900',
      title: 'Hotspot Delivery',
      desc: 'Food is delivered directly to verified shelters with manual recipient confirmation & credit points.',
      icon: HeartHandshake
    }
  ];

  const featureCards = [
    {
      icon: Clock,
      title: 'Golden Hour AI SLA',
      desc: 'Strict countdown timers prevent quality degradation and ensure hot meals reach shelters within 180 minutes.',
      gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent border-emerald-200'
    },
    {
      icon: Navigation,
      title: 'Live Swiggy-Style Tracking',
      desc: '4-stage real-time delivery status synced simultaneously across Donor, Active Volunteer, and NGO dashboards.',
      gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent border-teal-200'
    },
    {
      icon: Shield,
      title: 'Hygiene & Quality Audit',
      desc: 'Mandatory 4-point volunteer hygiene checklist and photo proof capture before vehicle dispatch.',
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent border-amber-200'
    },
    {
      icon: Heart,
      title: 'Direct NGO Dispatch',
      desc: 'FIFO queue auto-matching links surplus food donors directly with registered shelters and orphanages.',
      gradient: 'from-lime-500/10 via-emerald-500/5 to-transparent border-lime-200'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-900 selection:bg-emerald-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-[#FAF8F5] via-white to-[#F0FDF4] border-b border-slate-200/80">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Text & Action Buttons */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-extrabold shadow-sm">
                <Heart className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>Share Food, Share Hope • Golden Hour Rescue Platform</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
                  <span className="text-[#0F5132] block">FOOD DONATION</span>
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 bg-clip-text text-transparent">
                    Share Food, Share Hope
                  </span>
                </h1>
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-medium pt-2">
                  Transforming surplus food into timely Golden Hour rescues. Connecting donors, field volunteers, shelters, and hunger hotspots with zero delay.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                
                {/* 1. NGO Food Relief Sign In */}
                <button
                  onClick={() => openLoginForRole('ngo')}
                  className="px-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all scale-100 hover:scale-105"
                  id="hero-ngo-sign-in-btn"
                >
                  <HeartHandshake className="w-4.5 h-4.5" />
                  <span>NGO / Shelter Food Relief Sign In</span>
                </button>

                {/* 2. Donate Surplus Food */}
                <button
                  onClick={() => openLoginForRole('donor')}
                  className="px-6 py-4 bg-[#0F5132] hover:bg-[#064E3B] text-white font-black text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                >
                  <Utensils className="w-4 h-4" />
                  <span>Donate Surplus Food</span>
                </button>

                {/* 3. Join as Volunteer */}
                <button
                  onClick={() => openLoginForRole('volunteer')}
                  className="px-6 py-4 bg-teal-950 hover:bg-teal-900 border border-teal-700 text-teal-200 font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Users className="w-4 h-4 text-[#84CC16]" />
                  <span>Join as Volunteer</span>
                </button>

                {/* 4. Sign In / Register */}
                <button
                  onClick={() => openLoginForRole('donor')}
                  className="px-5 py-4 bg-white hover:bg-emerald-50 border-2 border-emerald-600 text-emerald-900 font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:scale-105"
                  id="hero-sign-in-register-btn"
                >
                  <LogIn className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  <span>Sign In / Register</span>
                </button>

              </div>

              {/* Quick Feature Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Verified Food Safety
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-600" /> Golden Hour Countdown SLA
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" /> Small-Quantity Batch Pooling
                </div>
              </div>

            </div>

            {/* Right Column: Hero Graphic with Scroll Reveal */}
            <div className="lg:col-span-5 relative">
              <ScrollReveal delayMs={200}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white p-2 transform transition-all duration-300 hover:scale-[1.02]">
                  <img
                    src="/hero-donation.png"
                    alt="FOOD DONATION - Share Food, Share Hope"
                    className="w-full h-auto rounded-2xl object-cover"
                  />

                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">No Food Waste Platform</span>
                        <span className="text-[10px] text-slate-500 font-medium">Connecting Donors, Volunteers & Shelters</span>
                      </div>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] uppercase font-black px-2.5 py-1 rounded-lg">
                      Active
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>

          {/* Live Impact Counters Banner with Scroll Reveal Stagger */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-950 text-white border border-slate-800 rounded-3xl shadow-2xl">
            <ScrollReveal delayMs={100} className="w-full">
              <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
                <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">{stats.totalRescuedKg} kg</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Surplus Food Rescued</div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={250} className="w-full">
              <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
                <div className="text-3xl sm:text-4xl font-black text-amber-400 font-mono">{stats.totalMealsServed}</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Nutritious Meals Served</div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={400} className="w-full">
              <div className="text-center p-3 border-r border-slate-800/80 last:border-0">
                <div className="text-3xl sm:text-4xl font-black text-teal-400 font-mono">{stats.fulfillmentRate}%</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Fulfillment Efficiency</div>
              </div>
            </ScrollReveal>

            <ScrollReveal delayMs={550} className="w-full">
              <div className="text-center p-3">
                <div className="text-3xl sm:text-4xl font-black text-[#84CC16] font-mono">{stats.goldenHourSuccessRate}%</div>
                <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">Golden Hour Compliance</div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* Feature Spotlight Section */}
      <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal delayMs={100}>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-teal-700 bg-teal-100 px-3 py-1 rounded-full border border-teal-300">
              Platform Features
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Why FoodBridge Leads Food Rescue</h2>
            <p className="text-slate-600 text-sm font-medium">
              Eliminating manual delay through automated supply-demand matching & live Swiggy tracking.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((feat, idx) => {
            const IconComp = feat.icon;
            return (
              <ScrollReveal key={idx} delayMs={idx * 150}>
                <div className={`h-full bg-gradient-to-b ${feat.gradient} bg-white p-6 rounded-3xl border shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 space-y-4 flex flex-col justify-between`}>
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="pt-2 text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* How Golden Hour Rescue Works with Staggered Scroll Transitions */}
      <section className="py-16 md:py-24 bg-white border-t border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <ScrollReveal delayMs={100}>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                4-Stage Rescue Workflow
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900">How FoodBridge Operates in Real Time</h2>
              <p className="text-slate-600 text-sm font-medium">
                Bridging surplus food providers and vulnerable communities before food quality degrades.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {workflowSteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <ScrollReveal key={step.num} delayMs={index * 180}>
                  <div className="h-full bg-[#FAF8F5] p-6 rounded-3xl border border-slate-200/80 shadow-lg space-y-4 hover:shadow-2xl transition-all transform hover:-translate-y-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl ${step.badgeColor} flex items-center justify-center font-black text-xl shadow-sm`}>
                          {step.num}
                        </div>
                        <StepIcon className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="font-extrabold text-lg text-slate-900">{step.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                    <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Stage {step.num} Verified</span>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-bold text-slate-200">FoodBridge — Code for Good Hackathon Platform for No Food Waste</p>
          <p className="text-slate-500">Transforming manual helpline & spreadsheet coordination into real-time food rescue intelligence.</p>
        </div>
      </footer>

    </div>
  );
};

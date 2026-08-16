"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Activity, 
  Building, 
  Users, 
  AlertCircle, 
  Droplet, 
  Pill, 
  Heart, 
  X, 
  Stethoscope, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  Download,
  Laptop,
  Smartphone,
  CheckCircle2,
  Zap,
  MapPin,
  Clock,
  ChevronRight,
  Layers,
  HeartPulse
} from 'lucide-react';
import { ROLE_KEYS, ROLE_DEFINITIONS } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const selectRole = (role: string, route: string) => {
    localStorage.setItem('maha_role', role);
    router.push(route);
  };

  const handleDownloadApp = (platform: 'windows' | 'android') => {
    const filename = platform === 'windows' ? 'MahaArogya_Desktop_v1.0.exe' : 'MahaArogya_Android_v1.0.apk';
    const a = document.createElement('a');
    a.href = `/${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowDownloadModal(false);
  };

  const adminRoles = [
    { 
      id: ROLE_KEYS.HOSPITAL_ADMIN, 
      name: 'Hospital Administrator', 
      desc: 'Hospital operations, beds, staff, queues, alerts & AI insights',
      icon: Building, 
      badge: 'Command Center',
      color: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30', 
      route: '/dashboard' 
    },
    { 
      id: ROLE_KEYS.DOCTOR, 
      name: 'Doctor / Medical Officer', 
      desc: 'Incoming cases, triage context, patient queue & Rx workflow',
      icon: Stethoscope, 
      badge: 'OPD Clinical',
      color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', 
      route: '/doctor' 
    },
    { 
      id: ROLE_KEYS.NURSE, 
      name: 'Nurse / Ward Staff', 
      desc: 'Bed grid, ward status, CCTV discrepancy & patient movement',
      icon: Heart, 
      badge: 'Ward Station',
      color: 'bg-pink-500/20 text-pink-400 border border-pink-500/30', 
      route: '/beds' 
    },
    { 
      id: ROLE_KEYS.RECEPTION, 
      name: 'Reception / OPD Desk', 
      desc: 'Digital tokens, queues, appointment slots & patient arrivals',
      icon: Users, 
      badge: 'Token Desk',
      color: 'bg-purple-500/20 text-purple-400 border border-purple-500/30', 
      route: '/opd' 
    },
    { 
      id: ROLE_KEYS.EMERGENCY, 
      name: 'Emergency / 108 Control', 
      desc: 'Mass casualty alerts, ambulance ETA, resource hold & instant ACK',
      icon: AlertCircle, 
      badge: 'Trauma Grid',
      color: 'bg-red-500/20 text-red-400 border border-red-500/30', 
      route: '/admin-emergency' 
    },
    { 
      id: ROLE_KEYS.BLOOD_BANK, 
      name: 'Blood Bank In-Charge', 
      desc: 'Blood inventory by group, critical shortage alerts & cross-matching',
      icon: Droplet, 
      badge: 'Critical Reserve',
      color: 'bg-rose-500/20 text-rose-400 border border-rose-500/30', 
      route: '/blood-bank' 
    },
    { 
      id: ROLE_KEYS.PHARMACY, 
      name: 'Pharmacy & Drug Supply', 
      desc: 'Batch replenishment, expiry tracking, ward consumption simulator',
      icon: Pill, 
      badge: 'Supply Chain',
      color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', 
      route: '/pharmacy' 
    },
    { 
      id: ROLE_KEYS.GOVERNMENT, 
      name: 'State DHS / Government', 
      desc: 'Cross-hospital capacity, stress heatmaps & statewide load balancing',
      icon: ShieldCheck, 
      badge: 'State Directorate',
      color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', 
      route: '/overview' 
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden selection:bg-teal-500 selection:text-black">
      {/* Ambient Layered Auroras (GetLayers style) */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/15 blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[150px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-[40%] right-[15%] w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Main Container */}
      <div className="z-10 max-w-5xl w-full flex flex-col items-center">
        {/* Flagship Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-teal-300 text-xs font-black mb-6 shadow-lg shadow-teal-500/5 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-3.5 h-3.5 text-teal-400 animate-spin" /> 
          <span>Sanjeevani Grid — State of Maharashtra Unified Health Network</span>
        </div>

        {/* Hero Headline */}
        <div className="text-center mb-10 space-y-3 max-w-3xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.08] text-white">
            Maha<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">Arogya</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
            Autonomous clinical triage in Marathi, Hindi & English • Live GPS hospital router • Dynamic OPD tokens • 108 Emergency grid & Cashless scheme assurance.
          </p>
        </div>

        {/* 2 Flagship Interactive Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl">
          {/* Card 1: Citizen / Patient */}
          <button 
            onClick={() => selectRole(ROLE_KEYS.CITIZEN, '/triage')}
            className="group relative glass-card p-8 rounded-3xl text-left cursor-pointer hover:border-teal-400/80 hover:bg-slate-800/90 transition-all duration-300 hover:-translate-y-1 shadow-2xl hover:shadow-[0_0_35px_rgba(20,184,166,0.25)] flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle Gradient Rim Light */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-teal-500/20 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125 pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/40 shadow-inner group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30">
                  Citizen Portal
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-teal-300 transition-colors">
                    Public / Citizen
                  </h2>
                  <ArrowRight className="w-6 h-6 text-teal-400 transform group-hover:translate-x-2 transition-transform" />
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                  Multilingual voice & text symptom triage, live hospital search with verified GPS navigation, digital OPD queue passes, and instant scheme verification.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700/60 flex flex-wrap gap-2">
              <span className="text-[11px] font-bold bg-slate-800 text-teal-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                🎙️ Voice AI Triage
              </span>
              <span className="text-[11px] font-bold bg-slate-800 text-teal-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                📍 Exact GPS Router
              </span>
              <span className="text-[11px] font-bold bg-slate-800 text-amber-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                🏛️ Cashless Schemes
              </span>
            </div>
          </button>

          {/* Card 2: Staff & Government */}
          <button 
            onClick={() => setShowAdminPanel(true)}
            className="group relative glass-card p-8 rounded-3xl text-left cursor-pointer hover:border-indigo-400/80 hover:bg-slate-800/90 transition-all duration-300 hover:-translate-y-1 shadow-2xl hover:shadow-[0_0_35px_rgba(99,102,241,0.25)] flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle Gradient Rim Light */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-bl-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125 pointer-events-none" />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/40 shadow-inner group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-500/30">
                  Staff & Command
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-black text-white group-hover:text-indigo-300 transition-colors">
                    Hospital & Govt Staff
                  </h2>
                  <ArrowRight className="w-6 h-6 text-indigo-400 transform group-hover:translate-x-2 transition-transform" />
                </div>
                <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
                  Unified command centers for Hospital Admins, Emergency control rooms, Doctors, Nurses, Blood Bank, Pharmacy stock management & DHS State analytics.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700/60 flex flex-wrap gap-2">
              <span className="text-[11px] font-bold bg-slate-800 text-indigo-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                ⚡ 8 Role Portals
              </span>
              <span className="text-[11px] font-bold bg-slate-800 text-indigo-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                🛏️ Live Bed Grid
              </span>
              <span className="text-[11px] font-bold bg-slate-800 text-indigo-300 px-3 py-1 rounded-xl border border-slate-700 flex items-center gap-1.5">
                📡 State Telemetry
              </span>
            </div>
          </button>
        </div>

        {/* Live Grid Metrics Strip (Dribbble/GetLayers inspired) */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-4xl">
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center space-y-0.5">
            <span className="text-slate-400 text-[11px] font-semibold">Empanelled Hospitals</span>
            <p className="text-lg font-black text-white">1,420+ Network</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center space-y-0.5">
            <span className="text-slate-400 text-[11px] font-semibold">Cashless Protection</span>
            <p className="text-lg font-black text-emerald-400">₹5,00,000 / Family</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center space-y-0.5">
            <span className="text-slate-400 text-[11px] font-semibold">AI Triage Latency</span>
            <p className="text-lg font-black text-teal-400">&lt; 280ms Local</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-center space-y-0.5">
            <span className="text-slate-400 text-[11px] font-semibold">108 Emergency Dispatch</span>
            <p className="text-lg font-black text-amber-400">24x7 Real-Time</p>
          </div>
        </div>

        {/* App Download Action Pill */}
        <div className="mt-8">
          <button
            onClick={() => setShowDownloadModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-105"
          >
            <Download className="w-4 h-4 text-teal-400" />
            Download MahaArogya App (Windows .exe & Android .apk)
          </button>
        </div>
      </div>

      {/* Admin Role Slide-in Modal / Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[540px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/80 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${showAdminPanel ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Persona Selector
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">Select Hospital or Govt Persona</h3>
            <p className="text-xs text-slate-400">Instantly test workflows from any stakeholder cockpit</p>
          </div>
          <button 
            onClick={() => setShowAdminPanel(false)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {adminRoles.map((role) => {
            const Icon = role.icon;
            return (
              <button 
                key={role.id}
                onClick={() => selectRole(role.id, role.route)}
                className="w-full flex items-start gap-4 p-4 rounded-2xl bg-slate-800/70 border border-slate-700/70 hover:border-teal-400/80 hover:bg-slate-800 hover:shadow-lg transition-all text-left group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base group-hover:text-teal-300 transition-colors">{role.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{role.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Overlay for slide-in panel */}
      {showAdminPanel && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setShowAdminPanel(false)}
        />
      )}

      {/* App Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-black text-white">Download Official MahaArogya App</h3>
                <p className="text-xs text-slate-400">Offline-ready • Fast ASR & GPS Navigation</p>
              </div>
              <button onClick={() => setShowDownloadModal(false)} className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleDownloadApp('windows')}
                className="w-full p-4 rounded-2xl border border-slate-700 bg-slate-800/80 hover:border-teal-500 hover:bg-slate-800 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white group-hover:text-teal-300">Windows Desktop (.exe)</h5>
                    <p className="text-xs text-slate-400">v1.0.0 • Windows 10/11 64-bit (42 MB)</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-teal-400" />
              </button>

              <button
                onClick={() => handleDownloadApp('android')}
                className="w-full p-4 rounded-2xl border border-slate-700 bg-slate-800/80 hover:border-teal-500 hover:bg-slate-800 flex items-center justify-between text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/30">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white group-hover:text-teal-300">Android Package (.apk)</h5>
                    <p className="text-xs text-slate-400">v1.0.0 • Android 8.0+ (28 MB)</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-teal-400" />
              </button>
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              Digitally certified by Government of Maharashtra Healthcare Network.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

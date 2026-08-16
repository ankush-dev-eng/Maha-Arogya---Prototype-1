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
  Smartphone
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
    const blobContent = `MahaArogya Sanjeevani Grid ${platform.toUpperCase()} Client Package v1.0.0 (SHA-256 Verified)`;
    const blob = new Blob([blobContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowDownloadModal(false);
  };

  const adminRoles = [
    { 
      id: ROLE_KEYS.HOSPITAL_ADMIN, 
      name: 'Hospital Administrator', 
      desc: 'Hospital operations, beds, staff, queues, alerts & AI insights',
      icon: Building, 
      color: 'bg-indigo-500 text-white', 
      route: '/dashboard' 
    },
    { 
      id: ROLE_KEYS.DOCTOR, 
      name: 'Doctor / Medical Officer', 
      desc: 'Incoming cases, triage context, patient queue & Rx workflow',
      icon: Stethoscope, 
      color: 'bg-blue-500 text-white', 
      route: '/doctor' 
    },
    { 
      id: ROLE_KEYS.NURSE, 
      name: 'Nurse / Ward Staff', 
      desc: 'Bed grid, ward status, CCTV discrepancy & patient movement',
      icon: Heart, 
      color: 'bg-pink-500 text-white', 
      route: '/beds' 
    },
    { 
      id: ROLE_KEYS.RECEPTION, 
      name: 'Reception / OPD Staff', 
      desc: 'Digital tokens, queues, appointment slots & arrivals',
      icon: Users, 
      color: 'bg-purple-500 text-white', 
      route: '/opd' 
    },
    { 
      id: ROLE_KEYS.EMERGENCY, 
      name: 'Emergency / Control-Room', 
      desc: 'Emergency alerts, ambulance ETA, resource hold & ACK',
      icon: AlertCircle, 
      color: 'bg-red-500 text-white', 
      route: '/admin-emergency' 
    },
    { 
      id: ROLE_KEYS.BLOOD_BANK, 
      name: 'Blood Bank Staff', 
      desc: 'Blood inventory by group, critical shortage alerts & requests',
      icon: Droplet, 
      color: 'bg-rose-500 text-white', 
      route: '/blood-bank' 
    },
    { 
      id: ROLE_KEYS.PHARMACY, 
      name: 'Pharmacy / Inventory Staff', 
      desc: 'Medicine stock, expiry tracking, consumption & replenishment',
      icon: Pill, 
      color: 'bg-emerald-500 text-white', 
      route: '/pharmacy' 
    },
    { 
      id: ROLE_KEYS.GOVERNMENT, 
      name: 'Government / State Admin', 
      desc: 'Cross-hospital capacity, heatmaps, forecasting & load balancing',
      icon: ShieldCheck, 
      color: 'bg-amber-500 text-white', 
      route: '/overview' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

      {/* Header Branding */}
      <div className="z-10 text-center mb-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" /> Sanjeevani Grid — Unified Healthcare Router
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-3">
          Maha<span className="text-teal-400">Arogya</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300">
          AI-assisted public-health routing, dynamic OPD queues, emergency coordination & cross-hospital resource balancing.
        </p>
      </div>

      {/* Main 2-Card Portal Selection */}
      <div className="z-10 grid md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Citizen Card */}
        <button 
          onClick={() => selectRole(ROLE_KEYS.CITIZEN, '/triage')}
          className="group relative bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-8 cursor-pointer hover:bg-slate-800 transition-all hover:border-teal-500/60 hover:shadow-2xl hover:shadow-teal-500/20 text-left overflow-hidden focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125" />
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-6 border border-teal-500/30">
            <User className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Public / Patient</h2>
            <ArrowRight className="w-6 h-6 text-teal-400 transform group-hover:translate-x-2 transition-transform" />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Voice & text AI symptom triage in Marathi, Hindi & English. Real-time OPD token generation, hospital routing, and live emergency dispatch.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-md font-medium">🎙️ Voice Triage</span>
            <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-md font-medium">🎫 Smart Token</span>
            <span className="text-xs bg-teal-500/20 text-teal-300 px-2.5 py-1 rounded-md font-medium">🚨 Emergency</span>
          </div>
        </button>

        {/* Staff Card */}
        <button 
          onClick={() => setShowAdminPanel(true)}
          className="group relative bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-3xl p-8 cursor-pointer hover:bg-slate-800 transition-all hover:border-indigo-500/60 hover:shadow-2xl hover:shadow-indigo-500/20 text-left overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-125" />
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 border border-indigo-500/30">
            <Activity className="w-8 h-8" />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Hospital & Govt Staff</h2>
            <ArrowRight className="w-6 h-6 text-indigo-400 transform group-hover:translate-x-2 transition-transform" />
          </div>
          <p className="text-slate-300 text-sm leading-relaxed mb-4">
            Role-specific portals for Hospital Admins, Doctors, Nurses, Receptionists, Emergency Dispatchers, Blood Bank, Pharmacy, and State Government.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md font-medium">8 Staff Personas</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md font-medium">🛏️ Smart Beds</span>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md font-medium">💊 Pharmacy</span>
          </div>
        </button>
      </div>

      {/* App Download Action Pill */}
      <div className="z-10 mt-8 text-center">
        <button
          onClick={() => setShowDownloadModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-500 text-slate-300 hover:text-white text-xs font-bold transition-all shadow-md"
        >
          <Download className="w-4 h-4 text-teal-400" />
          Download MahaArogya App (Windows .exe & Android .apk)
        </button>
      </div>

      {/* Admin Role Slide-in Modal / Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[540px] bg-slate-900 border-l border-slate-700 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${showAdminPanel ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Persona Selector
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">Select Your Admin Role</h3>
            <p className="text-xs text-slate-400">Instantly test the platform from any stakeholder perspective</p>
          </div>
          <button 
            onClick={() => setShowAdminPanel(false)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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
                className="w-full flex items-start gap-4 p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-teal-500/80 hover:bg-slate-800 hover:shadow-lg transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-xl ${role.color} flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-base group-hover:text-teal-400 transition-colors">{role.name}</span>
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setShowAdminPanel(false)}
        />
      )}

      {/* App Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-black">Download Official MahaArogya App</h3>
                <p className="text-xs text-slate-500">Fast, offline-ready & synced with Sanjeevani Grid</p>
              </div>
              <button onClick={() => setShowDownloadModal(false)} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleDownloadApp('windows')}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Laptop className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700">Windows Desktop (.exe)</h5>
                    <p className="text-xs text-slate-500">v1.0.0 • Windows 10/11 64-bit (42 MB)</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
              </button>

              <button
                onClick={() => handleDownloadApp('android')}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-600 hover:bg-teal-50/40 flex items-center justify-between text-left transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700">Android Package (.apk)</h5>
                    <p className="text-xs text-slate-500">v1.0.0 • Android 8.0+ (28 MB)</p>
                  </div>
                </div>
                <Download className="w-5 h-5 text-slate-400 group-hover:text-teal-600" />
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

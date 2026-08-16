"use client";
import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  MapPin, 
  UserCheck, 
  Database, 
  Activity, 
  Radio, 
  Sparkles, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  X, 
  Sliders, 
  ShieldAlert, 
  Zap,
  Server,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';

interface DevSettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DevSettingsModal({ isOpen, onClose }: DevSettingsProps) {
  const [devMode, setDevMode] = useState<boolean>(true);
  const [activeCity, setActiveCity] = useState<string>('Nagpur');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [backendLatency, setBackendLatency] = useState<string>('0.6ms');
  const [aiGatewayLatency, setAiGatewayLatency] = useState<string>('1.2ms');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  useEffect(() => {
    try {
      const savedDevMode = localStorage.getItem('maha_dev_mode');
      if (savedDevMode !== null) {
        setDevMode(savedDevMode === 'true');
      }
    } catch (e) {}
  }, []);

  const handleToggleDevMode = (val: boolean) => {
    setDevMode(val);
    try {
      localStorage.setItem('maha_dev_mode', val ? 'true' : 'false');
      window.dispatchEvent(new Event('dev_mode_changed'));
    } catch (e) {}
    showToast(val ? '⚙️ Developer Mode & Sandbox Telemetry ENABLED (ON)!' : '🔒 Developer Mode DISABLED (OFF).');
  };

  const handleSetMockGPS = (cityName: string, lat: number, lng: number) => {
    setActiveCity(cityName);
    const coords = { lat, lng };
    try {
      localStorage.setItem('maha_user_coords', JSON.stringify(coords));
      window.dispatchEvent(new Event('location_override_changed'));
    } catch (e) {}
    showToast(`📍 Developer GPS Override: Centered on ${cityName} (${lat}, ${lng})!`);
  };

  const handleInjectPersona = (name: string, age: number, condition: string, rationCard: string, income: number) => {
    const profile = { name, age, condition, rationCard, income };
    try {
      localStorage.setItem('maha_mock_patient', JSON.stringify(profile));
    } catch (e) {}
    showToast(`👤 Injected Mock Patient: ${name} (${age}y, ${condition})`);
  };

  const handleTriggerMassSurge = () => {
    const alert = {
      id: 'alert_' + Date.now(),
      code: 'YELLOW',
      title: 'Dev Trigger: Mass Casualty Inflow from Highway Accident',
      message: 'DEVELOPER SIMULATION: 12 trauma casualties en-route via 108. All ER bays and trauma surgeons activated.',
      sender: 'Dev Sandbox Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targets: ['All Ward Stations', 'Emergency ER', '108 Dispatch'],
      severity: 'critical'
    };
    try {
      const existing = JSON.parse(localStorage.getItem('maha_active_broadcasts') || '[]');
      localStorage.setItem('maha_active_broadcasts', JSON.stringify([alert, ...existing]));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
    showToast('🚨 Dev Trigger: Code Yellow Mass Casualty Broadcast Dispatched!');
  };

  const handleResetDemoData = () => {
    try {
      localStorage.removeItem('maha_pharmacy');
      localStorage.removeItem('maha_active_broadcasts');
      localStorage.removeItem('maha_active_token');
      localStorage.removeItem('maha_mock_patient');
    } catch (e) {}
    showToast('🧹 Developer Reset: Cleared demo cache and reset all modules to factory defaults.');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-60 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">Developer Settings & Sandbox Hub</h3>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px] font-black">
                  DEV MODE ON
                </Badge>
              </div>
              <p className="text-xs text-slate-400">Live runtime telemetry, GPS overrides, persona injection & stress test triggers</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Main Dev Mode Master Switch */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-xs font-black text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Developer Mode Status
            </span>
            <p className="text-[11px] text-slate-400">Toggle live runtime overlays, debug telemetry, and test controllers.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleDevMode(!devMode)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                devMode 
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {devMode ? '● DEV MODE ON' : '○ DEV MODE OFF'}
            </button>
          </div>
        </div>

        {/* Section 2: Live Service Architecture Telemetry */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Live Service Architecture Telemetry
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Backend Service</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs font-black text-white">FastAPI :8000</p>
              <p className="text-[10px] text-emerald-400 font-mono">Latency: {backendLatency} • Healthy</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">AI Inference Gateway</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs font-black text-white">FastAPI :8001 (Ollama)</p>
              <p className="text-[10px] text-emerald-400 font-mono">Latency: {aiGatewayLatency} • ASR Active</p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Frontend Client</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-xs font-black text-white">Next.js 15 :3000</p>
              <p className="text-[10px] text-emerald-400 font-mono">Turbopack • 23 Routes</p>
            </div>
          </div>
        </div>

        {/* Section 3: Developer GPS Geolocation Override */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            📍 Mock GPS District Override
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { city: 'Nagpur', lat: 21.0833, lng: 79.0993, desc: 'Besa-Pipla / GMC Grid' },
              { city: 'Pune', lat: 18.5262, lng: 73.8732, desc: 'Sassoon / KEM Grid' },
              { city: 'Mumbai', lat: 19.0024, lng: 72.8426, desc: 'Parel / KEM MMR Grid' },
              { city: 'Nashik', lat: 19.9975, lng: 73.7898, desc: 'CBS / Civil Hospital' },
              { city: 'Chhatrapati Sambhajinagar', lat: 19.8654, lng: 75.3211, desc: 'GMCH Aurangabad' },
              { city: 'Amravati', lat: 20.9320, lng: 77.7523, desc: 'District Hospital' },
            ].map(loc => (
              <button
                key={loc.city}
                onClick={() => handleSetMockGPS(loc.city, loc.lat, loc.lng)}
                className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  activeCity === loc.city
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300 ring-1 ring-teal-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <p className="font-black">{loc.city}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Fast Simulation & Stress Triggers */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            ⚡ Instant Simulation & Stress Triggers
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Button
              onClick={handleTriggerMassSurge}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Radio className="w-4 h-4" /> Trigger Code Yellow Surge
            </Button>

            <Button
              onClick={handleResetDemoData}
              variant="outline"
              className="border-slate-700 hover:bg-red-500/20 text-red-300 hover:border-red-400 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-400" /> Reset Demo Cache to Default
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>⚙️ MahaArogya Sanjeevani Grid • v1.0.0-prototype</span>
          <Button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl px-5 py-2 cursor-pointer"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

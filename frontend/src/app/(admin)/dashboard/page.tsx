"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { StatsCard } from '@/components/charts/StatsCard';
import { 
  Users, 
  Bed, 
  AlertCircle, 
  Clock, 
  Download, 
  Bell, 
  Truck, 
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  Radio,
  X,
  Volume2,
  ShieldAlert,
  Send,
  Sparkles
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar 
} from 'recharts';
import { useLanguage } from '@/lib/LanguageContext';
import { downloadCommandCenterPDF } from '@/lib/pdfGenerator';

interface BroadcastAlert {
  id: string;
  code: 'BLUE' | 'RED' | 'YELLOW' | 'VIOLET' | 'GENERAL';
  title: string;
  message: string;
  sender: string;
  timestamp: string;
  targets: string[];
  severity: 'critical' | 'high' | 'moderate' | 'info';
}

const FLOW_DATA = [
  { time: '08:00', patients: 45 },
  { time: '10:00', patients: 85 },
  { time: '12:00', patients: 120 },
  { time: '14:00', patients: 95 },
  { time: '16:00', patients: 110 },
  { time: '18:00', patients: 65 },
];

const DEPT_LOAD = [
  { name: 'General', load: 85, color: '#0d9488' },
  { name: 'Cardio', load: 45, color: '#3b82f6' },
  { name: 'Ortho', load: 55, color: '#8b5cf6' },
  { name: 'Pedia', load: 68, color: '#f59e0b' },
  { name: 'Gynae', load: 50, color: '#ec4899' },
];

const PRESET_TEMPLATES = [
  {
    code: 'YELLOW' as const,
    title: 'Mass Casualty Inflow — Highway NH-47 Accident',
    message: '8 major trauma casualties en-route via 108 ambulances. Emergency ER & Trauma bays 1-4 cleared immediately. Blood bank prepare O-negative units.',
    severity: 'critical' as const,
  },
  {
    code: 'BLUE' as const,
    title: 'Code Blue — Immediate Cardiac Resuscitation',
    message: 'Cardiac arrest alert in ICU Ward B (Bed 14). Crash cart & rapid response anesthesia team report immediately.',
    severity: 'critical' as const,
  },
  {
    code: 'VIOLET' as const,
    title: 'Surge Protocol Level 2 — ICU Bed Allocation Lockdown',
    message: 'High emergency bed occupancy (>90%). Non-critical elective admissions paused. Priority routing to auxiliary district centers.',
    severity: 'high' as const,
  },
  {
    code: 'GENERAL' as const,
    title: 'Central Oxygen Manifold Inspection Notice',
    message: 'Scheduled secondary pressure regulator testing today between 16:30 and 17:30. Backup cylinder banks primed and active.',
    severity: 'info' as const,
  },
];

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<BroadcastAlert[]>([]);

  // Modal form state
  const [selectedCode, setSelectedCode] = useState<'BLUE' | 'RED' | 'YELLOW' | 'VIOLET' | 'GENERAL'>('YELLOW');
  const [alertTitle, setAlertTitle] = useState('Mass Casualty Inflow — Highway NH-47 Accident');
  const [alertMessage, setAlertMessage] = useState('8 major trauma casualties en-route via 108 ambulances. Emergency ER & Trauma bays 1-4 cleared immediately.');
  const [targetStations, setTargetStations] = useState<string[]>([
    'All Ward Nurse Stations',
    'OPD Consulting Desks',
    'Emergency Trauma ER',
    '108 Ambulance Dispatch'
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('maha_active_broadcasts');
      if (saved) {
        setActiveAlerts(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const saveAlerts = (alerts: BroadcastAlert[]) => {
    setActiveAlerts(alerts);
    try {
      localStorage.setItem('maha_active_broadcasts', JSON.stringify(alerts));
    } catch (e) {}
  };

  const handleDownloadReport = () => {
    downloadCommandCenterPDF(language);
    showToast('📥 Official Command Center Briefing PDF downloaded to your computer!');
  };

  const handleSelectTemplate = (template: typeof PRESET_TEMPLATES[0]) => {
    setSelectedCode(template.code);
    setAlertTitle(template.title);
    setAlertMessage(template.message);
  };

  const handleToggleTarget = (station: string) => {
    if (targetStations.includes(station)) {
      setTargetStations(targetStations.filter(s => s !== station));
    } else {
      setTargetStations([...targetStations, station]);
    }
  };

  const handleDispatchBroadcast = () => {
    if (!alertTitle.trim() || !alertMessage.trim()) {
      showToast('⚠️ Please enter an alert title and message.');
      return;
    }

    const newAlert: BroadcastAlert = {
      id: 'alert_' + Date.now(),
      code: selectedCode,
      title: alertTitle,
      message: alertMessage,
      sender: 'Hospital Admin (Dr. Arvind Kulkarni)',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targets: targetStations.length > 0 ? targetStations : ['All Hospital Departments'],
      severity: selectedCode === 'BLUE' || selectedCode === 'YELLOW' || selectedCode === 'RED' ? 'critical' : 'high',
    };

    const updated = [newAlert, ...activeAlerts];
    saveAlerts(updated);
    setIsBroadcastModalOpen(false);
    showToast(`🚨 ${selectedCode} BROADCAST DISPATCHED across ${newAlert.targets.length} hospital channels!`);
  };

  const handleDismissAlert = (id: string) => {
    const updated = activeAlerts.filter(a => a.id !== id);
    saveAlerts(updated);
    showToast('✅ Broadcast alert cleared and logged to hospital incident archive.');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Active Broadcast Alert Banners */}
      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          {activeAlerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-4 sm:p-5 rounded-3xl border shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in slide-in-from-top-4 ${
                alert.code === 'BLUE' 
                  ? 'bg-blue-950 text-white border-blue-500/50 shadow-blue-900/30' 
                  : alert.code === 'RED'
                  ? 'bg-red-950 text-white border-red-500/50 shadow-red-900/30'
                  : alert.code === 'YELLOW'
                  ? 'bg-amber-950 text-white border-amber-500/50 shadow-amber-900/30'
                  : 'bg-slate-900 text-white border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-2xl shrink-0 flex items-center justify-center font-black ${
                  alert.code === 'BLUE' ? 'bg-blue-600 text-white animate-pulse' :
                  alert.code === 'RED' ? 'bg-red-600 text-white animate-pulse' :
                  alert.code === 'YELLOW' ? 'bg-amber-500 text-slate-950 animate-pulse' :
                  'bg-teal-600 text-white'
                }`}>
                  <Radio className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20">
                      CODE {alert.code}
                    </span>
                    <h3 className="font-black text-sm sm:text-base">{alert.title}</h3>
                    <span className="text-xs opacity-75 font-mono">({alert.timestamp})</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-w-4xl">
                    {alert.message}
                  </p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 flex-wrap">
                    <span>📡 Broadcasted to: <b>{alert.targets.join(', ')}</b></span>
                    <span>•</span>
                    <span>👤 {alert.sender}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => handleDismissAlert(alert.id)}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-xs rounded-xl"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Clear Broadcast
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('dashTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('dashSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <Button 
            variant="outline" 
            onClick={handleDownloadReport}
            className="border-slate-300 font-bold text-xs shadow-2xs hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-1.5 text-teal-600" /> {t('dashDownloadReport')}
          </Button>
          <Button 
            variant="danger" 
            onClick={() => setIsBroadcastModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm shadow-red-600/20 flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4 text-white animate-bounce" /> {t('dashBroadcastAlert')}
          </Button>
        </div>
      </div>

      {/* 6 High-Level KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatsCard 
          title={t('dashPatientsToday')} 
          value="485" 
          change={t('trendPatients')} 
          trend="up" 
          icon={Users} 
        />
        <StatsCard 
          title={t('dashActiveEmergencies')} 
          value={3 + activeAlerts.length} 
          change={t('trendEmergencies')} 
          trend="up" 
          icon={AlertCircle} 
        />
        <StatsCard 
          title={t('dashOpdWaitAvg')} 
          value="28m" 
          change={t('trendOpdWait')} 
          trend="down" 
          icon={Clock} 
        />
        <StatsCard 
          title={t('dashAvailableBeds')} 
          value="42 / 350" 
          change={t('trendBeds')} 
          trend="down" 
          icon={Bed} 
        />
        <StatsCard 
          title={t('dashAmbulancesAvailable')} 
          value="4 / 12" 
          change={t('trendAmbulances')} 
          trend="down" 
          icon={Truck} 
        />
        <StatsCard 
          title={t('dashStaffOnDuty')} 
          value="156" 
          change={t('trendStaff')} 
          trend="up" 
          icon={HeartHandshake} 
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-slate-900">{t('dashPatientFlow')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={FLOW_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#0d9488" 
                    strokeWidth={3} 
                    dot={{ fill: '#0d9488', r: 4, strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-slate-900">{t('dashDeptLoad')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEPT_LOAD} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="load" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Broadcast Alert Composer Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-100 text-red-600 font-bold">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Hospital Emergency Broadcast</h3>
                  <p className="text-xs text-slate-500">Dispatch instant high-priority protocol to all staff stations</p>
                </div>
              </div>
              <button 
                onClick={() => setIsBroadcastModalOpen(false)} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Template Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Incident Templates:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectTemplate(tmpl)}
                    className={`text-left p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      selectedCode === tmpl.code && alertTitle === tmpl.title
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="block text-[10px] uppercase font-black opacity-75">Code {tmpl.code}</span>
                    <span className="line-clamp-1">{tmpl.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Emergency Protocol Code:</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { code: 'YELLOW' as const, label: 'Code Yellow', bg: 'bg-amber-500 text-slate-950' },
                  { code: 'BLUE' as const, label: 'Code Blue', bg: 'bg-blue-600 text-white' },
                  { code: 'RED' as const, label: 'Code Red', bg: 'bg-red-600 text-white' },
                  { code: 'VIOLET' as const, label: 'Code Violet', bg: 'bg-purple-600 text-white' },
                  { code: 'GENERAL' as const, label: 'General', bg: 'bg-teal-600 text-white' },
                ].map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCode(c.code)}
                    className={`py-2 rounded-xl text-xs font-extrabold transition-all border ${
                      selectedCode === c.code 
                        ? `${c.bg} ring-2 ring-slate-900 shadow-xs` 
                        : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Message */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Broadcast Title</label>
                <Input 
                  value={alertTitle}
                  onChange={(e) => setAlertTitle(e.target.value)}
                  className="font-bold text-sm bg-slate-50 border-slate-300"
                  placeholder="e.g. Mass Casualty Inflow from NH-47"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Incident Instructions & Directives</label>
                <textarea 
                  value={alertMessage}
                  onChange={(e) => setAlertMessage(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 outline-hidden"
                  placeholder="Type specific department instructions and action requirements..."
                />
              </div>
            </div>

            {/* Target Destination Channels */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Target Receiving Channels:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  'All Ward Nurse Stations',
                  'OPD Consulting Desks',
                  'Emergency Trauma ER',
                  '108 Ambulance Dispatch',
                  'ICU & HDU Special Units',
                  'State DHS Emergency Grid'
                ].map(station => (
                  <label 
                    key={station}
                    onClick={() => handleToggleTarget(station)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer font-bold transition-all ${
                      targetStations.includes(station)
                        ? 'bg-teal-50 border-teal-400 text-teal-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    <input 
                      type="checkbox"
                      checked={targetStations.includes(station)}
                      onChange={() => {}}
                      className="rounded text-teal-600"
                    />
                    <span>{station}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-3 border-t">
              <Button 
                onClick={handleDispatchBroadcast}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3 rounded-xl shadow-lg shadow-red-600/20 flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4" /> Dispatch Hospital Broadcast
              </Button>
              <Button 
                variant="outline"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="border-slate-300 font-bold text-xs rounded-xl"
              >
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

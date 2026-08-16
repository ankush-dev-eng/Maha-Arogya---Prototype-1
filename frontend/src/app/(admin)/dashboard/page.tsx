"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  CheckCircle2
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

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadReport = () => {
    downloadCommandCenterPDF(language);
    showToast('📥 Official Command Center Briefing PDF downloaded to your computer!');
  };

  const handleBroadcastAlert = () => {
    showToast('📢 Priority operational bulletin broadcasted across all ward nurse stations & OPD desks!');
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
            onClick={handleBroadcastAlert}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm shadow-red-600/20"
          >
            <Bell className="w-4 h-4 mr-1.5" /> {t('dashBroadcastAlert')}
          </Button>
        </div>
      </div>

      {/* 6 High-Level KPI Stats Cards with 100% localized change/trend labels */}
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
          value="3" 
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
    </div>
  );
}

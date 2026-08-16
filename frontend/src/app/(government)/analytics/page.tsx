"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  MapPin, 
  Download, 
  RefreshCw,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const FORECAST_BED_DATA = [
  { date: 'Day -6', actual: 450, predicted: 440, lower: 420, upper: 460 },
  { date: 'Day -5', actual: 520, predicted: 510, lower: 480, upper: 540 },
  { date: 'Day -4', actual: 480, predicted: 490, lower: 460, upper: 520 },
  { date: 'Day -3', actual: 510, predicted: 520, lower: 490, upper: 550 },
  { date: 'Day -2', actual: 600, predicted: 590, lower: 560, upper: 620 },
  { date: 'Yesterday', actual: 630, predicted: 620, lower: 590, upper: 650 },
  { date: 'Today (Live)', actual: 650, predicted: 650, lower: 620, upper: 680 },
  { date: 'Tomorrow', predicted: 690, lower: 650, upper: 730 },
  { date: 'Day +2', predicted: 720, lower: 670, upper: 770 },
  { date: 'Day +3', predicted: 745, lower: 690, upper: 800 },
  { date: 'Day +4', predicted: 760, lower: 700, upper: 820 },
];

const EPIDEMIC_SURVEILLANCE_DATA = [
  { week: 'Wk 31', Dengue: 142, Malaria: 88, Gastro: 210, Respiratory: 310 },
  { week: 'Wk 32', Dengue: 189, Malaria: 94, Gastro: 235, Respiratory: 330 },
  { week: 'Wk 33', Dengue: 245, Malaria: 102, Gastro: 260, Respiratory: 370 },
  { week: 'Wk 34', Dengue: 320, Malaria: 115, Gastro: 290, Respiratory: 410 },
  { week: 'Wk 35', Dengue: 430, Malaria: 128, Gastro: 310, Respiratory: 450 },
  { week: 'Wk 36 (Current)', Dengue: 512, Malaria: 140, Gastro: 325, Respiratory: 490 },
];

const DISTRICT_OUTBREAK_RISK = [
  { district: 'Mumbai Suburban', risk: 'High', r0: '1.42', topDisease: 'Dengue & Gastro', activeClusters: 14, color: 'text-red-600 bg-red-50 border-red-200' },
  { district: 'Pune District', risk: 'High', r0: '1.38', topDisease: 'Acute Respiratory', activeClusters: 11, color: 'text-red-600 bg-red-50 border-red-200' },
  { district: 'Nagpur Urban', risk: 'Moderate', r0: '1.14', topDisease: 'Dengue & Malaria', activeClusters: 6, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { district: 'Nashik Central', risk: 'Moderate', r0: '1.09', topDisease: 'Gastroenteritis', activeClusters: 5, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { district: 'Chhatrapati Sambhajinagar', risk: 'Low', r0: '0.88', topDisease: 'Seasonal Viral', activeClusters: 2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
];

const PIE_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#6366F1'];

export default function AnalyticsPage() {
  const { language } = useLanguage();
  const [selectedDisease, setSelectedDisease] = useState<string>('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleTriggerRebalance = () => {
    showToast(
      language === 'mr'
        ? '⚡ एआय प्रादेशिक पुनर्संतुलन आदेश जारी: मुंबई व पुणे उपनगरातील अतिरिक्त ओपीडी भार पर्यायी केंद्रांवर वळवला!'
        : language === 'hi'
        ? '⚡ एआई क्षेत्रीय पुनर्संतुलन आदेश जारी: मुंबई एवं पुणे के अतिरिक्त ओपीडी भार को वैकल्पिक केंद्रों पर डायवर्ट किया गया!'
        : '⚡ AI Regional Load Balancing initiated: Diverting elective demand from high-stress wards to auxiliary facilities.'
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> 
              {language === 'mr' ? 'आरोग्य महासंचालनालय महाराष्ट्र' : language === 'hi' ? 'स्वास्थ्य महानिदेशालय महाराष्ट्र' : 'Directorate of Health Services — Maharashtra'}
            </span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[11px] font-black">
              ML ARIMA + XGBoost v2.1
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {language === 'mr' ? 'रोगसाथ व क्षमता अंदाज विश्लेषक' : language === 'hi' ? 'महामारी एवं क्षमता पूर्वानुमान विश्लेषक' : 'Epidemic Outbreak & Capacity Forecasting'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Real-time syndromic surveillance, infectious disease clustering (Dengue, Malaria), and 7-day state healthcare resource demand models.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={handleTriggerRebalance}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3 rounded-2xl shadow-lg shadow-indigo-600/30"
          >
            <Sparkles className="w-4 h-4 mr-2" /> 
            {language === 'mr' ? 'एआय पुनर्संतुलन आदेश' : language === 'hi' ? 'एआई पुनर्संतुलन आदेश' : 'Auto-Rebalance Network'}
          </Button>
        </div>
      </div>

      {/* Top Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated R0 Index</p>
              <p className="text-2xl sm:text-3xl font-black text-red-600 mt-1">1.34</p>
              <p className="text-[11px] text-red-600 font-semibold mt-0.5">↑ Spike in Dengue clusters</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-xl">
              R₀
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">7-Day Bed Surge Demand</p>
              <p className="text-2xl sm:text-3xl font-black text-indigo-600 mt-1">+16.9%</p>
              <p className="text-[11px] text-indigo-600 font-semibold mt-0.5">760 peak beds forecast</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Syndromic Clusters</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">37</p>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Across 5 key districts</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-200/80 shadow-xs bg-white">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Surveillance Stations</p>
              <p className="text-2xl sm:text-3xl font-black text-teal-600 mt-1">214</p>
              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Real-time reporting</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid of Main Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Bed Demand Forecast */}
        <Card className="rounded-3xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-5 sm:p-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-900">
                {language === 'mr' ? 'राज्यस्तरीय खाटांची मागणी अंदाज (पुढील ७ दिवस)' : language === 'hi' ? 'राज्य स्तरीय बेड मांग पूर्वानुमान (अगले 7 दिन)' : 'State-Wide Bed Demand Forecast (Next 7 Days)'}
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Time-series forecasting with 95% confidence intervals</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">
              MAPE: 3.4%
            </Badge>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={FORECAST_BED_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[350, 900]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Area 
                    type="monotone" 
                    dataKey="upper" 
                    stroke="none" 
                    fill="#E0E7FF" 
                    fillOpacity={0.4} 
                    name="95% Upper Bound" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="lower" 
                    stroke="none" 
                    fill="#FFFFFF" 
                    name="95% Lower Bound" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#0D9488" 
                    strokeWidth={2.5}
                    fill="#0D9488" 
                    fillOpacity={0.2} 
                    name="Historical Load" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#4F46E5" 
                    strokeWidth={2.5}
                    strokeDasharray="4 4" 
                    name="AI Forecasted Demand" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Infectious Disease Multi-Week Trends */}
        <Card className="rounded-3xl border-slate-200/80 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-5 sm:p-6 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-900">
                {language === 'mr' ? 'संसर्गजन्य आजार फैलाव ट्रेंड (६ आठवडे)' : language === 'hi' ? 'संक्रामक रोग प्रसार ट्रेंड (6 सप्ताह)' : 'Infectious Disease Spread Velocity'}
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Syndromic caseload by diagnostic classification</p>
            </div>
            <Badge className="bg-red-500/10 text-red-700 border-red-200 text-[10px] font-bold">
              Surge Alert
            </Badge>
          </CardHeader>
          <CardContent className="p-5 sm:p-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={EPIDEMIC_SURVEILLANCE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Dengue" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} name="Dengue (NS1/IgM)" />
                  <Line type="monotone" dataKey="Respiratory" stroke="#6366F1" strokeWidth={2} name="Acute Respiratory" />
                  <Line type="monotone" dataKey="Gastro" stroke="#F59E0B" strokeWidth={2} name="Gastroenteritis" />
                  <Line type="monotone" dataKey="Malaria" stroke="#10B981" strokeWidth={2} name="Malaria" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District Outbreak Table & Risk Matrix */}
      <Card className="rounded-3xl border-slate-200/80 shadow-md bg-white overflow-hidden">
        <CardHeader className="p-5 sm:p-6 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              {language === 'mr' ? 'जिल्हास्तरीय रोगसाथ धोका व क्लस्टर स्थिती' : language === 'hi' ? 'जिला स्तरीय महामारी जोखिम एवं क्लस्टर स्थिति' : 'District-Wise Epidemic Risk & Cluster Telemetry'}
            </CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              Surveillance threshold monitored continuously by AI anomaly detectors.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-bold border-slate-300">
            Updated 10 mins ago
          </Badge>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-black uppercase text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-4 pl-6">District / Jurisdiction</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4">Effective R₀</th>
                  <th className="p-4">Dominant Pathogen</th>
                  <th className="p-4">Active Geo-Clusters</th>
                  <th className="p-4 text-right pr-6">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {DISTRICT_OUTBREAK_RISK.map((d, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 pl-6 font-black text-slate-900 text-sm">{d.district}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${d.color}`}>
                        {d.risk}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-black text-slate-900">{d.r0}</td>
                    <td className="p-4 font-semibold text-slate-700">{d.topDisease}</td>
                    <td className="p-4">
                      <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-800">
                        {d.activeClusters} clusters
                      </span>
                    </td>
                    <td className="p-4 text-right pr-6">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => showToast(`📍 Micro-containment protocol dispatched to ${d.district} health officers.`)}
                        className="text-xs font-bold border-slate-300 hover:bg-slate-100"
                      >
                        Deploy Ward Alert
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

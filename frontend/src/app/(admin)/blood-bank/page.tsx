"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Droplet, 
  AlertTriangle, 
  Send, 
  Plus, 
  CheckCircle2, 
  Bell, 
  Clock, 
  Users, 
  Truck,
  Heart
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface BloodStock {
  group: string;
  units: number;
  minBuffer: number;
  status: 'adequate' | 'low' | 'critical';
  lastUpdated: string;
}

const DEFAULT_STOCKS: BloodStock[] = [
  { group: 'O+', units: 48, minBuffer: 25, status: 'adequate', lastUpdated: 'Today 11:30 AM' },
  { group: 'O-', units: 3, minBuffer: 10, status: 'critical', lastUpdated: 'Today 09:15 AM' },
  { group: 'A+', units: 34, minBuffer: 20, status: 'adequate', lastUpdated: 'Today 01:00 PM' },
  { group: 'A-', units: 6, minBuffer: 10, status: 'critical', lastUpdated: 'Yesterday 04:45 PM' },
  { group: 'B+', units: 41, minBuffer: 20, status: 'adequate', lastUpdated: 'Today 12:10 PM' },
  { group: 'B-', units: 7, minBuffer: 10, status: 'low', lastUpdated: 'Today 08:30 AM' },
  { group: 'AB+', units: 19, minBuffer: 10, status: 'adequate', lastUpdated: 'Today 10:20 AM' },
  { group: 'AB-', units: 2, minBuffer: 8, status: 'critical', lastUpdated: '2 days ago' },
];

export default function BloodBankPage() {
  const { t } = useLanguage();
  const [stocks, setStocks] = useState<BloodStock[]>([]);
  const [donorName, setDonorName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('O+');
  const [unitsDonated, setUnitsDonated] = useState('1');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [requests, setRequests] = useState([
    { id: 1, hospital: 'KEM Hospital Pune', group: 'O-', units: 2, urgency: 'EMERGENCY', time: '10 mins ago', status: 'pending' },
    { id: 2, hospital: 'Deenanath Mangeshkar', group: 'AB-', units: 1, urgency: 'HIGH', time: '45 mins ago', status: 'approved' },
    { id: 3, hospital: 'Ruby Hall Clinic', group: 'A-', units: 2, urgency: 'ROUTINE', time: '2 hours ago', status: 'fulfilled' },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const saved = localStorage.getItem('maha_blood_stock');
    if (saved) {
      try {
        setStocks(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setStocks(DEFAULT_STOCKS);
  }, []);

  const saveStocks = (updated: BloodStock[]) => {
    setStocks(updated);
    localStorage.setItem('maha_blood_stock', JSON.stringify(updated));
  };

  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) {
      showToast('⚠️ Please enter donor full name');
      return;
    }
    const units = parseInt(unitsDonated) || 1;
    const updated = stocks.map(s => {
      if (s.group === selectedGroup) {
        const newUnits = s.units + units;
        return {
          ...s,
          units: newUnits,
          status: (newUnits >= s.minBuffer ? 'adequate' : newUnits >= s.minBuffer / 2 ? 'low' : 'critical') as 'adequate' | 'low' | 'critical',
          lastUpdated: 'Just now'
        };
      }
      return s;
    });
    saveStocks(updated);
    showToast(`🩸 Blood donation logged: +${units} unit(s) of ${selectedGroup} added for donor ${donorName}.`);
    setDonorName('');
  };

  const handleDispatch = (id: number, hospital: string, group: string, units: number) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'dispatched' } : r));
    const updated = stocks.map(s => {
      if (s.group === group) {
        const newUnits = Math.max(0, s.units - units);
        return {
          ...s,
          units: newUnits,
          status: (newUnits >= s.minBuffer ? 'adequate' : newUnits >= s.minBuffer / 2 ? 'low' : 'critical') as 'adequate' | 'low' | 'critical',
          lastUpdated: 'Just now'
        };
      }
      return s;
    });
    saveStocks(updated);
    showToast(`🚑 Dispatched ${units} unit(s) of ${group} to ${hospital} with cold-chain telemetry tracking!`);
  };

  const handleBroadcastAlert = () => {
    showToast('📢 Regional Emergency Donor broadcast broadcasted across SMS/WhatsApp alert channels for O- & AB-!');
  };

  const totalUnits = stocks.reduce((acc, s) => acc + s.units, 0);
  const criticalCount = stocks.filter(s => s.status === 'critical').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-rose-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full border border-rose-500/30">
            Role: Regional Blood Bank Officer • Sassoon General Central Blood Bank
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            {t('bbTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {t('bbSubtitle')}
          </p>
        </div>

        <Button 
          onClick={handleBroadcastAlert}
          variant="danger" 
          className="bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-rose-600/20 shrink-0"
        >
          <Bell className="w-4 h-4 mr-1.5" /> {t('bbBroadcastAlert')}
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="rounded-2xl border-l-4 border-l-rose-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('bbTotalUnits')}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalUnits} <span className="text-xs font-normal text-slate-500">Units</span></p>
              <span className="text-[11px] text-emerald-600 font-semibold">Tested & Safe</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-red-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('bbCriticalShortages')}</p>
              <p className="text-2xl font-black text-red-600 mt-0.5">{criticalCount} <span className="text-xs font-normal text-slate-500">Groups</span></p>
              <span className="text-[11px] text-red-600 font-semibold">O-, A-, AB- below safe buffer</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-emerald-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('bbDonationsToday')}</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">16 <span className="text-xs font-normal text-slate-500">Donors</span></p>
              <span className="text-[11px] text-slate-500">Voluntary walk-ins + camps</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blood Group Grid */}
      <div>
        <h2 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
          <Droplet className="w-4 h-4 text-rose-600" /> {t('bloodUnitsGroup')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stocks.map(item => (
            <Card 
              key={item.group}
              className={`rounded-3xl border-2 transition-all overflow-hidden ${
                item.status === 'critical' ? 'border-red-500 bg-red-50/20' :
                item.status === 'low' ? 'border-amber-400 bg-amber-50/20' : 'border-emerald-200 bg-emerald-50/10'
              }`}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-black text-slate-900 bg-white px-3 py-1 rounded-xl shadow-2xs border">
                    {item.group}
                  </span>
                  <Badge variant={item.status === 'critical' ? 'danger' : item.status === 'low' ? 'warning' : 'success'}>
                    {t(item.status)}
                  </Badge>
                </div>

                <div className="my-2">
                  <p className="text-3xl font-black text-slate-900">{item.units}</p>
                  <p className="text-xs text-slate-500">{t('safeUnitsBuffer')} ({t('minBuffer')}: {item.minBuffer})</p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                  <span>{item.lastUpdated}</span>
                  <button 
                    onClick={() => {
                      setSelectedGroup(item.group);
                      showToast(`Selected blood group ${item.group} for donation intake.`);
                    }} 
                    className="text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    {t('add')}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Two Column Section: Intake & Hospital Requests */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Intake Form */}
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600" /> {t('bbLogDonation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleAddDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">Donor Full Name</label>
                <Input 
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="e.g. Anand Kulkarni"
                  className="h-10 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">Blood Group</label>
                  <select 
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-300 font-bold text-xs bg-white"
                  >
                    {stocks.map(s => (
                      <option key={s.group} value={s.group}>{s.group} ({s.units} in stock)</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1.5">Units Donated</label>
                  <Input 
                    type="number"
                    min="1"
                    max="4"
                    value={unitsDonated}
                    onChange={(e) => setUnitsDonated(e.target.value)}
                    className="h-10 rounded-xl"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 text-xs rounded-xl shadow-sm"
              >
                + Complete Donor Intake & Update Stock
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Inter-Hospital Emergency Requests */}
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-teal-600" /> {t('bbIncomingRequests')}
            </CardTitle>
            <Badge variant="info" className="text-[10px]">Live Feed</Badge>
          </CardHeader>
          <CardContent className="pt-2 space-y-3">
            {requests.map(req => (
              <div key={req.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-extrabold text-slate-900 text-sm">{req.hospital}</span>
                    <Badge variant={req.urgency === 'EMERGENCY' ? 'danger' : req.urgency === 'HIGH' ? 'warning' : 'outline'} className="text-[10px]">
                      {req.urgency}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Requested: <strong className="text-rose-700">{req.units} unit(s) of {req.group}</strong> • {req.time}
                  </p>
                </div>

                <div>
                  {req.status === 'pending' ? (
                    <Button 
                      size="sm" 
                      onClick={() => handleDispatch(req.id, req.hospital, req.group, req.units)}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-1.5 px-3 rounded-xl shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" /> Dispatch
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

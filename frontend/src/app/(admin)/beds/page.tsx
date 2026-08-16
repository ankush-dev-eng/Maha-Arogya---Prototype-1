"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Bed as BedIcon, CheckCircle2, AlertTriangle, X, RefreshCw, Sparkles, Filter } from 'lucide-react';
import { getPersistentBeds, updatePersistentBed, BedItem } from '@/lib/store';
import { useLanguage } from '@/lib/LanguageContext';

export default function BedsPage() {
  const { t, language } = useLanguage();
  const [beds, setBeds] = useState<BedItem[]>([]);
  const [selectedBed, setSelectedBed] = useState<BedItem | null>(null);
  const [newStatus, setNewStatus] = useState<BedItem['state']>('available');
  const [patientNameInput, setPatientNameInput] = useState('');
  const [activeWardFilter, setActiveWardFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    setBeds(getPersistentBeds());

    const handleSync = () => {
      setBeds(getPersistentBeds());
    };

    window.addEventListener('bedschange', handleSync);
    return () => window.removeEventListener('bedschange', handleSync);
  }, []);

  const openBedModal = (bed: BedItem) => {
    setSelectedBed(bed);
    setNewStatus(bed.state);
    setPatientNameInput(bed.patientName || '');
  };

  const handleSaveChanges = () => {
    if (!selectedBed) return;
    const updated = updatePersistentBed(selectedBed.id, newStatus, patientNameInput);
    setBeds(updated);
    showToast(`🛏️ ${t('bedPrefix')} ${selectedBed.name.replace('Bed ', '')} status updated to "${newStatus.toUpperCase()}".`);
    setSelectedBed(null);
  };

  const availableCount = beds.filter(b => b.state === 'available').length;
  const occupiedCount = beds.filter(b => b.state === 'occupied').length;
  const reservedCount = beds.filter(b => b.state === 'reserved').length;
  const cleaningCount = beds.filter(b => b.state === 'cleaning' || b.state === 'maintenance').length;
  const discrepancyCount = beds.filter(b => b.discrepancy).length;

  const filteredBeds = activeWardFilter === 'all' 
    ? beds 
    : beds.filter(b => b.ward.toLowerCase().includes(activeWardFilter.toLowerCase()));

  const formatBedName = (name: string) => {
    const num = name.replace('Bed ', '');
    return `${t('bedPrefix')} ${num}`;
  };

  const formatWardName = (ward: string) => {
    if (ward.includes('General')) return t('wardGeneral');
    if (ward.includes('ICU')) return t('wardICU');
    if (ward.includes('Emergency')) return t('wardEmergency');
    return ward;
  };

  const formatStatus = (state: BedItem['state']) => {
    switch(state) {
      case 'available': return t('bedAvailable');
      case 'occupied': return t('bedOccupied');
      case 'reserved': return t('bedReserved');
      case 'cleaning': return t('bedCleaning');
      case 'maintenance': return t('bedMaintenance');
      default: return state;
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <BedIcon className="text-teal-600 w-8 h-8" />
            {t('bedsTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">{t('bedsSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => showToast('🔄 Bed database synchronized with HMIS & CCTV AI.')}
            className="border-slate-300 font-bold text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Sync Status
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('bedAvailable')}</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">{availableCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              🟢
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('bedOccupied')}</p>
              <p className="text-2xl font-black text-red-600 mt-0.5">{occupiedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              🔴
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('bedReserved')}</p>
              <p className="text-2xl font-black text-amber-600 mt-0.5">{reservedCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              🟡
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cleaning / Maint</p>
              <p className="text-2xl font-black text-blue-600 mt-0.5">{cleaningCount}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              🔵
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Discrepancy Banner */}
      {discrepancyCount > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between gap-3 text-amber-900 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-xs sm:text-sm">CCTV Vision AI Discrepancy Detected on {discrepancyCount} bed(s)</p>
              <p className="text-xs text-amber-700">Bed Gen-02 is listed as occupied in database, but camera vision detected vacant space. Human verification requested.</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => {
              updatePersistentBed('2', 'available');
              showToast('✅ Discrepancy resolved: Bed Gen-02 confirmed Available.');
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
          >
            Verify & Confirm Available
          </Button>
        </div>
      )}

      {/* Ward Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Wards:
        </span>
        {[
          { key: 'all', label: t('allWardsFilter') },
          { key: 'General Ward', label: t('wardGeneral') },
          { key: 'ICU', label: t('wardICU') },
          { key: 'Emergency', label: t('wardEmergency') },
        ].map(w => (
          <button
            key={w.key}
            onClick={() => setActiveWardFilter(w.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeWardFilter === w.key 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {w.label}
          </button>
        ))}
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {filteredBeds.map(bed => (
          <Card 
            key={bed.id} 
            onClick={() => openBedModal(bed)}
            className={`border-2 rounded-2xl cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all bg-white relative overflow-hidden ${
              bed.state === 'occupied' ? 'border-red-200 bg-red-50/10' :
              bed.state === 'available' ? 'border-emerald-200 bg-emerald-50/10' :
              bed.state === 'reserved' ? 'border-amber-200 bg-amber-50/10' : 'border-blue-200 bg-blue-50/10'
            }`}
          >
            {bed.discrepancy && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-bl-lg flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" /> MISMATCH
              </div>
            )}

            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">{formatBedName(bed.name)}</span>
                <span className={`w-3 h-3 rounded-full ${
                  bed.state === 'available' ? 'bg-emerald-500' :
                  bed.state === 'occupied' ? 'bg-red-500' :
                  bed.state === 'reserved' ? 'bg-amber-500' : 'bg-blue-500'
                }`} />
              </div>

              <p className="text-xs text-slate-500 font-medium">{formatWardName(bed.ward)}</p>

              {bed.patientName && (
                <div className="text-xs text-slate-700 bg-slate-100 p-1.5 rounded-md font-semibold truncate">
                  👤 {bed.patientName}
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="capitalize font-bold text-slate-800">{formatStatus(bed.state)}</span>
                <span className="text-teal-600 font-semibold hover:underline">{t('bedChangeAction')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bed Edit Modal */}
      {selectedBed && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="text-lg font-black text-slate-900">Manage {formatBedName(selectedBed.name)}</h3>
                <p className="text-xs text-slate-500">{formatWardName(selectedBed.ward)}</p>
              </div>
              <button onClick={() => setSelectedBed(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Change Status To:</label>
                <div className="grid grid-cols-2 gap-2.5">
                  {(['available', 'occupied', 'reserved', 'cleaning', 'maintenance'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      className={`p-3 rounded-xl border text-xs font-bold capitalize flex items-center justify-between transition-all ${
                        newStatus === st 
                          ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500/20' 
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t(st === 'available' ? 'bedAvailable' : st === 'occupied' ? 'bedOccupied' : st === 'reserved' ? 'bedReserved' : st === 'cleaning' ? 'bedCleaning' : 'bedMaintenance')}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        st === 'available' ? 'bg-emerald-500' :
                        st === 'occupied' ? 'bg-red-500' :
                        st === 'reserved' ? 'bg-amber-500' :
                        st === 'cleaning' ? 'bg-blue-500' : 'bg-slate-500'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {newStatus === 'occupied' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Assigned Patient Name</label>
                  <Input 
                    value={patientNameInput}
                    onChange={(e) => setPatientNameInput(e.target.value)}
                    placeholder="Enter patient full name"
                    className="h-10"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleSaveChanges} 
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 text-xs shadow-sm"
              >
                {t('saveChanges')}
              </Button>
              <Button 
                onClick={() => setSelectedBed(null)} 
                variant="outline" 
                className="border-slate-300 font-bold text-xs"
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

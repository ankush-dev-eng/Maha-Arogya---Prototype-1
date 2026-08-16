"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertCircle, Clock, MapPin, PhoneCall, CheckCircle2, Bed, Ambulance, ShieldAlert } from 'lucide-react';
import { 
  getPersistentEmergencies, 
  updatePersistentEmergencyStatus, 
  updatePersistentBed, 
  EmergencyAlertItem 
} from '@/lib/store';
import { useLanguage } from '@/lib/LanguageContext';

export default function AdminEmergencyPage() {
  const { t, language } = useLanguage();
  const [alerts, setAlerts] = useState<EmergencyAlertItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    setAlerts(getPersistentEmergencies());

    const handleSync = () => {
      setAlerts(getPersistentEmergencies());
    };

    window.addEventListener('emergencieschange', handleSync);
    return () => window.removeEventListener('emergencieschange', handleSync);
  }, []);

  const handleAcknowledge = (id: number, patientName: string) => {
    const updated = updatePersistentEmergencyStatus(id, 'acknowledged');
    setAlerts(updated);
    showToast(`✅ Case acknowledged! Receiving Trauma Team & Cath Lab alerted for ${patientName}.`);
  };

  const handleReserveBed = (id: number, patientName: string) => {
    // Hold Bed ICU-04 for 30 mins
    updatePersistentBed('12', 'reserved', patientName);
    const updated = updatePersistentEmergencyStatus(id, 'bed_reserved', 'Bed ICU-04');
    setAlerts(updated);
    showToast(`🛏️ 30-Minute Temporary Hold activated on Bed ICU-04 for ${patientName}.`);
  };

  const activeCount = alerts.filter(a => a.status !== 'arrived').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-red-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <AlertCircle className="text-red-600 w-8 h-8 animate-pulse" /> 
            {t('emergencyTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time incoming alerts from 108 Dispatch, triage escalation, and trauma bed reservation desk.
          </p>
        </div>
        <Badge variant="danger" className="text-sm px-3.5 py-1.5 animate-pulse shrink-0 font-bold">
          {activeCount} {t('emergencyActiveCount')}
        </Badge>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-4">
        {alerts.map(alert => {
          const isIncoming = alert.status === 'incoming';
          const isAcknowledged = alert.status === 'acknowledged';
          const isBedReserved = alert.status === 'bed_reserved';

          return (
            <Card 
              key={alert.id} 
              className={`rounded-3xl border-2 transition-all overflow-hidden ${
                isIncoming 
                  ? 'border-red-500 bg-red-50/20 shadow-lg shadow-red-500/10' 
                  : isBedReserved
                  ? 'border-emerald-500 bg-emerald-50/10'
                  : 'border-amber-400 bg-amber-50/10'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isIncoming 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : isBedReserved
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900">{alert.type}</h2>
                        <Badge variant={isIncoming ? 'danger' : isBedReserved ? 'success' : 'warning'}>
                          {isIncoming ? 'ACTION REQUIRED' : isBedReserved ? 'BED RESERVED (30M)' : 'ACKNOWLEDGED'}
                        </Badge>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                          #{alert.caseId}
                        </span>
                      </div>
                      
                      <p className="text-sm font-bold text-slate-800 mb-2">
                        Patient: {alert.patientName} • Ambulance: {alert.ambulanceId || '108 ALS'}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400"/> Reported: {alert.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400"/> Incident: {alert.loc}</span>
                        {alert.reservedBedId && (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Bed className="w-3.5 h-3.5 text-emerald-600"/> Reserved: {alert.reservedBedId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {isIncoming && (
                      <>
                        <Button 
                          onClick={() => handleAcknowledge(alert.id, alert.patientName)}
                          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md shadow-red-600/20"
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" /> {t('btnAcknowledge')}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => showToast(`📞 Calling 108 Paramedic for Case #${alert.caseId}...`)}
                          className="border-slate-300 text-slate-700 hover:bg-slate-100 p-2.5 rounded-xl"
                          title="Call Paramedic"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </Button>
                      </>
                    )}

                    {isAcknowledged && (
                      <>
                        <Button 
                          onClick={() => handleReserveBed(alert.id, alert.patientName)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm"
                        >
                          <Bed className="w-4 h-4 mr-1.5" /> {t('btnReserveErBed')}
                        </Button>
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-3 py-2 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledged
                        </span>
                      </>
                    )}

                    {isBedReserved && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('btnBedHeld')}
                        </span>
                        <Button 
                          variant="outline"
                          size="sm"
                          onClick={() => showToast(`🚑 Telemetry stream: Patient ETA ~4 minutes to Sassoon Trauma ER.`)}
                          className="border-slate-300 font-bold text-xs"
                        >
                          <Ambulance className="w-3.5 h-3.5 mr-1 text-teal-600" /> Track ALS
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

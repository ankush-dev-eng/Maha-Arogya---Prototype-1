"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  AlertCircle, 
  Clock, 
  MapPin, 
  PhoneCall, 
  CheckCircle2, 
  Bed, 
  Ambulance, 
  ShieldAlert, 
  Timer, 
  RotateCcw,
  XCircle,
  Activity
} from 'lucide-react';
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
  const [countdownSeconds, setCountdownSeconds] = useState<{ [id: number]: number }>({ 1: 1785, 2: 1420 });

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

  // 1-second countdown ticker for active temporary holds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => {
        const next: { [id: number]: number } = {};
        for (const [key, val] of Object.entries(prev)) {
          next[Number(key)] = Math.max(0, val - 1);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAcknowledge = (id: number, patientName: string) => {
    const updated = updatePersistentEmergencyStatus(id, 'acknowledged');
    setAlerts(updated);
    showToast(`✅ Case acknowledged! Receiving Trauma Team & Cath Lab alerted for ${patientName}.`);
  };

  const handleReserveBed = (id: number, patientName: string) => {
    // Hold Bed ICU-04 for 30 mins (1800 seconds)
    updatePersistentBed('12', 'reserved', patientName);
    const updated = updatePersistentEmergencyStatus(id, 'bed_reserved', 'Bed ICU-04');
    setAlerts(updated);
    setCountdownSeconds(prev => ({ ...prev, [id]: 1800 }));
    showToast(`🛏️ 30-Minute Temporary Hold activated on Bed ICU-04 for ${patientName}.`);
  };

  const handleConfirmAdmission = (id: number, patientName: string) => {
    updatePersistentBed('12', 'occupied', patientName);
    const updated = updatePersistentEmergencyStatus(id, 'arrived', 'Bed ICU-04 (Occupied)');
    setAlerts(updated);
    showToast(`🏥 Patient ${patientName} admitted. Bed ICU-04 transitioned to OCCUPIED.`);
  };

  const handleExtendHold = (id: number) => {
    setCountdownSeconds(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 900 // +15 mins
    }));
    showToast('⏱️ Emergency reservation hold extended by +15 minutes.');
  };

  const handleReleaseHold = (id: number) => {
    updatePersistentBed('12', 'available', undefined);
    const updated = updatePersistentEmergencyStatus(id, 'acknowledged', undefined);
    setAlerts(updated);
    showToast('🔄 Bed ICU-04 released back to general emergency pool.');
  };

  const activeCount = alerts.filter(a => a.status !== 'arrived').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-2 sm:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-red-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-lg border border-red-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 animate-pulse" /> 108 Emergency Control Desk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <AlertCircle className="text-red-500 w-7 h-7 animate-pulse" /> 
            {t('emergencyTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            {t('emergencySubtitle')}
          </p>
        </div>
        <Badge variant="danger" className="text-xs sm:text-sm px-4 py-2 animate-pulse shrink-0 font-black shadow-lg">
          {activeCount} {t('emergencyActiveCount')}
        </Badge>
      </div>

      {/* Alert Feed List */}
      <div className="space-y-5">
        {alerts.map(alert => {
          const isIncoming = alert.status === 'incoming';
          const isAcknowledged = alert.status === 'acknowledged';
          const isBedReserved = alert.status === 'bed_reserved';
          const isArrived = alert.status === 'arrived';
          const holdTimeRemaining = countdownSeconds[alert.id] || 1800;

          return (
            <Card 
              key={alert.id} 
              className={`rounded-3xl border-2 transition-all overflow-hidden ${
                isIncoming 
                  ? 'border-red-500 bg-red-50/20 shadow-lg shadow-red-500/10' 
                  : isBedReserved
                  ? 'border-emerald-500 bg-emerald-50/15 shadow-md'
                  : isArrived
                  ? 'border-slate-300 bg-slate-50 opacity-80'
                  : 'border-amber-400 bg-amber-50/10'
              }`}
            >
              <CardContent className="p-5 sm:p-6 space-y-4">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                      isIncoming 
                        ? 'bg-red-600 text-white animate-pulse' 
                        : isBedReserved
                        ? 'bg-emerald-600 text-white'
                        : isArrived
                        ? 'bg-slate-700 text-white'
                        : 'bg-amber-500 text-white'
                    }`}>
                      <ShieldAlert className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900">{alert.type}</h2>
                        <Badge variant={isIncoming ? 'danger' : isBedReserved ? 'success' : isArrived ? 'outline' : 'warning'}>
                          {isIncoming ? 'ACTION REQUIRED' : isBedReserved ? (language === 'mr' ? '३०-मिनिटे खाट आरक्षित' : language === 'hi' ? '30-मिनट बेड रिजर्व' : '30-MIN HOLD ACTIVE') : isArrived ? (language === 'mr' ? 'दाखल' : language === 'hi' ? 'भर्ती' : 'ADMITTED') : (language === 'mr' ? 'स्वीकृत' : language === 'hi' ? 'स्वीकृत' : 'ACKNOWLEDGED')}
                        </Badge>
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
                          #{alert.caseId}
                        </span>
                      </div>
                      
                      <p className="text-sm font-bold text-slate-800 mb-2">
                        {language === 'mr' ? 'रुग्ण:' : language === 'hi' ? 'मरीज:' : 'Patient:'} <span className="font-black text-slate-900">{alert.patientName}</span> • {language === 'mr' ? 'रुग्णवाहिका:' : language === 'hi' ? 'एम्बुलेंस:' : 'Ambulance:'} <span className="font-mono text-teal-700 font-bold">{alert.ambulanceId || '108 ALS Unit 04'}</span>
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400"/> {language === 'mr' ? 'वेळ:' : language === 'hi' ? 'समय:' : 'Reported:'} {alert.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400"/> {language === 'mr' ? 'घटनास्थळ:' : language === 'hi' ? 'स्थान:' : 'Incident:'} {alert.loc}</span>
                        {alert.reservedBedId && (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold">
                            <Bed className="w-3.5 h-3.5 text-emerald-600"/> {language === 'mr' ? 'आरक्षित खाट:' : language === 'hi' ? 'आरक्षित बेड:' : 'Reserved:'} {alert.reservedBedId}
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
                          className="bg-red-600 hover:bg-red-700 text-white font-black text-xs py-2.5 px-4 rounded-xl shadow-md shadow-red-600/20"
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
                          <Bed className="w-4 h-4 mr-1.5" /> {t('btnReserveErBed')} (30m Hold)
                        </Button>
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-emerald-100 px-3 py-2 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {language === 'mr' ? 'स्वीकृत' : language === 'hi' ? 'स्वीकृत' : 'Acknowledged'}
                        </span>
                      </>
                    )}

                    {isBedReserved && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          onClick={() => handleConfirmAdmission(alert.id, alert.patientName)}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs py-2 px-3 rounded-xl shadow-xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {t('emgConfirmArrival')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleExtendHold(alert.id)}
                          className="border-slate-300 text-xs font-bold"
                          title="Extend 15 Mins"
                        >
                          <RotateCcw className="w-3.5 h-3.5 mr-1 text-teal-600" /> {t('emgExtendHold')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReleaseHold(alert.id)}
                          className="border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold"
                          title="Release Hold"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" /> {t('emgReleaseBed')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 30-Minute Hold Live Countdown Bar */}
                {isBedReserved && (
                  <div className="bg-emerald-950 text-white p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 border border-emerald-500/30">
                    <div className="flex items-center gap-2.5">
                      <Timer className="w-5 h-5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
                      <div>
                        <p className="text-xs font-black uppercase text-emerald-300">
                          {language === 'mr' ? 'तातडीचे खाट आरक्षण सक्रिय (Bed ICU-04)' : language === 'hi' ? 'आपातकालीन बेड रिजर्वेशन सक्रिय (Bed ICU-04)' : 'Temporary Emergency Hold Active (Bed ICU-04)'}
                        </p>
                        <p className="text-[11px] text-slate-300">
                          {language === 'mr' ? 'रुग्ण न आल्यास खाट आपोआप खुली होईल.' : language === 'hi' ? 'मरीज के न आने पर बेड स्वतः मुक्त हो जाएगा।' : 'Auto-releases if patient does not arrive or staff does not extend.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-slate-400 mr-2 font-mono">{language === 'mr' ? 'उर्वरित वेळ:' : language === 'hi' ? 'बचा समय:' : 'Time Left:'}</span>
                        <span className="text-base sm:text-lg font-mono font-black text-emerald-400 bg-black/50 px-3 py-1 rounded-xl border border-emerald-500/40">
                          {formatTimer(holdTimeRemaining)}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-teal-300 border-teal-500/40">
                        {language === 'mr' ? 'रुग्णवाहिका आगमन ~४ मि.' : language === 'hi' ? 'एम्बुलेंस आगमन ~4 मिनट' : 'Ambulance ETA ~4m'}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

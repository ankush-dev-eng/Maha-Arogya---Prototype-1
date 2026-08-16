"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  MapPin, 
  Clock, 
  PhoneCall, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowLeft, 
  Navigation, 
  Bed, 
  Truck,
  ExternalLink,
  Compass
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/LanguageContext';

export default function EmergencyPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => {
          setUserCoords({ lat: 18.5018, lng: 73.8636 });
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  }, []);

  const handleOpenLiveRoute = () => {
    const originLat = userCoords ? userCoords.lat : 18.5018;
    const originLng = userCoords ? userCoords.lng : 73.8636;
    const destinationLat = 18.5204;
    const destinationLng = 73.8567;

    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destinationLat},${destinationLng}&travelmode=driving`;
    window.open(gmapsUrl, '_blank');
    showToast('🗺️ Live ALS 108 Ambulance GPS Route & Green Corridor opened in Google Maps!');
  };

  const handleCall108 = () => {
    showToast('📞 Initiating emergency dispatch call to Maharashtra 108 Emergency Control Center...');
    window.location.href = 'tel:108';
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-red-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Emergency Header Banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-rose-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-white animate-ping" />
          <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
            MahaJeevan Emergency Dispatch
          </span>
          <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-full">Case #EM-9182</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">{t('emgTitle')}</h1>
        <p className="text-xs sm:text-sm text-red-100 max-w-xl leading-relaxed">
          {t('emgSubtitle')}
        </p>

        <div className="pt-2 flex flex-wrap gap-3">
          <Button 
            onClick={handleCall108}
            className="bg-white hover:bg-slate-100 text-red-700 font-black text-xs px-5 py-2.5 rounded-xl shadow-md"
          >
            <PhoneCall className="w-4 h-4 mr-2 text-red-600" /> {t('emgCall108')}
          </Button>
          <Button 
            onClick={() => router.push('/triage')}
            variant="outline" 
            className="bg-transparent border-white/40 text-white hover:bg-white/10 text-xs font-bold rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> {t('emgReturnTriage')}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Timeline Stepper */}
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="p-6">
            <h2 className="text-base font-black text-slate-900 mb-5 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" /> {t('emgTimeline')}
            </h2>

            <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-3">
              {/* Step 1 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <p className="text-sm font-extrabold text-slate-900">{t('emgCaseCreated')}</p>
                <p className="text-xs text-slate-500 mt-0.5">Case #EM-9182 flagged as Level 1 Cardiac Emergency.</p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <p className="text-sm font-extrabold text-slate-900">{t('emgHospitalAlerted')}</p>
                <p className="text-xs text-slate-500 mt-0.5">Sassoon General Hospital ER acknowledged. 30-min ICU Bed hold active.</p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold animate-pulse">
                  3
                </span>
                <p className="text-sm font-extrabold text-red-600">{t('emgAmbulanceEnRoute')}</p>
                <p className="text-xs text-slate-600 mt-0.5">108 Advanced Life Support unit #MH-12-EM-9912 moving to your GPS location.</p>
              </div>

              {/* Step 4 */}
              <div className="relative opacity-50">
                <span className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p className="text-sm font-extrabold text-slate-700">{t('emgArrivalDirect')}</p>
                <p className="text-xs text-slate-500 mt-0.5">Trauma team prepped for immediate catheterization.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Ambulance & Hospital Details */}
        <div className="space-y-4">
          <Card className="rounded-3xl border-2 border-red-200 bg-red-50/20 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{t('emgAmbulanceCard')}</h3>
                  <p className="text-xs text-red-600 font-black mt-0.5">{t('emgEta')}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-700 bg-white p-3.5 rounded-2xl border border-red-100">
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500 font-medium">Ambulance ID:</span>
                  <span className="font-mono text-slate-900">MH-12-EM-9912 (ALS-Unit)</span>
                </div>
                <div className="flex justify-between border-b pb-1.5">
                  <span className="text-slate-500 font-medium">{t('emgParamedic')}:</span>
                  <span className="text-slate-900">Officer Vikas Shinde</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">{t('emgEquipment')}:</span>
                  <span className="text-emerald-700 font-extrabold">Ventilator, Defibrillator, O2</span>
                </div>
              </div>

              <Button 
                onClick={handleOpenLiveRoute}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-teal-400" />
                <span>{t('emgViewRoute')}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6 space-y-3">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-600" /> {t('emgReceivingHospital')}
              </h3>
              <div>
                <p className="font-black text-slate-900 text-base">Sassoon General Hospital Trauma ER</p>
                <p className="text-xs text-slate-500">Near Pune Railway Station • ER Bed #ICU-04 pre-reserved</p>
              </div>
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Staff Acknowledged at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Cath Lab & Cardiologist on standby
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

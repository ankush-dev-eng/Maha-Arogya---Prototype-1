"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Clock, 
  User, 
  QrCode, 
  Bell, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface TokenData {
  tokenNumber: string;
  hospitalName: string;
  hospitalAddress: string;
  department: string;
  roomNo: string;
  currentToken: string;
  estimatedWaitMinutes: number;
  peopleAhead: number;
  date: string;
  slot: string;
  patientName: string;
}

export default function QueuePage() {
  const router = useRouter();
  const [token, setToken] = useState<TokenData | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('maha_active_token');
    if (savedToken) {
      try {
        setToken(JSON.parse(savedToken));
      } catch (e) {
        setToken(null);
      }
    }
  }, []);

  const generateDemoToken = () => {
    const newDemoToken: TokenData = {
      tokenNumber: 'A-108',
      hospitalName: 'Sassoon General Hospital',
      hospitalAddress: 'Near Pune Railway Station, Sassoon Road',
      department: 'Cardiology OPD',
      roomNo: 'Room 102',
      currentToken: 'A-104',
      estimatedWaitMinutes: 20,
      peopleAhead: 4,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      slot: '10:30 AM - 11:00 AM',
      patientName: 'Rajesh Patil'
    };
    localStorage.setItem('maha_active_token', JSON.stringify(newDemoToken));
    setToken(newDemoToken);
    showToast('🎫 Demo OPD Token A-108 generated successfully!');
  };

  const cancelToken = () => {
    localStorage.removeItem('maha_active_token');
    setToken(null);
    showToast('🗑️ OPD Token cancelled.');
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">MahaOPD Smart Token Tracker</h1>
          <p className="text-sm text-slate-500">Live dynamic queue status, estimated wait times & appointment windows.</p>
        </div>
        {token && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={cancelToken} 
            className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Cancel Token
          </Button>
        )}
      </div>

      {/* When NO token is booked */}
      {!token ? (
        <Card className="border-2 border-dashed border-slate-300 bg-white p-8 sm:p-12 text-center rounded-3xl shadow-sm">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 mb-6 shadow-sm">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active OPD Token Found</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-8">
            You have not booked an appointment slot yet. Start with our AI Symptom Triage for care guidance or select a nearby hospital to issue a digital token.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <Button 
              onClick={() => router.push('/triage')} 
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 text-sm shadow-md shadow-teal-600/20"
            >
              🎙️ Start AI Symptom Triage
            </Button>
            <Button 
              onClick={() => router.push('/hospitals')} 
              variant="outline"
              className="w-full border-slate-300 hover:bg-slate-50 font-bold py-3 text-sm"
            >
              <MapPin className="w-4 h-4 mr-2 text-teal-600" /> Explore Hospitals
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Quick Hackathon Testing</p>
            <button 
              onClick={generateDemoToken}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" /> Generate Demo Cardiology Token (A-108)
            </button>
          </div>
        </Card>
      ) : (
        /* When Token is ACTIVE */
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <Card className="overflow-hidden border-2 border-teal-500 shadow-xl shadow-teal-500/10 rounded-3xl bg-white">
            <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 text-white p-6 sm:p-8 text-center relative overflow-hidden">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-teal-100 text-xs font-bold mb-3 border border-white/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-200" /> Active Verified Appointment
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{token.hospitalName}</h2>
              <p className="text-sm text-teal-100 font-medium mt-0.5">{token.department} • {token.slot}</p>
            </div>

            <CardContent className="p-6 sm:p-8 text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">YOUR DIGITAL TOKEN</p>
              <div className="text-6xl sm:text-7xl font-black text-slate-900 my-4 tracking-tighter">
                {token.tokenNumber}
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-8">Patient: {token.patientName} • {token.roomNo}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left border-t border-slate-100 pt-6">
                <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal-600"/> Est. Wait</p>
                  <p className="text-xl font-black text-slate-900">~{token.estimatedWaitMinutes} mins</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <p className="text-xs text-slate-500 mb-1 flex items-center gap-1"><User className="w-3.5 h-3.5 text-blue-600"/> Ahead of You</p>
                  <p className="text-xl font-black text-slate-900">{token.peopleAhead} patients</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Now Consulting</p>
                  <p className="text-xl font-black text-teal-600">{token.currentToken}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Consulting Desk</p>
                  <p className="text-xl font-black text-slate-900">{token.roomNo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queue Movement Progress Bar */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Live Queue Progression</h3>
                <p className="text-xs text-slate-500">Tokens are called sequentially by the consulting physician.</p>
              </div>
              <Badge variant="success" className="animate-pulse">● Live Sync</Badge>
            </div>

            <div className="relative pt-2">
              <div className="flex mb-2 items-center justify-between text-xs font-bold text-slate-600">
                <span>Current Token: {token.currentToken}</span>
                <span className="text-teal-600">Your Turn: {token.tokenNumber}</span>
              </div>
              <div className="overflow-hidden h-3 rounded-full bg-slate-100 flex">
                <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-teal-500 transition-all duration-500"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                onClick={() => setShowQrModal(true)} 
                variant="outline" 
                className="flex-1 border-slate-300 font-semibold"
              >
                <QrCode className="mr-2 w-4 h-4 text-slate-600" /> Show Fast-Pass QR
              </Button>
              <Button 
                onClick={() => showToast('🔔 SMS & WhatsApp notifications enabled! We will alert you 5 minutes before your turn.')} 
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-sm"
              >
                <Bell className="mr-2 w-4 h-4" /> Notify Me at 5 Mins
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-slate-900">Hospital Check-in QR</h3>
            <p className="text-xs text-slate-500">Scan at the OPD reception scanner for touchless arrival verification.</p>
            <div className="w-48 h-48 mx-auto bg-slate-900 rounded-2xl flex items-center justify-center text-white p-4">
              <QrCode className="w-36 h-36" />
            </div>
            <p className="text-sm font-black text-slate-900">TOKEN: {token?.tokenNumber}</p>
            <Button onClick={() => setShowQrModal(false)} className="w-full bg-slate-900 hover:bg-slate-800 text-white">
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

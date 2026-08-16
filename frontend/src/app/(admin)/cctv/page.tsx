"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Video, AlertTriangle, CheckCircle, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { updatePersistentBed } from '@/lib/store';

export default function CCTVPage() {
  const [discrepancyResolved, setDiscrepancyResolved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleResolveDiscrepancy = () => {
    updatePersistentBed('2', 'occupied', 'Ramesh Patil (Verified via CCTV)');
    setDiscrepancyResolved(true);
    showToast('✅ HMIS synchronized: Bed Gen-02 updated to OCCUPIED as verified by ward staff.');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-2 sm:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Video className="w-7 h-7 text-indigo-600" /> AI Vision Analytics (CCTV Telemetry)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time computer vision bed occupancy verification & human-in-the-loop discrepancy auditing.
          </p>
        </div>
        <Badge variant="success" className="px-3 py-1 font-bold animate-pulse">
          ● 42 Cameras Online
        </Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Camera HUD */}
        <div className="md:col-span-2 space-y-4">
          <Card className="overflow-hidden bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-xl">
            <div className="relative aspect-video bg-black flex items-center justify-center p-4">
              {/* Simulated CCTV feed overlay */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                <Badge variant="danger" className="animate-pulse flex gap-1.5 items-center font-black">
                  <span className="w-2 h-2 rounded-full bg-white"></span> LIVE STREAM
                </Badge>
                <Badge className="bg-black/60 text-white border border-white/20">General Ward A • Cam 01 (South)</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3 w-full h-full p-2">
                {[
                  { num: 1, label: 'EMPTY (99%)', color: 'border-emerald-500 bg-emerald-500/15 text-emerald-400' },
                  { num: 2, label: discrepancyResolved ? 'OCCUPIED (98%) [SYNCED]' : 'OCCUPIED (98%) [MISMATCH]', color: discrepancyResolved ? 'border-red-500 bg-red-500/15 text-red-400' : 'border-amber-500 bg-amber-500/25 text-amber-300 ring-2 ring-amber-400 animate-pulse' },
                  { num: 3, label: 'EMPTY (99%)', color: 'border-emerald-500 bg-emerald-500/15 text-emerald-400' },
                  { num: 4, label: 'EMPTY (99%)', color: 'border-emerald-500 bg-emerald-500/15 text-emerald-400' },
                  { num: 5, label: 'CLEANING (85%)', color: 'border-blue-500 bg-blue-500/15 text-blue-400' },
                  { num: 6, label: 'EMPTY (99%)', color: 'border-emerald-500 bg-emerald-500/15 text-emerald-400' },
                ].map(b => (
                  <div key={b.num} className={`border-2 rounded-2xl flex flex-col justify-between p-2.5 transition-all ${b.color}`}>
                    <span className="text-[11px] font-black opacity-80">BED GEN-0{b.num}</span>
                    <span className="text-[10px] font-black bg-black/80 px-2 py-0.5 rounded-md w-fit shadow-xs">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
              <span>Inference Engine: MahaVision YOLO-v8n</span>
              <span>Inference Latency: 118ms</span>
              <span>Telemetry: 30 FPS • 1080p</span>
            </div>
          </Card>
        </div>

        {/* Right Column: Discrepancy & Stats */}
        <div className="space-y-4">
          <Card className="border border-slate-200 shadow-sm rounded-3xl bg-white">
            <CardContent className="p-5">
              <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Discrepancy Auditing Desk
              </h3>
              
              <div className="space-y-3">
                {!discrepancyResolved ? (
                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="font-black text-sm">Bed Gen-02 Mismatch</p>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      Hospital DB listed bed as Available, but CCTV AI camera detected a patient in bed (98% confidence).
                    </p>
                    <Button 
                      size="sm"
                      onClick={handleResolveDiscrepancy}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-2 rounded-xl mt-2 shadow-2xs"
                    >
                      <ShieldCheck className="w-4 h-4 mr-1.5" /> Confirm Occupied & Update HMIS
                    </Button>
                  </div>
                ) : (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-950 flex items-center gap-2.5">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-black text-xs">Bed Gen-02 Synchronized</p>
                      <p className="text-[11px] text-emerald-700">Verified by Nurse on duty at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.</p>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-slate-900 text-xs">General Ward B Synchronized</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">100% telemetry match between HMIS and camera bounding boxes.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm rounded-3xl bg-white">
            <CardContent className="p-5">
              <h3 className="font-extrabold text-slate-900 text-base mb-3">AI Vision Telemetry KPIs</h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Active RTSP Camera Streams</span> 
                  <span className="font-extrabold text-slate-900">42 / 45 Online</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500 font-semibold">Mean Average Precision (mAP)</span> 
                  <span className="font-extrabold text-emerald-600">98.4% Confidence</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Total Hospital Beds Tracked</span> 
                  <span className="font-extrabold text-slate-900">350 Beds</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Stethoscope, 
  User, 
  Activity, 
  Heart, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  Bed,
  Plus,
  Clock,
  ShieldCheck,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { getPersistentBeds, updatePersistentBed } from '@/lib/store';

interface DoctorPatient {
  id: string;
  token: string;
  name: string;
  age: number;
  gender: string;
  complaint: string;
  risk: 'low' | 'moderate' | 'high' | 'emergency';
  vitals: {
    bp: string;
    spo2: string;
    hr: string;
    temp: string;
  };
  symptoms: string[];
  allergies: string[];
  status: 'in_consultation' | 'waiting' | 'completed' | 'admitted';
  admittedBed?: string;
  initialRx: string;
}

const ROTATION_PATIENTS: DoctorPatient[] = [
  {
    id: 'p1',
    token: 'A-102',
    name: 'Rajesh Patil',
    age: 45,
    gender: 'Male',
    complaint: 'Chest pressure & shortness of breath on exertion',
    risk: 'high',
    vitals: { bp: '145/95 mmHg', spo2: '94%', hr: '104 bpm', temp: '98.6°F' },
    symptoms: ['Chest Pain (Severe)', 'Breathlessness', 'Sweating'],
    allergies: ['Penicillin'],
    status: 'in_consultation',
    initialRx: 'Tab. Sorbitrate 5mg sublingual SOS\nTab. Aspirin 75mg OD\nTab. Atorvastatin 20mg HS'
  },
  {
    id: 'p2',
    token: 'A-103',
    name: 'Sunita Deshpande',
    age: 32,
    gender: 'Female',
    complaint: 'Persistent high fever & dry cough for 4 days',
    risk: 'moderate',
    vitals: { bp: '118/76 mmHg', spo2: '98%', hr: '88 bpm', temp: '102.2°F' },
    symptoms: ['Pyrexia', 'Body Aches', 'Fatigue'],
    allergies: ['Sulfa drugs'],
    status: 'waiting',
    initialRx: 'Tab. Paracetamol 650mg TDS x 3 days\nTab. Azithromycin 500mg OD x 3 days\nSyrup Levocetirizine 5ml HS'
  },
  {
    id: 'p3',
    token: 'A-104',
    name: 'Amit Kumar Singh',
    age: 58,
    gender: 'Male',
    complaint: 'Post-CABG routine follow-up & hypertension review',
    risk: 'low',
    vitals: { bp: '130/82 mmHg', spo2: '99%', hr: '72 bpm', temp: '98.4°F' },
    symptoms: ['Mild exertional fatigue'],
    allergies: ['None known'],
    status: 'waiting',
    initialRx: 'Tab. Telmisartan 40mg OD\nTab. Metoprolol 25mg OD\nTab. Eco-sprin 75mg OD'
  },
  {
    id: 'p4',
    token: 'A-105',
    name: 'Mohan Gavhane',
    age: 67,
    gender: 'Male',
    complaint: 'Acute bilateral ankle swelling & orthopnea',
    risk: 'high',
    vitals: { bp: '160/100 mmHg', spo2: '92%', hr: '96 bpm', temp: '98.8°F' },
    symptoms: ['Pedal Edema', 'Orthopnea', 'Hypertensive Urgency'],
    allergies: ['NSAIDs'],
    status: 'waiting',
    initialRx: 'Inj. Furosemide 20mg IV stat\nTab. Torsemide 10mg OD'
  },
  {
    id: 'p5',
    token: 'A-106',
    name: 'Kavita Shinde',
    age: 28,
    gender: 'Female',
    complaint: 'Severe migraine headache with photophobia & nausea',
    risk: 'moderate',
    vitals: { bp: '114/72 mmHg', spo2: '99%', hr: '76 bpm', temp: '98.4°F' },
    symptoms: ['Unilateral Throbbing Headache', 'Nausea', 'Photophobia'],
    allergies: ['Aspirin'],
    status: 'waiting',
    initialRx: 'Tab. Naproxen 500mg + Domperidone 10mg SOS\nTab. Flunarizine 5mg HS'
  },
  {
    id: 'p6',
    token: 'A-107',
    name: 'Nitin Borse',
    age: 52,
    gender: 'Male',
    complaint: 'Acute diabetic foot ulcer with localized redness',
    risk: 'high',
    vitals: { bp: '138/88 mmHg', spo2: '97%', hr: '84 bpm', temp: '99.8°F' },
    symptoms: ['Right Plantar Ulcer', 'Purulent Discharge', 'Peripheral Neuropathy'],
    allergies: ['None known'],
    status: 'waiting',
    initialRx: 'Tab. Augmentin 625mg BD x 7 days\nDaily Saline Dressing & Offloading Footwear'
  },
  {
    id: 'p7',
    token: 'A-108',
    name: 'Pooja Jadhav',
    age: 24,
    gender: 'Female',
    complaint: 'Acute asthma flare-up with wheezing & chest tightness',
    risk: 'high',
    vitals: { bp: '122/80 mmHg', spo2: '91%', hr: '110 bpm', temp: '98.6°F' },
    symptoms: ['Expiratory Wheeze', 'Dyspnea', 'Tachypnea'],
    allergies: ['Dust Mites', 'Ibuprofen'],
    status: 'waiting',
    initialRx: 'Nebulization with Salbutamol + Ipratropium stat\nInhaler Budecort 200mcg BD'
  },
  {
    id: 'p8',
    token: 'A-109',
    name: 'Anand Kulkarni',
    age: 41,
    gender: 'Male',
    complaint: 'Severe acute lumbar back pain radiating to left leg',
    risk: 'moderate',
    vitals: { bp: '128/84 mmHg', spo2: '98%', hr: '80 bpm', temp: '98.4°F' },
    symptoms: ['Sciatica', 'L4-L5 Tenderness', 'SLR Positive (40°)'],
    allergies: ['Codeine'],
    status: 'waiting',
    initialRx: 'Tab. Aceclofenac + Paracetamol + Thiocolchicoside BD x 5 days\nLumbar MRI advised'
  }
];

export default function DoctorPage() {
  const { t } = useLanguage();
  const [queue, setQueue] = useState<DoctorPatient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p1');
  const [rxText, setRxText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const saved = localStorage.getItem('maha_doc_queue');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.length > 0) {
          setQueue(parsed);
          const active = parsed.find((p: DoctorPatient) => p.status === 'in_consultation') || parsed[0];
          if (active) {
            setSelectedPatientId(active.id);
            setRxText(active.initialRx);
          }
          return;
        }
      } catch (e) {}
    }
    setQueue(ROTATION_PATIENTS.slice(0, 4));
    setSelectedPatientId('p1');
    setRxText(ROTATION_PATIENTS[0].initialRx);
  }, []);

  const saveQueue = (updated: DoctorPatient[]) => {
    setQueue(updated);
    localStorage.setItem('maha_doc_queue', JSON.stringify(updated));
  };

  const selectedPatient = queue.find(p => p.id === selectedPatientId) || queue[0];

  const handleSelectPatient = (patient: DoctorPatient) => {
    setSelectedPatientId(patient.id);
    setRxText(patient.initialRx);
  };

  const handleCallNext = () => {
    const waiting = queue.find(p => p.status === 'waiting');
    
    if (!waiting) {
      // Rotate in a fresh unique patient from pool
      const existingNames = new Set(queue.map(p => p.name));
      const freshTemplate = ROTATION_PATIENTS.find(p => !existingNames.has(p.name)) || {
        id: `p_${Date.now()}`,
        token: `A-${110 + queue.length}`,
        name: `Santosh Gaikwad`,
        age: 49,
        gender: 'Male',
        complaint: 'Acute epigastric burning pain & sour eructation',
        risk: 'moderate' as const,
        vitals: { bp: '130/84 mmHg', spo2: '98%', hr: '78 bpm', temp: '98.6°F' },
        symptoms: ['GERD', 'Epigastric Tenderness'],
        allergies: ['None known'],
        status: 'in_consultation' as const,
        initialRx: 'Tab. Pantoprazole 40mg OD before breakfast\nSyrup Sucralfate 10ml TDS'
      };

      const newPatient: DoctorPatient = {
        ...freshTemplate,
        id: `p_${Date.now()}`,
        token: `A-${100 + queue.length + 2}`,
        status: 'in_consultation' as const
      };

      const updated = queue.map(p => p.status === 'in_consultation' ? { ...p, status: 'completed' as const } : p);
      const withNew = [newPatient, ...updated];
      saveQueue(withNew);
      setSelectedPatientId(newPatient.id);
      setRxText(newPatient.initialRx);
      showToast(`🔔 Rotated Queue: Called Token #${newPatient.token} (${newPatient.name}) to Consultation Room 102.`);
      return;
    }

    const updated = queue.map(p => {
      if (p.id === waiting.id) return { ...p, status: 'in_consultation' as const };
      if (p.status === 'in_consultation') return { ...p, status: 'completed' as const };
      return p;
    });
    saveQueue(updated);
    setSelectedPatientId(waiting.id);
    setRxText(waiting.initialRx);
    showToast(`🔔 Called Token #${waiting.token} (${waiting.name}) to Consultation Room 102.`);
  };

  const handleCompleteRx = () => {
    if (!selectedPatient) return;
    const updated = queue.map(p => p.id === selectedPatient.id ? { ...p, status: 'completed' as const, initialRx: rxText } : p);
    saveQueue(updated);
    showToast(`✅ Electronic Prescription & ABHA record signed & sent to Pharmacy for ${selectedPatient.name}.`);
    
    // Auto-advance to next waiting
    const nextWaiting = updated.find(p => p.status === 'waiting');
    if (nextWaiting) {
      setSelectedPatientId(nextWaiting.id);
      setRxText(nextWaiting.initialRx);
    }
  };

  const handleAdmitToWard = () => {
    if (!selectedPatient) return;

    // Dynamically search for the first available bed in real-time
    const beds = getPersistentBeds();
    const availableBed = beds.find(b => b.state === 'available') || beds.find(b => b.state === 'cleaning') || beds[0];
    
    updatePersistentBed(availableBed.id, 'occupied', `${selectedPatient.name} (Admitted via Dr. OPD)`);
    
    const updated = queue.map(p => p.id === selectedPatient.id ? { 
      ...p, 
      status: 'admitted' as const, 
      admittedBed: `${availableBed.name} (${availableBed.ward})`,
      initialRx: rxText 
    } : p);
    saveQueue(updated);

    showToast(`🛏️ Inpatient Admission Confirmed: ${selectedPatient.name} assigned to ${availableBed.name} (${availableBed.ward}).`);

    // Auto-advance to next waiting
    const nextWaiting = updated.find(p => p.status === 'waiting');
    if (nextWaiting) {
      setSelectedPatientId(nextWaiting.id);
      setRxText(nextWaiting.initialRx);
    }
  };

  const handleResetQueue = () => {
    setQueue(ROTATION_PATIENTS.slice(0, 4));
    setSelectedPatientId('p1');
    setRxText(ROTATION_PATIENTS[0].initialRx);
    localStorage.removeItem('maha_doc_queue');
    showToast('🔄 Doctor Consultation queue refreshed with initial patients.');
  };

  const waitingCount = queue.filter(p => p.status === 'waiting').length;
  const completedCount = queue.filter(p => p.status === 'completed' || p.status === 'admitted').length;
  const isFinished = selectedPatient?.status === 'completed' || selectedPatient?.status === 'admitted';

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
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2.5">
            <Stethoscope className="text-teal-600 w-8 h-8" />
            {t('docTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('docSubtitle')}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button 
            variant="outline"
            onClick={handleResetQueue}
            className="border-slate-300 font-bold text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Reset Queue
          </Button>
          <Button 
            onClick={handleCallNext}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm shadow-teal-600/20"
          >
            <Plus className="w-4 h-4 mr-1.5" /> {t('docCallNext')}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Queue List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-4 bg-slate-50 border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black text-slate-900">{t('docTodaysQueue')}</CardTitle>
                <p className="text-xs text-slate-500">{waitingCount} waiting • {completedCount} completed/admitted</p>
              </div>
              <Badge variant="info" className="text-xs font-bold">
                Token {selectedPatient?.token || 'A-102'} Active
              </Badge>
            </CardHeader>

            <CardContent className="p-3 space-y-2 max-h-[calc(100vh-22rem)] overflow-y-auto">
              {queue.map(p => {
                const isSelected = p.id === selectedPatientId;
                const isDone = p.status === 'completed' || p.status === 'admitted';
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPatient(p)}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-teal-600 bg-teal-50/40 shadow-sm' 
                        : isDone
                        ? 'border-emerald-100 bg-emerald-50/30'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-slate-900">{p.token}</span>
                        <span className="font-extrabold text-sm text-slate-900">{p.name}</span>
                        <span className="text-xs text-slate-500">({p.age}y/{p.gender[0]})</span>
                      </div>
                      <Badge variant={p.risk === 'high' || p.risk === 'emergency' ? 'danger' : p.risk === 'moderate' ? 'warning' : 'success'} className="text-[10px]">
                        {p.risk.toUpperCase()}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600 font-medium line-clamp-1 mb-2">
                      Complaint: {p.complaint}
                    </p>

                    <div className="flex items-center justify-between text-[11px] font-semibold pt-1 border-t border-slate-100">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3" /> {isDone ? 'Seen' : 'Wait: ~10 mins'}
                      </span>
                      <span className={`capitalize font-bold ${
                        p.status === 'admitted' ? 'text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md' :
                        p.status === 'completed' ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md' :
                        p.status === 'in_consultation' ? 'text-teal-600 font-black' : 'text-slate-500'
                      }`}>
                        ● {p.status === 'admitted' ? 'Admitted' : p.status === 'completed' ? 'Completed' : p.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Patient Consultation HUD (7 cols) */}
        {selectedPatient && (
          <div className="lg:col-span-7 space-y-4">
            <Card className="rounded-3xl border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-black text-slate-900">{selectedPatient.name}</h2>
                      <span className="font-mono text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg font-bold">
                        Token {selectedPatient.token}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedPatient.age} years • {selectedPatient.gender}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      <strong className="text-slate-800">Chief Complaint:</strong> {selectedPatient.complaint}
                    </p>
                  </div>
                  <Badge variant={selectedPatient.risk === 'high' ? 'danger' : 'warning'} className="text-xs font-bold shrink-0">
                    {selectedPatient.risk.toUpperCase()} RISK
                  </Badge>
                </div>

                {/* Pre-Triage Vitals Grid */}
                <div className="mb-4">
                  <p className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-teal-600" /> {t('docPreTriageVitals')}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Blood Pressure</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{selectedPatient.vitals.bp}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">SpO2 Oxygen</span>
                      <p className="text-sm font-black text-teal-600 mt-0.5">{selectedPatient.vitals.spo2}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Heart Rate</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{selectedPatient.vitals.hr}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Temperature</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5">{selectedPatient.vitals.temp}</p>
                    </div>
                  </div>
                </div>

                {/* AI Extracted Symptoms & Allergies */}
                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-3.5 bg-teal-50/40 rounded-2xl border border-teal-200">
                    <span className="text-[11px] font-black text-teal-900 uppercase tracking-wider block mb-2">
                      {t('docExtractedSymptoms')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.symptoms.map(s => (
                        <span key={s} className="px-2 py-0.5 bg-white border border-teal-300 rounded-md text-xs font-bold text-teal-900 shadow-2xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 bg-red-50/40 rounded-2xl border border-red-200">
                    <span className="text-[11px] font-black text-red-900 uppercase tracking-wider block mb-2 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 text-red-600" /> {t('docAllergies')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPatient.allergies.map(a => (
                        <span key={a} className="px-2 py-0.5 bg-white border border-red-300 rounded-md text-xs font-bold text-red-800 shadow-2xs">
                          ⚠️ {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Electronic Prescription Editor */}
                <div className="space-y-2 mb-4">
                  <label className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-600" /> {t('docRx')}
                  </label>
                  <textarea
                    rows={4}
                    disabled={isFinished}
                    value={rxText}
                    onChange={(e) => setRxText(e.target.value)}
                    placeholder="Type prescription medications, dosage, frequency and advice..."
                    className="w-full p-3.5 rounded-2xl border border-slate-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 font-mono text-xs text-slate-900 bg-slate-50/50 resize-none outline-none leading-relaxed disabled:opacity-80 font-bold"
                  />
                </div>

                {/* Permanent Status Confirmation or Action Buttons */}
                {isFinished ? (
                  <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                    selectedPatient.status === 'admitted' ? 'bg-purple-50 border-purple-300 text-purple-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}>
                    <span className="font-bold text-xs flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      {selectedPatient.admittedBed 
                        ? `${t('docPatientAdmitted')}: ${selectedPatient.admittedBed}` 
                        : t('docConsultationCompleted')}
                    </span>
                    <Badge variant={selectedPatient.status === 'admitted' ? 'info' : 'success'}>
                      {selectedPatient.status.toUpperCase()}
                    </Badge>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                      onClick={handleCompleteRx}
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 text-xs shadow-sm shadow-teal-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1.5" /> {t('docCompleteRx')}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={handleAdmitToWard}
                      className="border-red-300 text-red-700 hover:bg-red-50 font-bold text-xs py-2.5 px-4"
                    >
                      <Bed className="w-4 h-4 mr-1.5" /> {t('docAdmitWard')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

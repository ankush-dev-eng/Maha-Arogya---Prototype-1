"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { FileText, Pill, Activity, Calendar, UploadCloud, CheckCircle2, ShieldCheck, Download, X } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/lib/LanguageContext';
import { downloadPatientLabPDF, downloadPrescriptionPDF, downloadDiagnosticECGPDF } from '@/lib/pdfGenerator';

export default function RecordsPage() {
  const { t, language } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSync = () => {
    showToast(language === 'mr' ? '🔄 आभा (ABHA) नेटवर्कशी समक्रमित केले (२ नवीन लॅब अहवाल प्राप्त).' : language === 'hi' ? '🔄 आभा (ABHA) नेटवर्क से सिंक किया गया (2 नई लैब रिपोर्ट प्राप्त)।' : '🔄 Synchronized with National ABHA Health Network (2 new lab records fetched).');
  };

  const handleUploadReport = () => {
    showToast(language === 'mr' ? '📄 रक्त अहवाल अपलोड केला. एआय विश्लेषण: हिमोग्लोबिन: १३.८ g/dL, प्लेटलेट्स: २४०,००० /mcL (सामान्य).' : language === 'hi' ? '📄 ब्लड रिपोर्ट अपलोड की गई। एआई विश्लेषण: हीमोग्लोबिन: 13.8 g/dL, प्लेटलेट्स: 240,000 /mcL (सामान्य)।' : '📄 Blood Report uploaded. AI extraction parsed: Hemoglobin: 13.8 g/dL, Platelets: 240,000 /mcL (Normal).');
    setActiveModal('report');
  };

  const handleDownloadFile = (type: string) => {
    if (type === 'report') {
      downloadPatientLabPDF();
      showToast(language === 'mr' ? '📥 अधिकृत लॅब अहवाल पीडीएफ डाउनलोड झाला!' : language === 'hi' ? '📥 आधिकारिक लैब रिपोर्ट पीडीएफ डाउनलोड हुई!' : '📥 Official Lab Report PDF downloaded to your computer!');
    } else if (type === 'erx') {
      downloadPrescriptionPDF();
      showToast(language === 'mr' ? '📥 अधिकृत ई-प्रिस्क्रिप्शन पीडीएफ डाउनलोड झाले!' : language === 'hi' ? '📥 आधिकारिक ई-पर्चा पीडीएफ डाउनलोड हुआ!' : '📥 Official Electronic Prescription PDF downloaded to your computer!');
    } else {
      downloadDiagnosticECGPDF();
      showToast(language === 'mr' ? '📥 अधिकृत ईसीजी अहवाल पीडीएफ डाउनलोड झाला!' : language === 'hi' ? '📥 आधिकारिक ईसीजी रिपोर्ट पीडीएफ डाउनलोड हुई!' : '📥 Official 12-Lead Diagnostic ECG PDF downloaded to your computer!');
    }
    setActiveModal(null);
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 p-6 rounded-3xl text-white shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> ABDM / ABHA {language === 'mr' ? 'प्रमाणित' : language === 'hi' ? 'सत्यापित' : 'Compliant'}
            </span>
            <span className="text-xs text-slate-400">ABHA ID: 91-4829-1029-4821</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('recordsVault')}</h1>
          <p className="text-xs sm:text-sm text-teal-100/80 mt-1">{t('recordsSubtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleUploadReport}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
          >
            <UploadCloud className="w-4 h-4 mr-1.5" /> {t('uploadLabPdf')}
          </Button>
          <Button 
            onClick={handleSync}
            variant="outline" 
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-xs font-bold"
          >
            {t('syncAbha')}
          </Button>
        </div>
      </div>

      {/* Vitals & Demographics Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t('bloodGroup'), value: 'B+ Positive', sub: t('verifiedInLab'), color: 'text-rose-600' },
          { label: t('ageGender'), value: language === 'mr' ? '४५ वर्षे / पुरुष' : language === 'hi' ? '45 वर्ष / पुरुष' : '45 yrs / Male', sub: 'Rajesh Patil', color: 'text-slate-900' },
          { label: t('chronicConditions'), value: language === 'mr' ? 'टाइप २ मधुमेह' : language === 'hi' ? 'टाइप 2 डायबिटीज' : 'Type 2 Diabetes', sub: language === 'mr' ? 'उच्च रक्तदाब' : language === 'hi' ? 'उच्च रक्तचाप' : 'Hypertension', color: 'text-amber-600' },
          { label: t('drugAllergies'), value: 'Penicillin', sub: t('criticalAlert'), color: 'text-red-600' },
        ].map((stat, i) => (
          <Card key={i} className="border border-slate-200 shadow-2xs rounded-2xl bg-white">
            <CardContent className="p-4 flex flex-col justify-center items-center text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-base sm:text-lg font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Clinical Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-teal-600" /> {t('documentedEncounters')}
        </h2>
        
        <Card className="border border-slate-200 shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {/* Record 1 */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">Complete Blood Count (CBC) & HbA1c</h3>
                      <Badge variant="success">{t('normal')}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Sassoon General Hospital Pathology Lab • Dr. Anil Deshmukh</p>
                    <p className="text-xs text-slate-600 mt-1.5 font-medium">HbA1c: 6.8% | Platelets: 240k | Fasting Blood Sugar: 112 mg/dL</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setActiveModal('report')}
                    className="border-slate-300 font-bold text-xs"
                  >
                    {t('viewReport')}
                  </Button>
                </div>
              </div>

              {/* Record 2 */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">e-Prescription: Cardiology Consultation</h3>
                      <Badge variant="info">{t('activeRx')}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">KEM Hospital Pune • Dr. Sanjay Kulkarni (MD)</p>
                    <p className="text-xs text-slate-600 mt-1.5 font-medium">Metformin 500mg (BD), Amlodipine 5mg (OD), Atorvastatin 20mg (HS)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setActiveModal('erx')}
                    className="border-slate-300 font-bold text-xs"
                  >
                    {t('viewErx')}
                  </Button>
                </div>
              </div>

              {/* Record 3 */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">12-Lead ECG & Echo Diagnostic</h3>
                      <Badge variant="warning">{t('followUpReq')}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Deenanath Mangeshkar Hospital • Diagnostics Division</p>
                    <p className="text-xs text-slate-600 mt-1.5 font-medium">Sinus Rhythm, Mild LVH noted. Ejection Fraction: 58%.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setActiveModal('ecg')}
                    className="border-slate-300 font-bold text-xs"
                  >
                    {t('details')}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-black text-slate-900">
                {activeModal === 'report' ? '📄 CBC & Metabolic Lab Summary' : activeModal === 'erx' ? '💊 Digital e-Prescription #RX-8491' : '🫀 Diagnostic ECG Evaluation'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1 rounded-full hover:bg-slate-100 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-sm text-slate-700 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 font-mono text-xs">
              {activeModal === 'report' && (
                <>
                  <p className="font-bold text-slate-900">PATIENT: Rajesh Patil (45/M) | UHID: SAS-2024-9182</p>
                  <p>Hemoglobin: 13.8 g/dL (Normal: 13.0 - 17.0)</p>
                  <p>WBC Total: 7,400 /mcL (Normal: 4,000 - 11,000)</p>
                  <p>Platelet Count: 240,000 /mcL (Normal: 150k - 450k)</p>
                  <p>Fasting Plasma Glucose: 112 mg/dL</p>
                  <p>HbA1c Glycated: 6.8% (Fair Glycemic Control)</p>
                  <p className="text-emerald-700 font-bold pt-2">AI Extraction Confidence: 99.2% • Verified by Pathologist</p>
                </>
              )}
              {activeModal === 'erx' && (
                <>
                  <p className="font-bold text-slate-900">DOCTOR: Dr. Sanjay Kulkarni (Reg #PMC-4821)</p>
                  <p>1. Tab. Metformin 500mg — 1-0-1 (After Food) x 30 Days</p>
                  <p>2. Tab. Amlodipine 5mg — 1-0-0 (Morning) x 30 Days</p>
                  <p>3. Tab. Atorvastatin 20mg — 0-0-1 (Night) x 30 Days</p>
                  <p>Instructions: Low sodium diet. Exercise 30 mins/day. Review after 1 month.</p>
                </>
              )}
              {activeModal === 'ecg' && (
                <>
                  <p className="font-bold text-slate-900">DIAGNOSTIC: 12-Lead Electrocardiogram</p>
                  <p>Heart Rate: 74 bpm | PR Interval: 160 ms</p>
                  <p>QRS Duration: 88 ms | QTc: 412 ms</p>
                  <p>Interpretation: Normal Sinus Rhythm. No acute ST-T elevation.</p>
                </>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button 
                onClick={() => handleDownloadFile(activeModal)} 
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
              >
                <Download className="w-4 h-4 mr-1.5" /> Download Verified PDF
              </Button>
              <Button onClick={() => setActiveModal(null)} variant="outline" className="text-xs font-bold">
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

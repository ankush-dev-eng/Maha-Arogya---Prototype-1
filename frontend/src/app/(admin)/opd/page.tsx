"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Users, UserCheck, UserX, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function OPDPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState('General');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };
  
  const depts = [
    { key: 'General', label: language === 'mr' ? 'सर्वसाधारण (General)' : language === 'hi' ? 'सामान्य (General)' : 'General' },
    { key: 'Cardiology', label: language === 'mr' ? 'हृदयरोग (Cardiology)' : language === 'hi' ? 'हृदय रोग (Cardiology)' : 'Cardiology' },
    { key: 'Orthopedics', label: language === 'mr' ? 'अस्थिरोग (Orthopedics)' : language === 'hi' ? 'अस्थि रोग (Orthopedics)' : 'Orthopedics' },
    { key: 'Pediatrics', label: language === 'mr' ? 'बालरोग (Pediatrics)' : language === 'hi' ? 'बाल रोग (Pediatrics)' : 'Pediatrics' }
  ];
  
  const patients = [
    { id: 'A-101', name: 'Ramesh Patel', time: '10:00 AM', status: 'waiting', type: 'regular' },
    { id: 'A-102', name: 'Sunita Sharma', time: '10:15 AM', status: 'waiting', type: 'priority' },
    { id: 'A-103', name: 'Amit Kumar', time: '10:30 AM', status: 'waiting', type: 'regular' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <Users className="w-7 h-7 text-teal-600" /> {t('opdTitle')}
        </h1>
        <Button 
          onClick={() => showToast('🔔 Called Token #A-101 (Ramesh Patel) to Consultation Desk.')}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          {t('opdCallNext')} (A-101)
        </Button>
      </div>

      {/* Department Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto pb-0.5">
        {depts.map(dept => (
          <button
            key={dept.key}
            className={`px-4 py-2 font-bold text-xs sm:text-sm transition-colors border-b-2 shrink-0 cursor-pointer ${
              activeTab === dept.key ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab(dept.key)}
          >
            {dept.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-teal-50/70 border-teal-200 rounded-3xl shadow-2xs">
            <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs text-teal-800 font-extrabold uppercase tracking-wider">{t('opdCurrentlyConsulting')}</p>
                <div className="text-xl sm:text-2xl font-black text-teal-950 mt-0.5">A-100: Priya Singh</div>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => showToast('✅ Consultation marked completed for Token A-100.')}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  {t('opdMarkCompleted')}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => showToast('📝 Electronic prescription window opened for Token A-100.')}
                  className="border-slate-300 font-bold text-xs rounded-xl bg-white cursor-pointer"
                >
                  {t('opdPrescribe')}
                </Button>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-black text-slate-800 mt-6 mb-2 text-base">{t('opdWaitingQueue')}</h3>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-bold text-slate-700">{t('opdToken')}</th>
                  <th className="p-3 font-bold text-slate-700">{t('opdPatient')}</th>
                  <th className="p-3 font-bold text-slate-700">{t('opdEstTime')}</th>
                  <th className="p-3 font-bold text-slate-700">{t('opdType')}</th>
                  <th className="p-3 font-bold text-slate-700 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-black text-teal-700">{p.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="p-3 flex items-center gap-1 text-slate-600 font-medium"><Clock className="w-3.5 h-3.5 text-slate-400"/> {p.time}</td>
                    <td className="p-3">
                      {p.type === 'priority' ? (
                        <Badge variant="warning">{t('opdPriority')}</Badge>
                      ) : (
                        <Badge variant="outline">{t('opdRegular')}</Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => showToast(`⚠️ Patient ${p.name} marked absent.`)}
                          title="Mark Absent"
                          className="hover:bg-red-50 p-1.5 rounded-lg"
                        >
                          <UserX className="w-4 h-4 text-red-500"/>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <Card className="rounded-3xl border border-slate-200 shadow-2xs">
            <CardContent className="p-5">
              <h3 className="font-black text-slate-900 mb-4 text-base">{t('opdDeptStats')}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-600 font-bold flex justify-between">
                    <span>{t('opdWaiting')}</span> <span className="font-black text-slate-900">24</span>
                  </p>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full w-1/2 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-bold flex justify-between">
                    <span>{t('opdConsulted')}</span> <span className="font-black text-slate-900">45</span>
                  </p>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-teal-500 h-full w-3/4 rounded-full"></div>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-600 font-bold flex justify-between items-center">
                    <span>{t('opdAvgWait')}</span> <span className="font-black text-amber-600 text-sm">32 {language === 'mr' ? 'मि.' : language === 'hi' ? 'मिनट' : 'mins'}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Droplet, Pill, Activity } from 'lucide-react';

export default function ResourcesPage() {
  const [tab, setTab] = useState('blood');

  const bloodInventory = [
    { group: 'O+', units: 45, status: 'good' },
    { group: 'O-', units: 5, status: 'critical' },
    { group: 'A+', units: 32, status: 'good' },
    { group: 'A-', units: 12, status: 'warning' },
    { group: 'B+', units: 28, status: 'good' },
    { group: 'B-', units: 8, status: 'warning' },
    { group: 'AB+', units: 15, status: 'good' },
    { group: 'AB-', units: 2, status: 'critical' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Resource Inventory</h1>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => setTab('blood')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${tab === 'blood' ? 'bg-rose-100 text-rose-700' : 'bg-white border text-slate-600'}`}
        ><Droplet className="w-4 h-4"/> Blood Bank</button>
        <button 
          onClick={() => setTab('pharmacy')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${tab === 'pharmacy' ? 'bg-emerald-100 text-emerald-700' : 'bg-white border text-slate-600'}`}
        ><Pill className="w-4 h-4"/> Pharmacy</button>
        <button 
          onClick={() => setTab('equipment')}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${tab === 'equipment' ? 'bg-blue-100 text-blue-700' : 'bg-white border text-slate-600'}`}
        ><Activity className="w-4 h-4"/> Equipment</button>
      </div>

      {tab === 'blood' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bloodInventory.map(b => (
            <Card key={b.group} className="border-t-4" style={{borderTopColor: b.status === 'critical' ? '#ef4444' : b.status === 'warning' ? '#f59e0b' : '#10b981'}}>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center mb-3">
                  <span className="text-2xl font-black text-rose-600">{b.group}</span>
                </div>
                <p className="text-3xl font-bold">{b.units}</p>
                <p className="text-sm text-slate-500 mb-2">Units Available</p>
                <Badge variant={b.status === 'critical' ? 'danger' : b.status === 'warning' ? 'warning' : 'success'}>
                  {b.status.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tab === 'pharmacy' && (
        <Card>
          <CardContent className="p-0">
            <div className="p-6 text-center text-slate-500">
              <Pill className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Pharmacy inventory module loading...</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

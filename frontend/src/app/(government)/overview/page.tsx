"use client";
import React from 'react';
import DynamicMap, { MarkerData } from '@/components/maps/DynamicMap';
import { Card, CardContent } from '@/components/ui/Card';
import { Activity, BedDouble, Users } from 'lucide-react';

const MOCK_HOSPITALS = [
  { id: '1', name: 'KEM Hospital', lat: 19.0269, lng: 72.8426, status: 'red', beds: '45/350', opd: 'High' },
  { id: '2', name: 'Sion Hospital', lat: 19.0379, lng: 72.8631, status: 'yellow', beds: '120/400', opd: 'Moderate' },
  { id: '3', name: 'Nair Hospital', lat: 18.9744, lng: 72.8223, status: 'green', beds: '180/300', opd: 'Normal' },
  { id: '4', name: 'JJ Hospital', lat: 18.9633, lng: 72.8314, status: 'red', beds: '12/500', opd: 'Critical' },
  { id: '5', name: 'Cooper Hospital', lat: 19.1082, lng: 72.8361, status: 'green', beds: '85/200', opd: 'Normal' },
];

export default function OverviewPage() {
  const markers: MarkerData[] = MOCK_HOSPITALS.map(h => ({
    id: h.id,
    position: [h.lat, h.lng] as [number, number],
    title: h.name,
    color: h.status as 'green'|'yellow'|'red',
    details: (
      <div className="mt-1 space-y-1">
        <p className="text-sm font-medium">Beds Available: {h.beds}</p>
        <p className="text-sm">OPD Load: {h.opd}</p>
      </div>
    )
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Mumbai Health Network Status</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900 text-white">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total City Beds Available</p>
              <p className="text-3xl font-bold mt-1">442 <span className="text-sm font-normal text-slate-400">/ 1750</span></p>
            </div>
            <BedDouble className="w-8 h-8 text-teal-500 opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Active Emergencies</p>
              <p className="text-3xl font-bold mt-1 text-red-600">18</p>
            </div>
            <Activity className="w-8 h-8 text-red-500 opacity-50" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total OPD Wait Time (Avg)</p>
              <p className="text-3xl font-bold mt-1 text-amber-600">42m</p>
            </div>
            <Users className="w-8 h-8 text-amber-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      <div className="h-[500px] rounded-xl overflow-hidden border shadow-sm relative z-0">
        <DynamicMap markers={markers} center={[19.04, 72.84]} zoom={12} />
      </div>
    </div>
  );
}

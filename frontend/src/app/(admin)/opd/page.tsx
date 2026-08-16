"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';

export default function OPDPage() {
  const [activeTab, setActiveTab] = useState('General');
  
  const depts = ['General', 'Cardiology', 'Orthopedics', 'Pediatrics'];
  
  const patients = [
    { id: 'A-101', name: 'Ramesh Patel', time: '10:00 AM', status: 'waiting', type: 'regular' },
    { id: 'A-102', name: 'Sunita Sharma', time: '10:15 AM', status: 'waiting', type: 'priority' },
    { id: 'A-103', name: 'Amit Kumar', time: '10:30 AM', status: 'waiting', type: 'regular' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-teal-600" /> OPD Queue Management
        </h1>
        <Button>Call Next Patient (A-101)</Button>
      </div>

      <div className="flex border-b border-slate-200">
        {depts.map(dept => (
          <button
            key={dept}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
              activeTab === dept ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveTab(dept)}
          >
            {dept}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-teal-800 font-medium">Currently Consulting</p>
                <div className="text-2xl font-bold text-teal-900">A-100: Priya Singh</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Mark Completed</Button>
                <Button size="sm" variant="outline">Prescribe</Button>
              </div>
            </CardContent>
          </Card>

          <h3 className="font-bold text-slate-700 mt-6 mb-2">Waiting Queue</h3>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-3 font-medium">Token</th>
                  <th className="p-3 font-medium">Patient</th>
                  <th className="p-3 font-medium">Est. Time</th>
                  <th className="p-3 font-medium">Type</th>
                  <th className="p-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {patients.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-teal-700">{p.id}</td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3 flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400"/> {p.time}</td>
                    <td className="p-3">
                      {p.type === 'priority' ? <Badge variant="warning">Priority</Badge> : <Badge>Regular</Badge>}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" title="Mark Absent"><UserX className="w-4 h-4 text-red-500"/></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold mb-4">Department Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500 flex justify-between"><span>Waiting</span> <span>24</span></p>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                    <div className="bg-amber-500 h-full w-1/2"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 flex justify-between"><span>Consulted</span> <span>45</span></p>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                    <div className="bg-teal-500 h-full w-3/4"></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 flex justify-between"><span>Avg Wait Time</span> <span className="font-bold text-amber-600">32 mins</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

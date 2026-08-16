"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { User, Clock } from 'lucide-react';

export default function StaffPage() {
  const staff = [
    { name: 'Dr. Ramesh Sharma', role: 'Chief Cardiologist', status: 'On Duty', dept: 'Cardiology', hours: '08:00 - 16:00' },
    { name: 'Dr. Anita Desai', role: 'Senior Surgeon', status: 'In Surgery', dept: 'Surgery', hours: '10:00 - 18:00' },
    { name: 'Nurse Priya M.', role: 'Head Nurse', status: 'On Duty', dept: 'ICU', hours: '06:00 - 14:00' },
    { name: 'Dr. Amit Patel', role: 'ER Physician', status: 'Off Duty', dept: 'Emergency', hours: '20:00 - 08:00' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Staff Roster</h1>
      
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">Total Staff</p><p className="text-2xl font-bold">156</p></CardContent></Card>
        <Card className="bg-teal-50 border-teal-200"><CardContent className="p-4"><p className="text-sm text-teal-700">On Duty Now</p><p className="text-2xl font-bold text-teal-900">84</p></CardContent></Card>
        <Card className="bg-amber-50 border-amber-200"><CardContent className="p-4"><p className="text-sm text-amber-700">In Surgery</p><p className="text-2xl font-bold text-amber-900">12</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-slate-500">On Leave</p><p className="text-2xl font-bold">8</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current Shift Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-t">
              <tr>
                <th className="p-4 font-medium">Name & Role</th>
                <th className="p-4 font-medium">Department</th>
                <th className="p-4 font-medium">Shift Hours</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {staff.map((s, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold">{s.name}</p>
                        <p className="text-xs text-slate-500">{s.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">{s.dept}</td>
                  <td className="p-4 flex items-center gap-2"><Clock className="w-4 h-4 text-slate-400"/> {s.hours}</td>
                  <td className="p-4">
                    <Badge variant={
                      s.status === 'On Duty' ? 'success' : 
                      s.status === 'In Surgery' ? 'warning' : 'default'
                    }>{s.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const forecastData = [
  { date: 'Mon', actual: 450, predicted: 460 },
  { date: 'Tue', actual: 520, predicted: 500 },
  { date: 'Wed', actual: 480, predicted: 490 },
  { date: 'Thu', actual: 510, predicted: 530 },
  { date: 'Fri', actual: 600, predicted: 580 },
  { date: 'Sat', predicted: 650 },
  { date: 'Sun', predicted: 680 },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Predictive Analytics</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>City-Wide Bed Demand Forecast (Next 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="actual" stroke="#0D9488" fill="#0D9488" fillOpacity={0.3} name="Actual Load" />
                <Area type="monotone" dataKey="predicted" stroke="#F59E0B" strokeDasharray="5 5" fill="#F59E0B" fillOpacity={0.1} name="Predicted Load" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

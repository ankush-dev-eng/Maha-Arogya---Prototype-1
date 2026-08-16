"use client";
import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AlertsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Network Stress Alerts</h1>
      
      <div className="space-y-4">
        <Card className="border-red-500 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
              <div className="flex-1">
                <h2 className="text-lg font-bold text-red-900 mb-1">Critical Resource Shortage: JJ Hospital</h2>
                <p className="text-sm text-slate-600 mb-4">ICU bed capacity at 100%. Blood bank O- reserves below minimum threshold.</p>
                
                <div className="bg-slate-50 border rounded-lg p-4">
                  <h3 className="font-semibold text-sm mb-3 text-slate-700">AI Recommendation: Load Balancing</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex-1 p-3 bg-white border rounded text-center">
                      <p className="font-bold">JJ Hospital</p>
                      <p className="text-red-500">100% Load</p>
                    </div>
                    <ArrowRight className="text-slate-400" />
                    <div className="flex-1 p-3 bg-white border rounded text-center">
                      <p className="font-bold">Nair Hospital</p>
                      <p className="text-green-500">60% Load (3km away)</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button variant="primary">Approve Auto-Divert for Next 4 Hours</Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

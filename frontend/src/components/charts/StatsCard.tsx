import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: 'up' | 'down' | string;
  change?: string;
  trendUp?: boolean;
  colorClass?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, change, trendUp, colorClass = "text-teal-600" }: StatsCardProps) {
  const isUp = trendUp ?? (trend === 'up');
  const displayChange = change || (typeof trend === 'string' && trend !== 'up' && trend !== 'down' ? trend : undefined);

  return (
    <Card className="rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between space-y-0 pb-1.5">
          <h3 className="tracking-tight text-xs font-bold text-slate-500 uppercase">{title}</h3>
          <Icon className={`h-4 w-4 ${colorClass}`} />
        </div>
        <div className="flex flex-col">
          <div className="text-xl sm:text-2xl font-black text-slate-900">{value}</div>
          {displayChange && (
            <p className={`text-[11px] font-semibold mt-1 ${isUp ? 'text-teal-600' : 'text-emerald-600'}`}>
              {displayChange}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

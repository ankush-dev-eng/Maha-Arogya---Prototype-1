import React from 'react';
import { Header } from '@/components/shared/Header';
import Link from 'next/link';

export default function GovernmentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="bg-slate-900 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8 overflow-x-auto">
            {[
              { name: 'State Overview', href: '/overview' },
              { name: 'Predictive Analytics', href: '/analytics' },
              { name: 'Stress Alerts', href: '/alerts' },
            ].map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="py-3 text-sm font-medium text-slate-300 hover:text-white border-b-2 border-transparent hover:border-amber-500 whitespace-nowrap transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, Globe, User, LogOut, Sparkles, Activity, ShieldAlert, MapPin, Clock, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { ROLE_KEYS, ROLE_DEFINITIONS } from '@/lib/constants';
import { useLanguage, Language } from '@/lib/LanguageContext';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [currentRole, setCurrentRole] = useState<string>(ROLE_KEYS.CITIZEN);

  useEffect(() => {
    const savedRole = localStorage.getItem('maha_role');
    if (savedRole) {
      setCurrentRole(savedRole);
    }
  }, [pathname]);

  const roleMeta = ROLE_DEFINITIONS[currentRole as keyof typeof ROLE_DEFINITIONS] || ROLE_DEFINITIONS[ROLE_KEYS.CITIZEN];
  const isCitizen = currentRole === ROLE_KEYS.CITIZEN || pathname.startsWith('/triage') || pathname.startsWith('/hospitals') || pathname.startsWith('/queue') || pathname.startsWith('/emergency') || pathname.startsWith('/records');

  const handleLogout = () => {
    localStorage.removeItem('maha_role');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-900 text-white shadow-md">
      <div className="flex h-16 items-center px-4 md:px-6 justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-teal-500 flex items-center justify-center font-black text-lg text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              M
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                {t('brandTitle')}
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold text-teal-300 ml-2 px-1.5 py-0.5 rounded bg-teal-500/20 border border-teal-500/30">
                {t('brandTag')}
              </span>
            </div>
          </Link>

          {/* Citizen Navigation Links */}
          {isCitizen && (
            <nav className="hidden lg:flex items-center gap-1 text-sm font-semibold text-slate-300">
              <Link 
                href="/triage" 
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/triage' ? 'bg-slate-800 text-teal-400' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <Activity className="w-4 h-4" /> {t('navTriage')}
              </Link>
              <Link 
                href="/hospitals" 
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/hospitals' ? 'bg-slate-800 text-teal-400' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <MapPin className="w-4 h-4" /> {t('navHospitals')}
              </Link>
              <Link 
                href="/queue" 
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/queue' ? 'bg-slate-800 text-teal-400' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <Clock className="w-4 h-4" /> {t('navQueue')}
              </Link>
              <Link 
                href="/emergency" 
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/emergency' ? 'bg-red-500/20 text-red-400 font-bold' : 'hover:text-red-400 hover:bg-red-500/10'}`}
              >
                <ShieldAlert className="w-4 h-4" /> {t('navEmergency')}
              </Link>
              <Link 
                href="/records" 
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${pathname === '/records' ? 'bg-slate-800 text-teal-400' : 'hover:text-white hover:bg-slate-800/60'}`}
              >
                <FileText className="w-4 h-4" /> {t('navRecords')}
              </Link>
            </nav>
          )}
        </div>
        
        {/* Right Action Icons */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Working Language Selector */}
          <div className="flex items-center text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1.5 rounded-xl border border-slate-700 hover:border-teal-500/50 transition-colors">
            <Globe className="mr-1.5 h-3.5 w-3.5 text-teal-400" />
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer text-xs"
            >
              <option value="en" className="text-slate-900 font-medium">EN (English)</option>
              <option value="mr" className="text-slate-900 font-medium">मराठी (Marathi)</option>
              <option value="hi" className="text-slate-900 font-medium">हिंदी (Hindi)</option>
            </select>
          </div>

          {/* Active Persona Badge & Switch Button */}
          <div className="flex items-center gap-2 pl-2 sm:pl-4 border-l border-slate-800">
            <button
              onClick={() => router.push('/')}
              title="Click to switch persona"
              className="flex items-center gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-500/50 hover:bg-slate-750 transition-all text-left group"
            >
              <div className="h-7 w-7 rounded-lg bg-teal-600/30 text-teal-300 flex items-center justify-center font-bold text-xs">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('switchPersona')}</p>
                <p className="text-xs font-black text-white group-hover:text-teal-300 transition-colors">{roleMeta.shortName}</p>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-teal-400 ml-1 hidden sm:inline-block" />
            </button>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="text-slate-400 hover:text-red-400 hover:bg-slate-800 h-9 w-9 rounded-xl" 
              title="Logout & Switch Role"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

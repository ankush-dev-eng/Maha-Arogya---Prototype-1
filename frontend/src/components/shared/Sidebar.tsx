"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '../ui/Button';
import { ROLE_KEYS, ROLE_DEFINITIONS } from '@/lib/constants';
import { useLanguage } from '@/lib/LanguageContext';
import { 
  LayoutDashboard, 
  Bed, 
  AlertCircle, 
  Users, 
  Pill,
  Droplet,
  Stethoscope,
  UserSquare, 
  Video,
  LogOut,
  Sparkles,
  Building,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLanguage();
  const [currentRole, setCurrentRole] = useState<string>(ROLE_KEYS.HOSPITAL_ADMIN);

  useEffect(() => {
    const savedRole = localStorage.getItem('maha_role');
    if (savedRole) {
      setCurrentRole(savedRole);
    }
  }, []);

  const roleMeta = ROLE_DEFINITIONS[currentRole as keyof typeof ROLE_DEFINITIONS] || ROLE_DEFINITIONS[ROLE_KEYS.HOSPITAL_ADMIN];

  const ALL_NAV_ITEMS = [
    { id: 'dashboard', nameKey: 'navDashboard', href: '/dashboard', icon: LayoutDashboard, roles: [ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.PHARMACY, ROLE_KEYS.BLOOD_BANK] },
    { id: 'doctor', nameKey: 'navDoctor', href: '/doctor', icon: Stethoscope, roles: [ROLE_KEYS.DOCTOR, ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.RECEPTION] },
    { id: 'beds', nameKey: 'navBeds', href: '/beds', icon: Bed, roles: [ROLE_KEYS.NURSE, ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.RECEPTION, ROLE_KEYS.EMERGENCY] },
    { id: 'pharmacy', nameKey: 'navPharmacy', href: '/pharmacy', icon: Pill, roles: [ROLE_KEYS.PHARMACY, ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.DOCTOR] },
    { id: 'blood-bank', nameKey: 'navBloodBank', href: '/blood-bank', icon: Droplet, roles: [ROLE_KEYS.BLOOD_BANK, ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.EMERGENCY, ROLE_KEYS.DOCTOR] },
    { id: 'admin-emergency', nameKey: 'navAdminEmergency', href: '/admin-emergency', icon: AlertCircle, roles: [ROLE_KEYS.EMERGENCY, ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.NURSE] },
    { id: 'opd', nameKey: 'navOpd', href: '/opd', icon: Users, roles: [ROLE_KEYS.RECEPTION, ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.DOCTOR] },
    { id: 'staff', nameKey: 'navStaff', href: '/staff', icon: UserSquare, roles: [ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.NURSE] },
    { id: 'cctv', nameKey: 'navCctv', href: '/cctv', icon: Video, roles: [ROLE_KEYS.HOSPITAL_ADMIN, ROLE_KEYS.NURSE, ROLE_KEYS.EMERGENCY] },
    { id: 'overview', nameKey: 'navRegional', href: '/overview', icon: Building, roles: [ROLE_KEYS.GOVERNMENT] },
    { id: 'analytics', nameKey: 'navForecast', href: '/analytics', icon: BarChart3, roles: [ROLE_KEYS.GOVERNMENT] },
    { id: 'alerts', nameKey: 'navBalancing', href: '/alerts', icon: AlertTriangle, roles: [ROLE_KEYS.GOVERNMENT] },
  ];

  const visibleNavItems = ALL_NAV_ITEMS.filter(item => 
    item.roles.includes(currentRole)
  );

  return (
    <div className="hidden border-r border-slate-200 bg-slate-50 md:flex flex-col w-64 min-h-[calc(100vh-4rem)]">
      {/* Current Role Banner */}
      <div className="p-3.5 mx-3 mt-3 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {t('status')}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
          {roleMeta.badge}
        </div>
        <button 
          onClick={() => router.push('/')}
          className="text-xs text-teal-600 hover:text-teal-700 font-semibold mt-1.5 flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3" /> {t('switchPersona')}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-3">
        <div className="px-4 mb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          {t('actions')}
        </div>
        <nav className="grid items-start px-2 text-sm font-medium gap-1">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition-all text-xs font-bold",
                  isActive 
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-600/20" 
                    : "text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-slate-500")} />
                <span className="truncate">{t(item.nameKey)}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Return to role portal footer */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <button 
          onClick={() => router.push('/')}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" /> {t('returnPortal')}
        </button>
      </div>
    </div>
  );
}

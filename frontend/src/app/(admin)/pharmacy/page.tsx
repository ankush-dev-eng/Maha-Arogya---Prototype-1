"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Pill, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  ShoppingCart,
  Clock,
  TrendingDown,
  Layers
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface InventoryItem {
  id: string;
  name: string;
  category: 'Medicine' | 'Consumable' | 'Equipment';
  currentStock: number;
  unit: string;
  consumptionRate: number;
  expiryDate: string;
  status: 'adequate' | 'low' | 'critical' | 'expiring';
  reorderBuffer: number;
}

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: '1', name: 'Paracetamol 500mg', category: 'Medicine', currentStock: 1200, unit: 'tablets', consumptionRate: 85, expiryDate: '2027-04-15', status: 'adequate', reorderBuffer: 500 },
  { id: '2', name: 'Amoxicillin 250mg', category: 'Medicine', currentStock: 140, unit: 'capsules', consumptionRate: 40, expiryDate: '2026-09-05', status: 'critical', reorderBuffer: 300 },
  { id: '3', name: 'Salbutamol Inhaler 100mcg', category: 'Medicine', currentStock: 25, unit: 'inhalers', consumptionRate: 12, expiryDate: '2026-08-30', status: 'expiring', reorderBuffer: 80 },
  { id: '4', name: 'Metformin 500mg', category: 'Medicine', currentStock: 850, unit: 'tablets', consumptionRate: 60, expiryDate: '2027-11-20', status: 'adequate', reorderBuffer: 400 },
  { id: '5', name: 'IV Normal Saline 500ml', category: 'Consumable', currentStock: 45, unit: 'bottles', consumptionRate: 35, expiryDate: '2027-01-10', status: 'low', reorderBuffer: 150 },
  { id: '6', name: 'Atorvastatin 20mg', category: 'Medicine', currentStock: 620, unit: 'tablets', consumptionRate: 30, expiryDate: '2027-08-14', status: 'adequate', reorderBuffer: 250 },
  { id: '7', name: 'Disposable Syringes 5ml', category: 'Consumable', currentStock: 1800, unit: 'units', consumptionRate: 150, expiryDate: '2028-03-01', status: 'adequate', reorderBuffer: 800 },
  { id: '8', name: 'Oxygen Mask (Adult)', category: 'Equipment', currentStock: 35, unit: 'pieces', consumptionRate: 18, expiryDate: '2029-01-01', status: 'low', reorderBuffer: 100 },
];

export default function PharmacyPage() {
  const { t, language } = useLanguage();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    const saved = localStorage.getItem('maha_pharmacy');
    if (saved) {
      try {
        setInventory(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setInventory(DEFAULT_INVENTORY);
  }, []);

  const saveInventory = (updated: InventoryItem[]) => {
    setInventory(updated);
    localStorage.setItem('maha_pharmacy', JSON.stringify(updated));
  };

  const handleReplenishSingle = (id: string, name: string) => {
    const updated = inventory.map(item => {
      if (item.id === id) {
        return {
          ...item,
          currentStock: item.currentStock + item.reorderBuffer,
          status: 'adequate' as const,
          expiryDate: '2027-12-31'
        };
      }
      return item;
    });
    saveInventory(updated);
    showToast(`📦 Restocked ${name}: +${inventory.find(i => i.id === id)?.reorderBuffer} units added.`);
  };

  const handleAutoReplenishAll = () => {
    let count = 0;
    const updated = inventory.map(item => {
      if (item.status === 'critical' || item.status === 'low' || item.status === 'expiring') {
        count++;
        return {
          ...item,
          currentStock: item.currentStock + (item.reorderBuffer * 2),
          status: 'adequate' as const,
          expiryDate: '2028-06-30'
        };
      }
      return item;
    });
    saveInventory(updated);
    showToast(`🚀 Auto-Replenished ${count} critical items! Automated Purchase Order PO-9912 dispatched.`);
  };

  const criticalCount = inventory.filter(i => i.status === 'critical' || i.status === 'expiring').length;
  const lowCount = inventory.filter(i => i.status === 'low').length;

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || item.category.toUpperCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 sm:p-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-500/30">
            {t('pharmRoleBadge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            {t('pharmTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            {t('pharmSubtitle')}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <Button 
            onClick={() => showToast('🔄 Inventory synced with State Central Drug Repository.')}
            className="bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-teal-400" /> {t('pharmSyncStock')}
          </Button>
          <Button 
            onClick={handleAutoReplenishAll}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl shadow-lg shadow-emerald-500/20"
          >
            <Sparkles className="w-4 h-4 mr-1.5" /> {t('pharmAutoReplenish')}
          </Button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-l-4 border-l-teal-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('pharmTotalItems')}</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{inventory.length}</p>
              <span className="text-[11px] text-slate-500">{t('tblCategory')}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Pill className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-red-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('pharmCriticalExpiring')}</p>
              <p className="text-2xl font-black text-red-600 mt-0.5">{criticalCount}</p>
              <span className="text-[11px] text-red-600 font-semibold">{criticalCount > 0 ? 'PO Required' : 'Safe'}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-amber-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('pharmLowStock')}</p>
              <p className="text-2xl font-black text-amber-600 mt-0.5">{lowCount}</p>
              <span className="text-[11px] text-slate-500">&lt; Buffer</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <TrendingDown className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-l-4 border-l-emerald-500 bg-white shadow-2xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('pharmDispensedToday')}</p>
              <p className="text-2xl font-black text-emerald-600 mt-0.5">428</p>
              <span className="text-[11px] text-slate-500">eRx Served</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Stock Alert Banner */}
      {criticalCount > 0 && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-300 flex items-center justify-between gap-3 text-red-950 animate-in fade-in">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-black text-xs sm:text-sm">{t('pharmActionRequired')}</p>
              <p className="text-xs text-red-800">{t('pharmActionSub')}</p>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={handleAutoReplenishAll}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs shrink-0 shadow-xs"
          >
            Auto-PO Restock
          </Button>
        </div>
      )}

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('pharmSearchPlaceholder')}
            className="pl-10 h-10 rounded-xl bg-white border-slate-200 text-slate-950 font-bold"
          />
        </div>

        <div className="flex gap-1 bg-white border border-slate-200 p-1 rounded-xl shrink-0">
          {[
            { key: 'ALL', label: t('catAll') },
            { key: 'MEDICINE', label: t('catMedicine') },
            { key: 'CONSUMABLE', label: t('catConsumable') },
            { key: 'EQUIPMENT', label: t('catEquipment') },
          ].map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                categoryFilter === cat.key ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase tracking-wider">
                  <th className="py-3.5 px-4">{t('tblItemName')}</th>
                  <th className="py-3.5 px-4">{t('tblCategory')}</th>
                  <th className="py-3.5 px-4">{t('tblCurrentStock')}</th>
                  <th className="py-3.5 px-4">{t('tblConsumptionRate')}</th>
                  <th className="py-3.5 px-4">{t('tblExpiryDate')}</th>
                  <th className="py-3.5 px-4">{t('tblStockStatus')}</th>
                  <th className="py-3.5 px-4 text-right">{t('tblAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map(item => {
                  const daysToDepletion = Math.round(item.currentStock / item.consumptionRate);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors font-medium">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900 text-sm">{item.name}</p>
                            <p className="text-[11px] text-slate-400">Reorder Buffer: {item.reorderBuffer} {item.unit}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="outline" className="text-[10px]">
                          {item.category === 'Medicine' ? t('catMedicine') : item.category === 'Consumable' ? t('catConsumable') : t('catEquipment')}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-black text-slate-900 text-sm">{item.currentStock.toLocaleString()} <span className="text-slate-500 font-normal text-xs">{item.unit}</span></p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Depletion in ~{daysToDepletion} days
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-bold">
                        ~{item.consumptionRate} {item.unit}/day
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-slate-700 font-bold">{item.expiryDate}</p>
                        {item.status === 'expiring' && (
                          <span className="text-[10px] font-bold text-red-600">Expires in 20 days!</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={
                          item.status === 'adequate' ? 'success' :
                          item.status === 'low' ? 'warning' : 'danger'
                        }>
                          {item.status === 'adequate' ? t('stAdequate') : item.status === 'low' ? t('stLowStock') : t('stCriticalLow')}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button 
                          size="sm"
                          onClick={() => handleReplenishSingle(item.id, item.name)}
                          className={`font-bold text-xs rounded-xl ${
                            item.status === 'adequate' 
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                              : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5 mr-1" /> {t('btnReplenish')}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

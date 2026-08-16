"use client";

// Persistent Data Store with localStorage synchronization and cross-tab events

export interface BedItem {
  id: string;
  name: string;
  ward: string;
  type: 'general' | 'icu' | 'oxygen_supported';
  state: 'available' | 'occupied' | 'reserved' | 'cleaning' | 'maintenance';
  patientName?: string;
  discrepancy?: boolean;
}

export interface EmergencyAlertItem {
  id: number;
  caseId: string;
  type: string;
  time: string;
  loc: string;
  status: 'incoming' | 'acknowledged' | 'bed_reserved' | 'en_route' | 'arrived';
  severity: 'critical' | 'high' | 'moderate';
  patientName: string;
  ambulanceId?: string;
  reservedBedId?: string;
}

const DEFAULT_BEDS: BedItem[] = [
  { id: '1', name: 'Bed Gen-01', ward: 'General Ward A', type: 'general', state: 'available' },
  { id: '2', name: 'Bed Gen-02', ward: 'General Ward A', type: 'general', state: 'occupied', patientName: 'Ramesh Patil', discrepancy: true },
  { id: '3', name: 'Bed Gen-03', ward: 'General Ward A', type: 'general', state: 'occupied', patientName: 'Vijay Kulkarni' },
  { id: '4', name: 'Bed Gen-04', ward: 'General Ward A', type: 'general', state: 'reserved' },
  { id: '5', name: 'Bed Gen-05', ward: 'General Ward A', type: 'general', state: 'cleaning' },
  { id: '6', name: 'Bed Gen-06', ward: 'General Ward A', type: 'general', state: 'available' },
  { id: '7', name: 'Bed Gen-07', ward: 'General Ward A', type: 'general', state: 'occupied', patientName: 'Priya Joshi' },
  { id: '8', name: 'Bed Gen-08', ward: 'General Ward A', type: 'general', state: 'maintenance' },
  { id: '9', name: 'Bed ICU-01', ward: 'ICU', type: 'icu', state: 'occupied', patientName: 'Amit Sharma' },
  { id: '10', name: 'Bed ICU-02', ward: 'ICU', type: 'icu', state: 'occupied', patientName: 'Mohan Gavhane' },
  { id: '11', name: 'Bed ICU-03', ward: 'ICU', type: 'icu', state: 'reserved' },
  { id: '12', name: 'Bed ICU-04', ward: 'ICU', type: 'icu', state: 'available' },
  { id: '13', name: 'Bed ER-01', ward: 'Emergency', type: 'oxygen_supported', state: 'occupied', patientName: 'Sunita Deshmukh' },
  { id: '14', name: 'Bed ER-02', ward: 'Emergency', type: 'oxygen_supported', state: 'available' },
  { id: '15', name: 'Bed ER-03', ward: 'Emergency', type: 'oxygen_supported', state: 'cleaning' },
  { id: '16', name: 'Bed ER-04', ward: 'Emergency', type: 'oxygen_supported', state: 'available' },
];

const DEFAULT_EMERGENCIES: EmergencyAlertItem[] = [
  { 
    id: 1, 
    caseId: 'EM-9182',
    type: 'Trauma / Road Accident', 
    time: '2 mins ago', 
    loc: 'Dharavi, 2.1km away', 
    status: 'incoming', 
    severity: 'critical',
    patientName: 'Sachin Waghmare (38/M)',
    ambulanceId: 'MH-12-EM-9912'
  },
  { 
    id: 2, 
    caseId: 'EM-9180',
    type: 'Acute Cardiac Arrest', 
    time: '15 mins ago', 
    loc: 'Dadar West, 3.4km away', 
    status: 'en_route', 
    severity: 'critical',
    patientName: 'Dattatray Shinde (62/M)',
    ambulanceId: 'MH-01-AB-1234',
    reservedBedId: 'Bed ICU-03'
  },
];

// Helper to get beds
export function getPersistentBeds(): BedItem[] {
  if (typeof window === 'undefined') return DEFAULT_BEDS;
  const data = localStorage.getItem('maha_beds');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_BEDS;
    }
  }
  localStorage.setItem('maha_beds', JSON.stringify(DEFAULT_BEDS));
  return DEFAULT_BEDS;
}

// Helper to save beds
export function savePersistentBeds(beds: BedItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('maha_beds', JSON.stringify(beds));
    window.dispatchEvent(new Event('bedschange'));
  }
}

// Helper to update a single bed
export function updatePersistentBed(id: string, newState: BedItem['state'], patientName?: string) {
  const beds = getPersistentBeds();
  const updated = beds.map(b => b.id === id ? { 
    ...b, 
    state: newState, 
    patientName: newState === 'occupied' ? (patientName || b.patientName || 'Assigned Patient') : undefined,
    discrepancy: false 
  } : b);
  savePersistentBeds(updated);
  return updated;
}

// Helper to get emergency alerts
export function getPersistentEmergencies(): EmergencyAlertItem[] {
  if (typeof window === 'undefined') return DEFAULT_EMERGENCIES;
  const data = localStorage.getItem('maha_emergencies');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return DEFAULT_EMERGENCIES;
    }
  }
  localStorage.setItem('maha_emergencies', JSON.stringify(DEFAULT_EMERGENCIES));
  return DEFAULT_EMERGENCIES;
}

// Helper to save emergency alerts
export function savePersistentEmergencies(alerts: EmergencyAlertItem[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('maha_emergencies', JSON.stringify(alerts));
    window.dispatchEvent(new Event('emergencieschange'));
  }
}

// Helper to update single emergency status
export function updatePersistentEmergencyStatus(id: number, status: EmergencyAlertItem['status'], reservedBedId?: string) {
  const alerts = getPersistentEmergencies();
  const updated = alerts.map(a => a.id === id ? { 
    ...a, 
    status,
    reservedBedId: reservedBedId || a.reservedBedId
  } : a);
  savePersistentEmergencies(updated);
  return updated;
}

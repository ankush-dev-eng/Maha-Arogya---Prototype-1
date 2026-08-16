export const COLORS = {
  primary: '#0D9488',
  secondary: '#0F766E',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  info: '#3B82F6',
};

export const ROLE_KEYS = {
  CITIZEN: 'citizen',
  HOSPITAL_ADMIN: 'hospital_admin',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  RECEPTION: 'reception',
  EMERGENCY: 'emergency',
  BLOOD_BANK: 'blood_bank',
  PHARMACY: 'pharmacy',
  GOVERNMENT: 'government',
};

export const ROLE_DEFINITIONS = {
  [ROLE_KEYS.CITIZEN]: {
    id: ROLE_KEYS.CITIZEN,
    name: 'Citizen / Patient',
    shortName: 'Citizen',
    badge: '👤 Citizen',
    landing: '/triage',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    description: 'AI Voice/Text Triage, OPD Token, Emergency Dispatch, Records, Hospitals'
  },
  [ROLE_KEYS.HOSPITAL_ADMIN]: {
    id: ROLE_KEYS.HOSPITAL_ADMIN,
    name: 'Hospital Administrator',
    shortName: 'Hospital Admin',
    badge: '🏥 Hospital Admin',
    landing: '/dashboard',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    description: 'Full Command Center, Operations, Beds, Queues, Staff & AI Insights'
  },
  [ROLE_KEYS.DOCTOR]: {
    id: ROLE_KEYS.DOCTOR,
    name: 'Doctor / Medical Officer',
    shortName: 'Doctor',
    badge: '🩺 Doctor / MO',
    landing: '/doctor',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    description: 'Incoming OPD Queue, Triage Clinical Context, Patient Consultations & Rx'
  },
  [ROLE_KEYS.NURSE]: {
    id: ROLE_KEYS.NURSE,
    name: 'Nurse / Ward Staff',
    shortName: 'Nurse',
    badge: '👩‍⚕️ Ward Staff',
    landing: '/beds',
    color: 'bg-pink-100 text-pink-800 border-pink-200',
    description: 'Smart Bed Status, Ward Occupancy, CCTV Discrepancy & Cleaning'
  },
  [ROLE_KEYS.RECEPTION]: {
    id: ROLE_KEYS.RECEPTION,
    name: 'Reception / OPD Staff',
    shortName: 'Reception',
    badge: '🎫 Reception / OPD',
    landing: '/opd',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    description: 'Digital Token Generation, Department Queues & Patient Arrival Check-in'
  },
  [ROLE_KEYS.EMERGENCY]: {
    id: ROLE_KEYS.EMERGENCY,
    name: 'Emergency / Control-Room Staff',
    shortName: 'Emergency Desk',
    badge: '🚨 Emergency Staff',
    landing: '/admin-emergency',
    color: 'bg-red-100 text-red-800 border-red-200',
    description: 'Emergency Alerts, Hospital Acknowledgment, Ambulance ETA & 30m Bed Hold'
  },
  [ROLE_KEYS.BLOOD_BANK]: {
    id: ROLE_KEYS.BLOOD_BANK,
    name: 'Blood Bank Staff',
    shortName: 'Blood Bank',
    badge: '🩸 Blood Bank',
    landing: '/blood-bank',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    description: 'Blood Inventory by Group, Shortage Warnings, Depletion & Transfers'
  },
  [ROLE_KEYS.PHARMACY]: {
    id: ROLE_KEYS.PHARMACY,
    name: 'Pharmacy / Inventory Staff',
    shortName: 'Pharmacy',
    badge: '💊 Pharmacy Staff',
    landing: '/pharmacy',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    description: 'Medicine Catalog, Expiry Alerts, Consumption Tracking & Replenishment'
  },
  [ROLE_KEYS.GOVERNMENT]: {
    id: ROLE_KEYS.GOVERNMENT,
    name: 'Government / State Admin',
    shortName: 'Govt Admin',
    badge: '🏛️ Govt Admin',
    landing: '/overview',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    description: 'Citywide Heatmap, Multi-Hospital Stress & Automated Load Balancing'
  },
};

export const RISK_LEVEL_COLORS = {
  low: 'bg-green-100 text-green-800 border-green-200',
  moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  emergency: 'bg-red-100 text-red-800 border-red-200',
};

export const BED_STATE_COLORS = {
  available: 'bg-green-500',
  occupied: 'bg-red-500',
  reserved: 'bg-yellow-500',
  cleaning: 'bg-blue-500',
  maintenance: 'bg-gray-500',
  blocked: 'bg-slate-800',
};

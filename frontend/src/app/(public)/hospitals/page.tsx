"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DynamicMap, { MarkerData } from '@/components/maps/DynamicMap';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  MapPin, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  Building2, 
  Bed, 
  Phone,
  Compass,
  ExternalLink,
  LocateFixed,
  Map
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export interface HospitalItem {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  status: 'green' | 'yellow' | 'red';
  wait: string;
  bedsAvailable: number;
  totalBeds: number;
  emergency: boolean;
  phone: string;
  specialty: string;
  distanceKm?: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round((R * c) * 10) / 10;
}

export const ALL_MAHARASHTRA_HOSPITALS: HospitalItem[] = [
  // 1. NAGPUR & VIDARBHA GRID
  { 
    id: 'ng1', 
    name: 'Government Medical College & Hospital (GMC)', 
    address: 'Medical Square, Hanuman Nagar, Ajni, Nagpur, Maharashtra 440003', 
    city: 'Nagpur',
    lat: 21.1278, 
    lng: 79.0984, 
    status: 'yellow', 
    wait: '18 mins', 
    bedsAvailable: 52, 
    totalBeds: 240, 
    emergency: true, 
    phone: '0712-2744671', 
    specialty: 'General Medicine, Trauma ER, Cardiology' 
  },
  { 
    id: 'ng2', 
    name: 'Indira Gandhi Govt Medical College (Mayo Hospital)', 
    address: 'Central Avenue Road, Near Railway Station, Mominpura, Nagpur, Maharashtra 440018', 
    city: 'Nagpur',
    lat: 21.1554, 
    lng: 79.0945, 
    status: 'green', 
    wait: '14 mins', 
    bedsAvailable: 68, 
    totalBeds: 180, 
    emergency: true, 
    phone: '0712-2728521', 
    specialty: 'Emergency, Pediatrics, General Surgery' 
  },
  { 
    id: 'ng3', 
    name: 'AIIMS Nagpur (All India Institute of Medical Sciences)', 
    address: 'Plot No. 2, Sector 20, MIHAN, Nagpur, Maharashtra 441108', 
    city: 'Nagpur',
    lat: 21.0543, 
    lng: 79.0275, 
    status: 'green', 
    wait: '10 mins', 
    bedsAvailable: 110, 
    totalBeds: 300, 
    emergency: true, 
    phone: '0712-2970700', 
    specialty: 'Multi-Specialty, Oncology, Cath Lab' 
  },
  { 
    id: 'ng4', 
    name: 'CARE Hospitals Nagpur', 
    address: '3, Farmland, Panchsheel Square, Wardha Road, Ramdaspeth, Nagpur, Maharashtra 440012', 
    city: 'Nagpur',
    lat: 21.1396, 
    lng: 79.0792, 
    status: 'green', 
    wait: '8 mins', 
    bedsAvailable: 58, 
    totalBeds: 130, 
    emergency: true, 
    phone: '0712-6165656', 
    specialty: 'Emergency Medicine, Cardiac Sciences, Critical Care' 
  },
  { 
    id: 'ng5', 
    name: 'Orange City Hospital & Research Institute', 
    address: '19, Khamla Road, Sawarkar Nagar, Khamla, Nagpur, Maharashtra 440015', 
    city: 'Nagpur',
    lat: 21.1189, 
    lng: 79.0683, 
    status: 'green', 
    wait: '12 mins', 
    bedsAvailable: 45, 
    totalBeds: 120, 
    emergency: true, 
    phone: '0712-6634800', 
    specialty: 'Critical Care, Orthopedics, Neurology' 
  },
  { 
    id: 'ng6', 
    name: 'Wockhardt Super Speciality Hospital', 
    address: '1643, North Ambazari Road, Shankar Nagar, Nagpur, Maharashtra 440010', 
    city: 'Nagpur',
    lat: 21.1352, 
    lng: 79.0645, 
    status: 'yellow', 
    wait: '22 mins', 
    bedsAvailable: 35, 
    totalBeds: 140, 
    emergency: true, 
    phone: '0712-6624100', 
    specialty: 'Cardiology, Nephrology, Joint Replacement' 
  },
  { 
    id: 'ng7', 
    name: 'Kingsway Hospitals', 
    address: '44, Kingsway Rd, Near Kasturchand Park, Mohan Nagar, Nagpur, Maharashtra 440001', 
    city: 'Nagpur',
    lat: 21.1528, 
    lng: 79.0882, 
    status: 'green', 
    wait: '15 mins', 
    bedsAvailable: 80, 
    totalBeds: 200, 
    emergency: true, 
    phone: '0712-6789100', 
    specialty: 'Trauma Care, Pulmonology, ICU' 
  },
  { 
    id: 'ng8', 
    name: 'Alexis Multispeciality Hospital (Max Healthcare)', 
    address: 'Survey No. 232, Mankapur, Koradi Road, Shambhu Nagar, Nagpur, Maharashtra 440030', 
    city: 'Nagpur',
    lat: 21.1963, 
    lng: 79.0768, 
    status: 'green', 
    wait: '10 mins', 
    bedsAvailable: 90, 
    totalBeds: 200, 
    emergency: true, 
    phone: '0712-7120000', 
    specialty: 'Tertiary Care, Neurosciences, Oncology' 
  },

  // 2. PUNE & PIMPRI-CHINCHWAD GRID
  { id: 'pn1', name: 'Sassoon General Hospital & Trauma ER', address: 'Near Pune Railway Station, Sassoon Road, Pune, Maharashtra 411001', city: 'Pune', lat: 18.5262, lng: 73.8732, status: 'yellow', wait: '15 mins', bedsAvailable: 48, totalBeds: 200, emergency: true, phone: '020-26128000', specialty: 'Cardiology, Trauma, Gen Medicine' },
  { id: 'pn2', name: 'KEM Hospital Pune', address: 'Sardar Moodliar Road, Rasta Peth, Pune, Maharashtra 411011', city: 'Pune', lat: 18.5204, lng: 73.8672, status: 'green', wait: '20 mins', bedsAvailable: 62, totalBeds: 150, emergency: true, phone: '020-24126300', specialty: 'Pediatrics, ICU, Surgery' },
  { id: 'pn3', name: 'Deenanath Mangeshkar Hospital', address: 'Near Mhatre Bridge, Erandwane, Pune, Maharashtra 411004', city: 'Pune', lat: 18.5018, lng: 73.8291, status: 'green', wait: '10 mins', bedsAvailable: 85, totalBeds: 180, emergency: true, phone: '020-49153000', specialty: 'Multi-Specialty, Orthopedics' },
  { id: 'pn4', name: 'Ruby Hall Clinic', address: '40, Sassoon Road, Pune, Maharashtra 411001', city: 'Pune', lat: 18.5324, lng: 73.8767, status: 'green', wait: '12 mins', bedsAvailable: 95, totalBeds: 220, emergency: true, phone: '020-66455000', specialty: 'Cardiology, Neurology, Oncology' },
  { id: 'pn5', name: 'Jehangir Hospital', address: '32, Sassoon Road, Pune, Maharashtra 411001', city: 'Pune', lat: 18.5309, lng: 73.8756, status: 'green', wait: '8 mins', bedsAvailable: 70, totalBeds: 160, emergency: true, phone: '020-66810000', specialty: 'Emergency Care, Critical Care' },
  { id: 'pn6', name: 'Bharati Vidyapeeth Hospital', address: 'Pune-Satara Road, Dhankawadi, Pune, Maharashtra 411043', city: 'Pune', lat: 18.4608, lng: 73.8553, status: 'yellow', wait: '25 mins', bedsAvailable: 55, totalBeds: 170, emergency: true, phone: '020-24373788', specialty: 'General, Nephrology' },
  { id: 'pn7', name: 'Sancheti Orthopedic Hospital', address: 'Shivajinagar, Pune, Maharashtra 411005', city: 'Pune', lat: 18.5306, lng: 73.8504, status: 'green', wait: '15 mins', bedsAvailable: 40, totalBeds: 120, emergency: false, phone: '020-66037300', specialty: 'Orthopedics & Joint Replacement' },
  { id: 'pn8', name: 'Aundh District Civil Hospital', address: 'Aundh, Pune, Maharashtra 411027', city: 'Pune', lat: 18.5724, lng: 73.8058, status: 'yellow', wait: '30 mins', bedsAvailable: 22, totalBeds: 130, emergency: true, phone: '020-25888288', specialty: 'District Healthcare, Maternity' },
  { id: 'pn9', name: 'Yashwantrao Chavan Memorial Hospital (YCM)', address: 'Sant Tukaram Nagar, Pimpri, Pune, Maharashtra 411018', city: 'Pune', lat: 18.6280, lng: 73.8003, status: 'red', wait: '35 mins', bedsAvailable: 18, totalBeds: 190, emergency: true, phone: '020-27425800', specialty: 'Trauma, Intensive Care' },

  // 3. MUMBAI METROPOLITAN REGION (MMR)
  { id: 'mb1', name: 'KEM Hospital Mumbai', address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012', city: 'Mumbai', lat: 19.0024, lng: 72.8426, status: 'red', wait: '35 mins', bedsAvailable: 24, totalBeds: 350, emergency: true, phone: '022-24107000', specialty: 'Tertiary Care, Trauma Center' },
  { id: 'mb2', name: 'Lokmanya Tilak Municipal General Hospital (Sion)', address: 'Sion West, Mumbai, Maharashtra 400022', city: 'Mumbai', lat: 19.0379, lng: 72.8631, status: 'yellow', wait: '25 mins', bedsAvailable: 40, totalBeds: 300, emergency: true, phone: '022-24076381', specialty: 'Trauma & Emergency, Burns' },
  { id: 'mb3', name: 'BYL Nair Charitable Hospital', address: 'Dr. A.L. Nair Road, Mumbai Central, Mumbai, Maharashtra 400008', city: 'Mumbai', lat: 18.9744, lng: 72.8223, status: 'green', wait: '15 mins', bedsAvailable: 65, totalBeds: 250, emergency: true, phone: '022-23027000', specialty: 'Cardiology, Neurology' },
  { id: 'mb4', name: 'Sir J.J. Group of Hospitals', address: 'J.J. Marg, Byculla, Mumbai, Maharashtra 400008', city: 'Mumbai', lat: 18.9633, lng: 72.8314, status: 'red', wait: '40 mins', bedsAvailable: 15, totalBeds: 400, emergency: true, phone: '022-23735555', specialty: 'Super-Specialty & State Referral' },
  { id: 'mb5', name: 'Dr. R.N. Cooper Hospital', address: 'U15, Bhaktivedanta Swami Marg, Juhu, Vile Parle West, Mumbai, Maharashtra 400056', city: 'Mumbai', lat: 19.1082, lng: 72.8361, status: 'green', wait: '12 mins', bedsAvailable: 78, totalBeds: 200, emergency: true, phone: '022-26207254', specialty: 'General, Maternity, ICU' },
  { id: 'mb6', name: 'Tata Memorial Hospital', address: 'Dr. E. Borges Marg, Parel, Mumbai, Maharashtra 400012', city: 'Mumbai', lat: 19.0064, lng: 72.8436, status: 'yellow', wait: '20 mins', bedsAvailable: 50, totalBeds: 300, emergency: false, phone: '022-24177000', specialty: 'Advanced Oncology, Bone Marrow' },

  // 4. NASHIK & NORTH MAHARASHTRA
  { id: 'nk1', name: 'Nashik District Civil Hospital', address: 'Trimbak Road, Near CBS, Nashik, Maharashtra 422002', city: 'Nashik', lat: 19.9975, lng: 73.7898, status: 'yellow', wait: '20 mins', bedsAvailable: 45, totalBeds: 180, emergency: true, phone: '0253-2572111', specialty: 'General Healthcare, Trauma' },
  { id: 'nk2', name: 'Apollo Hospitals Nashik', address: 'Damani Nagar, Swargate, Nashik, Maharashtra 422001', city: 'Nashik', lat: 19.9705, lng: 73.8021, status: 'green', wait: '10 mins', bedsAvailable: 80, totalBeds: 150, emergency: true, phone: '0253-6688888', specialty: 'Cardiology, Orthopedics' },

  // 5. CHHATRAPATI SAMBHAJINAGAR (AURANGABAD)
  { id: 'cs1', name: 'Government Medical College & Hospital (GMCH)', address: 'Jubilee Park, Panchakki Rd, Chhatrapati Sambhajinagar, Maharashtra 431001', city: 'Chhatrapati Sambhajinagar', lat: 19.8654, lng: 75.3211, status: 'yellow', wait: '22 mins', bedsAvailable: 60, totalBeds: 250, emergency: true, phone: '0240-2402412', specialty: 'General Surgery, Pediatrics' },
  { id: 'cs2', name: 'MGM Medical College & Hospital', address: 'N-6, CIDCO, Chhatrapati Sambhajinagar, Maharashtra 431003', city: 'Chhatrapati Sambhajinagar', lat: 19.8732, lng: 75.3621, status: 'green', wait: '12 mins', bedsAvailable: 95, totalBeds: 200, emergency: true, phone: '0240-6601100', specialty: 'Super-Specialty, Critical Care' }
];

export default function HospitalsPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'low_wait'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedHospital, setSelectedHospital] = useState<HospitalItem | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const requestUserLocation = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setLocationStatus('Locating...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserCoords(coords);
          try {
            localStorage.setItem('maha_user_coords', JSON.stringify(coords));
          } catch (e) {}
          setLocationStatus('GPS Active');
          showToast(`📍 Live user location acquired (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})! Ranked all hospitals by real driving distance.`);
        },
        (err) => {
          let fallback = { lat: 21.0833, lng: 79.0993 };
          try {
            const saved = localStorage.getItem('maha_user_coords');
            if (saved) fallback = JSON.parse(saved);
          } catch (e) {}
          setUserCoords(fallback);
          setLocationStatus('GPS Active');
          showToast(`📍 Centered on Nagpur Healthcare Grid.`);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    } else {
      const fallback = { lat: 21.0833, lng: 79.0993 };
      setUserCoords(fallback);
    }
  };

  useEffect(() => {
    requestUserLocation();
  }, []);

  const handleBookToken = (hospital: HospitalItem) => {
    const newToken = {
      tokenNumber: 'A-110',
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
      department: 'General Medicine OPD',
      roomNo: 'Consulting Room 104',
      currentToken: 'A-106',
      estimatedWaitMinutes: parseInt(hospital.wait) || 15,
      peopleAhead: 4,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      slot: 'Next Slot (' + new Date(Date.now() + 20 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')',
      patientName: 'Rajesh Patil'
    };
    localStorage.setItem('maha_active_token', JSON.stringify(newToken));
    showToast(`🎫 OPD Token A-110 booked at ${hospital.name}! Redirecting to live token tracker...`);
    setTimeout(() => {
      router.push('/queue');
    }, 900);
  };

  const handleOpenDirections = (hospital: HospitalItem) => {
    const originLat = userCoords ? userCoords.lat : 21.0833;
    const originLng = userCoords ? userCoords.lng : 79.0993;
    const destinationQuery = encodeURIComponent(`${hospital.name}, ${hospital.address}`);
    const gmapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destinationQuery}&travelmode=driving`;
    
    window.open(gmapsUrl, '_blank');
    showToast(`🗺️ Opening live turn-by-turn GPS navigation to ${hospital.name}...`);
  };

  const hospitalsWithDistance = ALL_MAHARASHTRA_HOSPITALS.map(h => {
    const distanceKm = userCoords ? calculateDistance(userCoords.lat, userCoords.lng, h.lat, h.lng) : 2.5;
    return { ...h, distanceKm };
  }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  const filteredHospitals = hospitalsWithDistance.filter(h => {
    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    const matchesSearch = h.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          h.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          h.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'emergency' ? h.emergency :
      activeFilter === 'low_wait' ? parseInt(h.wait) <= 15 : true;
    return matchesCity && matchesSearch && matchesFilter;
  });

  const hospitalMarkers: MarkerData[] = filteredHospitals.map(h => ({
    id: h.id,
    position: [h.lat, h.lng] as [number, number],
    title: h.name,
    color: h.status,
    details: (
      <div className="mt-1 space-y-1">
        <p className="text-xs font-bold text-slate-900">{h.name}</p>
        <p className="text-[11px] text-slate-500">{h.address}</p>
        <p className="text-xs text-slate-700">Wait: <b>{h.wait}</b> • Available Beds: <b>{h.bedsAvailable}</b></p>
        <p className="text-[11px] text-teal-600 font-semibold">{h.specialty}</p>
        <a 
          href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords ? userCoords.lat : 21.0833},${userCoords ? userCoords.lng : 79.0993}&destination=${encodeURIComponent(h.name + ', ' + h.address)}&travelmode=driving`} 
          target="_blank" 
          rel="noreferrer"
          className="text-[11px] text-blue-600 font-bold hover:underline block pt-1"
        >
          📍 Open in Google Maps &rarr;
        </a>
      </div>
    )
  }));

  const userMarker: MarkerData[] = userCoords ? [{
    id: 'user_live_pos',
    position: [userCoords.lat, userCoords.lng] as [number, number],
    title: 'You Are Here (Live Location)',
    color: 'blue',
    details: (
      <div className="p-1">
        <p className="text-xs font-black text-blue-600">👤 {t('youAreHere')}</p>
        <p className="text-[10px] text-slate-500 font-mono">{userCoords.lat.toFixed(5)}, {userCoords.lng.toFixed(5)}</p>
      </div>
    )
  }] : [];

  const allMarkers = [...userMarker, ...hospitalMarkers];

  const currentMapCenter: [number, number] = selectedHospital 
    ? [selectedHospital.lat, selectedHospital.lng]
    : userCoords 
    ? [userCoords.lat, userCoords.lng] 
    : [21.0833, 79.0993];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Filter Bar */}
      <div className="p-3.5 sm:p-4 bg-white border-b border-slate-200 flex flex-col lg:flex-row gap-3 items-center justify-between shadow-2xs z-10">
        <div className="relative flex-1 w-full lg:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            className="pl-10 h-10 w-full rounded-xl bg-slate-50 border-slate-200 text-slate-950 font-bold" 
            placeholder={t('hospSearchPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
          {['All', 'Nagpur', 'Pune', 'Mumbai', 'Nashik', 'Chhatrapati Sambhajinagar'].map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
                selectedCity === city ? 'bg-slate-900 text-white shadow-2xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Status / Urgency Filters */}
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
          <Button 
            size="sm" 
            onClick={requestUserLocation}
            variant="outline"
            className="border-teal-500 text-teal-700 bg-teal-50 hover:bg-teal-100 font-bold text-xs shrink-0"
          >
            <Compass className="w-3.5 h-3.5 mr-1 text-teal-600" />
            {locationStatus || t('hospUseLocation')}
          </Button>

          <Button 
            size="sm"
            onClick={() => setActiveFilter('all')}
            variant={activeFilter === 'all' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 ${activeFilter === 'all' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-slate-300'}`}
          >
            {t('hospAll')} ({filteredHospitals.length})
          </Button>
          <Button 
            size="sm"
            onClick={() => setActiveFilter('emergency')}
            variant={activeFilter === 'emergency' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 ${activeFilter === 'emergency' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-slate-300'}`}
          >
            {t('hospEmergencyReady')}
          </Button>
          <Button 
            size="sm"
            onClick={() => setActiveFilter('low_wait')}
            variant={activeFilter === 'low_wait' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 ${activeFilter === 'low_wait' ? 'bg-teal-600 hover:bg-teal-700 text-white' : 'border-slate-300'}`}
          >
            {t('hospLowestWait')}
          </Button>
        </div>
      </div>
      
      {/* Main Split: Hospital List & GIS Map */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Sidebar Hospital Cards */}
        <div className="w-full lg:w-[480px] bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 space-y-3.5">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {filteredHospitals.length} {t('facilitiesAvailable')} ({selectedCity})
            </span>
            <span className="text-xs text-teal-600 font-semibold">
              {t('localDistrict')}
            </span>
          </div>

          {filteredHospitals.map(hospital => (
            <Card 
              key={hospital.id} 
              className={`hover:border-teal-500 hover:shadow-md transition-all rounded-3xl bg-white border border-slate-200 cursor-pointer ${selectedHospital?.id === hospital.id ? 'ring-2 ring-teal-500' : ''}`}
              onClick={() => setSelectedHospital(hospital)}
            >
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{hospital.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0"/> {hospital.address}
                    </p>
                  </div>
                  <Badge variant={
                    hospital.status === 'red' ? 'danger' : 
                    hospital.status === 'yellow' ? 'warning' : 'success'
                  } className="text-[10px]">
                    {hospital.status === 'red' ? t('overloaded') : 
                     hospital.status === 'yellow' ? t('busy') : t('optimal')}
                  </Badge>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl my-2.5 text-xs text-slate-700 font-medium">
                  🩺 <span className="font-bold text-slate-800">{hospital.specialty}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-bold text-slate-700 mb-4 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-teal-600"/> ~{hospital.wait}</div>
                  <div className="flex items-center gap-1"><Bed className="h-3.5 w-3.5 text-teal-600"/> {hospital.bedsAvailable} {t('dashAvailableBeds')}</div>
                  <div className="flex items-center gap-1 text-teal-700">
                    <Navigation className="h-3.5 w-3.5 text-teal-600"/> {hospital.distanceKm !== undefined ? `${hospital.distanceKm} km` : '~2.1 km'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={(e) => { e.stopPropagation(); handleBookToken(hospital); }}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 shadow-2xs"
                  >
                    {t('issueTokenBtn')}
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      handleOpenDirections(hospital);
                    }}
                    className="px-3 border-slate-300 text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-400 font-bold text-xs flex items-center gap-1"
                    title="Open Live GPS Route in Google Maps"
                  >
                    <Navigation className="h-3.5 w-3.5 text-teal-600"/>
                    <span>{t('hospGetDirections')}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Map View */}
        <div className="flex-1 h-full relative z-0 bg-slate-100 min-h-[300px]">
          <DynamicMap 
            markers={allMarkers} 
            center={currentMapCenter} 
            zoom={selectedHospital ? 14 : userCoords ? 13 : 11} 
          />
        </div>
      </div>
    </div>
  );
}

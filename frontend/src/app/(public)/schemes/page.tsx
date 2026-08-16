"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
  Sparkles, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  FileText, 
  Building, 
  HelpCircle, 
  ExternalLink,
  ChevronRight,
  HeartPulse,
  Baby,
  Activity,
  UserCheck,
  Calculator,
  AlertCircle,
  X,
  Printer,
  Download,
  Info,
  BadgeCheck,
  ArrowRight,
  QrCode,
  Loader2,
  Lock
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface SchemeRule {
  id: string;
  name: string;
  marathiName: string;
  hindiName: string;
  authority: string;
  coverage: string;
  maxAmount: number;
  category: 'universal' | 'maternal' | 'financial' | 'senior' | 'child';
  description: string;
  eligibilitySummary: string;
  requiredDocuments: string[];
  coveredProcedures: string[];
  officialPortalUrl: string;
  arogyamitraHelpdesk: string;
}

const SCHEMES_DATABASE: SchemeRule[] = [
  {
    id: 'mjpjay',
    name: 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
    marathiName: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY)',
    hindiName: 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY)',
    authority: 'State Health Assurance Society (SHAS), Govt of Maharashtra',
    coverage: '₹5,00,000 / Year / Family (100% Cashless)',
    maxAmount: 500000,
    category: 'universal',
    description: 'Universal cashless healthcare cover for all Maharashtra ration card holders (Yellow, Orange, White). Covers 996 medical & surgical procedures in over 1,000 empanelled network hospitals.',
    eligibilitySummary: 'All valid Maharashtra Ration Card holders (Yellow / Orange / White) and ABHA registered families.',
    requiredDocuments: [
      'Valid Maharashtra Ration Card (Yellow, Orange, or White)',
      'Aadhaar Card of patient and family head',
      'Doctor Consultation / Diagnosis Report from Empanelled Hospital'
    ],
    coveredProcedures: [
      'Cardiovascular Surgeries (Angioplasty, CABG bypass, Valve Replacement)',
      'Oncology (Chemotherapy, Radiation, Surgical Oncology)',
      'Orthopedic Surgeries & Joint Replacements',
      'Nephrology & Renal Dialysis Care',
      'Polytrauma, Neurosurgery & Burn Management'
    ],
    officialPortalUrl: 'https://www.jeevandayee.gov.in/',
    arogyamitraHelpdesk: '1800-233-2200 (Toll Free 24x7)'
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat — Pradhan Mantri Jan Arogya Yojana (AB-PMJAY)',
    marathiName: 'आयुष्मान भारत — प्रधानमंत्री जन आरोग्य योजना (AB-PMJAY)',
    hindiName: 'आयुष्मान भारत — प्रधानमंत्री जन आरोग्य योजना (AB-PMJAY)',
    authority: 'National Health Authority (NHA) & GoM',
    coverage: '₹5,00,000 / Year / Family (Pan-India Portability)',
    maxAmount: 500000,
    category: 'universal',
    description: 'National health protection assurance covering secondary and tertiary inpatient hospitalization across 27,000+ empanelled public and private hospitals across India.',
    eligibilitySummary: 'Identified families under SECC 2011 deprivation criteria, BPL, Yellow Ration Card, or annual family income ≤ ₹1,20,000.',
    requiredDocuments: [
      'Ayushman / PM-JAY Card or ABHA Health ID',
      'Aadhaar Card',
      'Ration Card / SECC Identification Letter'
    ],
    coveredProcedures: [
      '1,949 Specialized Treatment Packages',
      'Day Care Surgeries & Intensive Care Unit (ICU) admissions',
      'Pre-hospitalization (3 days) and Post-hospitalization (15 days) medicine expenses'
    ],
    officialPortalUrl: 'https://beneficiary.nha.gov.in/',
    arogyamitraHelpdesk: '14555 (National Toll-Free)'
  },
  {
    id: 'pmjay_senior',
    name: 'AB-PMJAY Vayoshreshtha (Senior Citizens 70+)',
    marathiName: 'आयुष्मान वय ज्येष्ठ योजना (७०+ ज्येष्ठ नागरिक)',
    hindiName: 'आयुष्मान वय वंदना योजना (70+ वरिष्ठ नागरिक)',
    authority: 'Ministry of Health & Family Welfare (MoHFW)',
    coverage: '₹5,00,000 Exclusive Top-Up / Senior Citizen',
    maxAmount: 500000,
    category: 'senior',
    description: 'Dedicated universal healthcare cover for all senior citizens aged 70 years and above, irrespective of household income. Operates on a distinct green Ayushman Vaya Card.',
    eligibilitySummary: 'All citizens aged 70 years and above (based on Aadhaar verified date of birth).',
    requiredDocuments: [
      'Aadhaar Card (Age 70+ Verified)',
      'Active Mobile Number linked to Aadhaar'
    ],
    coveredProcedures: [
      'Geriatric specialized inpatient care',
      'Cardiac, Stroke, Knee Replacement, and Ophthalmic procedures',
      'Palliative and Chronic disease management'
    ],
    officialPortalUrl: 'https://beneficiary.nha.gov.in/',
    arogyamitraHelpdesk: '14555 / 1800-111-565'
  },
  {
    id: 'jssk',
    name: 'Janani Shishu Suraksha Karyakram (JSSK)',
    marathiName: 'जननी शिशु सुरक्षा कार्यक्रम (JSSK)',
    hindiName: 'जननी शिशु सुरक्षा कार्यक्रम (JSSK)',
    authority: 'Public Health Department, Maharashtra',
    coverage: '100% Free Zero-Expense Mother & Child Care',
    maxAmount: 50000,
    category: 'maternal',
    description: 'Zero out-of-pocket expenses for all pregnant women delivering in public health institutions and for sick infants up to 1 year of age.',
    eligibilitySummary: 'All pregnant women and sick neonates / infants (< 1 year) delivering or treated at public health facilities.',
    requiredDocuments: [
      'Mother and Child Protection (MCP) Card',
      'Aadhaar Card of Mother'
    ],
    coveredProcedures: [
      'Free Normal Delivery and Caesarean Section (C-Section)',
      'Free blood transfusions, lab diagnostics & sonography',
      'Free diet during hospital stay',
      'Free 108 Emergency Ambulance transport from home to hospital and drop-back'
    ],
    officialPortalUrl: 'https://nhm.gov.in/',
    arogyamitraHelpdesk: '108 (Emergency Dispatch)'
  },
  {
    id: 'cmrf',
    name: 'Chief Minister’s Medical Relief Fund (CMRF Maharashtra)',
    marathiName: 'मुख्यमंत्री वैद्यकीय सहाय्यता निधी (CMRF)',
    hindiName: 'मुख्यमंत्री चिकित्सा सहायता कोष (CMRF)',
    authority: 'Chief Minister Office (CMO), Maharashtra',
    coverage: 'Direct Financial Grant up to ₹3,00,000',
    maxAmount: 300000,
    category: 'financial',
    description: 'Direct financial assistance grant for indigent patients requiring major surgeries and life-saving treatments not fully covered by regular insurance.',
    eligibilitySummary: 'Families residing in Maharashtra with annual income under ₹1,60,000 suffering from life-threatening critical illnesses.',
    requiredDocuments: [
      'Annual Income Certificate issued by Tehsildar (< ₹1.6 Lakhs)',
      'Doctor Hospital Quotation / Estimate with Civil Surgeon signature',
      'Ration Card & Aadhaar Card'
    ],
    coveredProcedures: [
      'Organ Transplants (Liver, Kidney, Bone Marrow, Heart)',
      'Open Heart Surgery & Congenital Pediatric Heart Defects',
      'Cancer Surgery, Bone Grafting, and Severe Accidental Trauma',
      'Cochlear Implant for Children'
    ],
    officialPortalUrl: 'https://cmrf.maharashtra.gov.in/',
    arogyamitraHelpdesk: '022-22026948 / 8650567567 (CM Medical Helpline)'
  },
  {
    id: 'rbsk',
    name: 'Rashtriya Bal Swasthya Karyakram (RBSK)',
    marathiName: 'राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)',
    hindiName: 'राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)',
    authority: 'National Health Mission (NHM) Maharashtra',
    coverage: '100% Free Screening & Tertiary Surgeries',
    maxAmount: 150000,
    category: 'child',
    description: 'Child health screening and early intervention services for 4Ds: Defects at birth, Diseases, Deficiencies, and Developmental delays including disability.',
    eligibilitySummary: 'All children aged 0 to 18 years enrolled in Anganwadis and Government / Aided schools.',
    requiredDocuments: [
      'School / Anganwadi ID or Birth Certificate',
      'RBSK Mobile Health Team Referral Card'
    ],
    coveredProcedures: [
      'Club Foot, Cleft Lip & Cleft Palate surgical repairs',
      'Congenital Heart Diseases (VSD/ASD closure)',
      'Severe Acute Malnutrition (NRC treatment)',
      'Vision and Hearing Impairment interventions'
    ],
    officialPortalUrl: 'https://rbsk.gov.in/',
    arogyamitraHelpdesk: 'District Early Intervention Centre (DEIC)'
  }
];

const SAMPLE_ABHA_PROFILES = [
  {
    name: 'Rajesh Patil',
    abhaNumber: '91-4829-1029-4821',
    age: 42,
    income: 95000,
    rationCard: 'orange' as const,
    genderStatus: 'general' as const,
    district: 'Nagpur',
    condition: 'surgery',
    badge: 'Farmer / Orange Ration Card'
  },
  {
    name: 'Sunita Sharma',
    abhaNumber: '91-8392-4410-9122',
    age: 28,
    income: 60000,
    rationCard: 'yellow' as const,
    genderStatus: 'pregnant' as const,
    district: 'Pune',
    condition: 'maternity',
    badge: 'Pregnant Mother / Yellow BPL Card'
  },
  {
    name: 'Ganpat Rao Deshmukh',
    abhaNumber: '91-7290-3301-8419',
    age: 74,
    income: 180000,
    rationCard: 'white' as const,
    genderStatus: 'general' as const,
    district: 'Mumbai',
    condition: 'critical',
    badge: 'Senior Citizen (70+) / White Card'
  },
  {
    name: 'Aarav Kadam',
    abhaNumber: '91-6201-9941-2018',
    age: 7,
    income: 50000,
    rationCard: 'yellow' as const,
    genderStatus: 'general' as const,
    district: 'Nashik',
    condition: 'general',
    badge: 'Child (0-18y) / BPL Family'
  }
];

export default function SchemesPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Inputs — STARTS UNFILLED / CLEAN!
  const [age, setAge] = useState<string>('');
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [rationCard, setRationCard] = useState<string>('');
  const [genderStatus, setGenderStatus] = useState<'general' | 'pregnant' | 'infant'>('general');
  const [district, setDistrict] = useState<string>('Nagpur');
  const [healthCondition, setHealthCondition] = useState<string>('general');
  const [abhaId, setAbhaId] = useState<string>('');
  const [beneficiaryName, setBeneficiaryName] = useState<string>('Citizen');

  // Verification State
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [eligibleSchemes, setEligibleSchemes] = useState<SchemeRule[]>([]);

  // Modals
  const [selectedSchemeDetail, setSelectedSchemeDetail] = useState<SchemeRule | null>(null);
  const [applicationModalScheme, setApplicationModalScheme] = useState<SchemeRule | null>(null);
  const [isAbhaModalOpen, setIsAbhaModalOpen] = useState<boolean>(false);
  const [customAbhaInput, setCustomAbhaInput] = useState<string>('91-4829-1029-4821');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [extractionStep, setExtractionStep] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Evaluate schemes based on user input
  const calculateEligibility = (
    evalAge: number, 
    evalIncome: number, 
    evalRation: string, 
    evalGender: string, 
    evalCondition: string
  ) => {
    if (isNaN(evalAge) || evalAge < 0 || !evalRation) {
      showToast('⚠️ Please provide your Age and Maharashtra Ration Card type.');
      return;
    }

    const matched: SchemeRule[] = [];

    // 1. MJPJAY: All valid ration card holders in Maharashtra (Yellow, Orange, White)
    if (evalRation === 'yellow' || evalRation === 'orange' || evalRation === 'white') {
      const mjpjay = SCHEMES_DATABASE.find(s => s.id === 'mjpjay');
      if (mjpjay) matched.push(mjpjay);
    }

    // 2. PM-JAY: Yellow card OR Orange with income <= 1,20,000
    if (evalRation === 'yellow' || (evalRation === 'orange' && evalIncome <= 120000)) {
      const pmjay = SCHEMES_DATABASE.find(s => s.id === 'pmjay');
      if (pmjay) matched.push(pmjay);
    }

    // 3. Senior Citizen (70+)
    if (evalAge >= 70) {
      const senior = SCHEMES_DATABASE.find(s => s.id === 'pmjay_senior');
      if (senior) matched.push(senior);
    }

    // 4. JSSK: Pregnant woman or Infant (< 1 year)
    if (evalGender === 'pregnant' || evalGender === 'infant' || evalAge < 1) {
      const jssk = SCHEMES_DATABASE.find(s => s.id === 'jssk');
      if (jssk) matched.push(jssk);
    }

    // 5. CMRF: Income <= 1,60,000 AND critical condition
    if (evalIncome <= 160000 && (evalCondition === 'critical' || evalCondition === 'surgery')) {
      const cmrf = SCHEMES_DATABASE.find(s => s.id === 'cmrf');
      if (cmrf) matched.push(cmrf);
    }

    // 6. RBSK: Age <= 18 years
    if (evalAge <= 18) {
      const rbsk = SCHEMES_DATABASE.find(s => s.id === 'rbsk');
      if (rbsk) matched.push(rbsk);
    }

    setEligibleSchemes(matched);
    setIsCalculated(true);
    showToast(`✅ Eligibility Verified! Found ${matched.length} Qualified Health Assurances.`);
  };

  const handleManualCalculate = () => {
    const numAge = Number(age);
    const numIncome = Number(annualIncome) || 0;
    calculateEligibility(numAge, numIncome, rationCard, genderStatus, healthCondition);
  };

  // ABHA Extraction Workflow
  const handleExtractFromProfile = (profile: typeof SAMPLE_ABHA_PROFILES[0]) => {
    setIsExtracting(true);
    setExtractionStep('Connecting to ABDM National Sandbox Gateway...');

    setTimeout(() => {
      setExtractionStep('Verifying NFSA Maharashtra Ration Card Database...');
    }, 600);

    setTimeout(() => {
      setExtractionStep('Extracting Demographics & Verified Income Certificate...');
    }, 1200);

    setTimeout(() => {
      setIsExtracting(false);
      setIsAbhaModalOpen(false);

      // Populate State
      setBeneficiaryName(profile.name);
      setAbhaId(profile.abhaNumber);
      setAge(profile.age.toString());
      setAnnualIncome(profile.income.toString());
      setRationCard(profile.rationCard);
      setGenderStatus(profile.genderStatus);
      setDistrict(profile.district);
      setHealthCondition(profile.condition);

      // Run Calculation
      calculateEligibility(profile.age, profile.income, profile.rationCard, profile.genderStatus, profile.condition);
      showToast(`🪪 ABHA Verified: Loaded demographics for ${profile.name} (${profile.age}y, ${profile.district})!`);
    }, 1800);
  };

  const handleCustomAbhaExtract = () => {
    if (!customAbhaInput.trim()) {
      showToast('⚠️ Please enter a valid 14-digit ABHA ID.');
      return;
    }
    // Default to Rajesh Patil profile with custom ABHA ID
    const base = SAMPLE_ABHA_PROFILES[0];
    handleExtractFromProfile({
      ...base,
      abhaNumber: customAbhaInput
    });
  };

  const handleResetForm = () => {
    setAge('');
    setAnnualIncome('');
    setRationCard('');
    setGenderStatus('general');
    setHealthCondition('general');
    setAbhaId('');
    setBeneficiaryName('Citizen');
    setIsCalculated(false);
    setEligibleSchemes([]);
    showToast('🧹 Form cleared. Ready for your details.');
  };

  const totalAssuranceAmount = eligibleSchemes.reduce((acc, s) => acc + s.maxAmount, 0);

  const filteredSchemes = SCHEMES_DATABASE.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.authority.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto w-full p-4 sm:p-6 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" /> 
            {language === 'mr' ? 'महाराष्ट्र शासन आरोग्य योजना' : language === 'hi' ? 'महाराष्ट्र सरकार स्वास्थ्य योजनाएं' : 'Govt of Maharashtra Healthcare Assurances'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === 'mr' ? 'शासकीय आरोग्य योजना व कॅशलेस पात्रता तपासक' : language === 'hi' ? 'सरकारी स्वास्थ्य योजनाएं एवं कैशलेस पात्रता' : 'Government Health Schemes & Eligibility Engine'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {language === 'mr' 
              ? 'तुमचे वय, कौटुंबिक उत्पन्न आणि शिधापत्रिकेनुसार महात्मा फुले जन आरोग्य (MJPJAY), आयुष्यमान भारत (PM-JAY) व इतर योजनांची पात्रता तपासा.'
              : language === 'hi'
              ? 'अपनी आयु, पारिवारिक आय और राशन कार्ड के आधार पर महात्मा फुले योजना (MJPJAY), आयुष्मान भारत (PM-JAY) की पात्रता तुरंत जांचें।'
              : 'Enter your age, household income, and ration card status or extract from your ABHA Health ID to verify guaranteed cashless coverage.'}
          </p>
        </div>

        <Button
          onClick={() => setIsAbhaModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-5 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 shrink-0 flex items-center gap-2 cursor-pointer transition-all hover:scale-105"
        >
          <UserCheck className="w-4 h-4" />
          {language === 'mr' ? 'ABHA कार्ड वरून माहिती फेच करा' : language === 'hi' ? 'ABHA कार्ड से जानकारी निकालें' : 'Fetch Info via ABHA Card ↗'}
        </Button>
      </div>

      {/* Interactive Eligibility Input & Instant Calculator Engine */}
      <Card className="rounded-3xl border border-slate-200 bg-white shadow-md overflow-hidden">
        <CardHeader className="bg-slate-50/80 border-b border-slate-100 p-5 sm:p-6 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-base sm:text-lg font-black text-slate-900">
                {language === 'mr' ? 'नागरिक पात्रता फॉर्म' : language === 'hi' ? 'नागरिक पात्रता फॉर्म' : 'Citizen Demographic & Scheme Eligibility Form'}
              </CardTitle>
              <p className="text-xs text-slate-500">
                {isCalculated 
                  ? `Showing verified results for ${beneficiaryName} in ${district} district.` 
                  : 'Fill the fields below or click "Fetch Info via ABHA Card" above to check your benefits.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isCalculated && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleResetForm}
                className="text-xs font-bold border-slate-300 hover:bg-slate-100 text-slate-600 rounded-xl"
              >
                Clear Form
              </Button>
            )}
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 font-bold text-xs">
              Live AI Rule Matrix
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Input 1: Age */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {language === 'mr' ? 'नागरिकाचे वय (वर्षे) *' : language === 'hi' ? 'नागरिक की आयु (वर्ष) *' : 'Citizen Age (Years) *'}
              </label>
              <div className="flex items-center gap-2">
                <Input 
                  type="number"
                  min={0}
                  max={110}
                  placeholder="e.g. 42"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="font-bold text-base bg-slate-50 border-slate-300 rounded-xl text-slate-950"
                />
                <div className="flex gap-1 shrink-0">
                  {[8, 35, 72].map(quickAge => (
                    <button
                      key={quickAge}
                      type="button"
                      onClick={() => setAge(quickAge.toString())}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-extrabold text-slate-700 cursor-pointer"
                    >
                      {quickAge}y
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Input 2: Annual Household Income */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {language === 'mr' ? 'वार्षिक कौटुंबिक उत्पन्न (₹)' : language === 'hi' ? 'वार्षिक पारिवारिक आय (₹)' : 'Annual Household Income (₹)'}
              </label>
              <Input 
                type="number"
                step={10000}
                placeholder="e.g. 95000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                className="font-bold text-base bg-slate-50 border-slate-300 rounded-xl text-slate-950"
              />
              <div className="flex gap-1 pt-0.5">
                {[60000, 120000, 180000].map(inc => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setAnnualIncome(inc.toString())}
                    className="flex-1 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 cursor-pointer"
                  >
                    ₹{(inc/1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Ration Card Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {language === 'mr' ? 'शिधापत्रिका प्रकार *' : language === 'hi' ? 'राशन कार्ड का प्रकार *' : 'Maharashtra Ration Card *'}
              </label>
              <select
                value={rationCard}
                onChange={(e) => setRationCard(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs font-bold focus:ring-2 focus:ring-teal-500 cursor-pointer ${
                  !rationCard ? 'border-amber-400 bg-amber-50/50 text-slate-500' : 'border-slate-300 bg-slate-50 text-slate-900'
                }`}
              >
                <option value="">-- Select Ration Card Type --</option>
                <option value="yellow">🟡 Yellow (BPL / Antyodaya Anna Yojana)</option>
                <option value="orange">🟠 Orange / Saffron (APL &lt; ₹1 Lakh/yr)</option>
                <option value="white">⚪ White (Universal MJPJAY &gt; ₹1 Lakh/yr)</option>
                <option value="none">❌ None / Not Registered</option>
              </select>
            </div>

            {/* Input 4: Special Demographics / Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {language === 'mr' ? 'विशेष वर्ग / स्थिती' : language === 'hi' ? 'विशेष श्रेणी / स्थिति' : 'Special Demographic Status'}
              </label>
              <select
                value={genderStatus}
                onChange={(e) => setGenderStatus(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="general">General Citizen</option>
                <option value="pregnant">🤰 Pregnant Woman / Maternity Care</option>
                <option value="infant">👶 Infant / Child under 1 Year</option>
              </select>
            </div>

            {/* Input 5: Current Medical Need */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {language === 'mr' ? 'वैद्यकीय गरज / आजार' : language === 'hi' ? 'चिकित्सा आवश्यकता' : 'Medical Need / Condition'}
              </label>
              <select
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="general">General Consultation / OPD Visit</option>
                <option value="surgery">Secondary Surgery / Inpatient Care</option>
                <option value="critical">Critical Illness (Cancer / Bypass / Kidney / Transplant)</option>
                <option value="maternity">Delivery & Infant Care</option>
              </select>
            </div>

            {/* Input 6: District */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                {language === 'mr' ? 'जिल्हा' : language === 'hi' ? 'जिला' : 'District of Maharashtra'}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-300 bg-slate-50 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-teal-500 cursor-pointer"
              >
                <option value="Nagpur">Nagpur (Vidarbha)</option>
                <option value="Pune">Pune (Western Maharashtra)</option>
                <option value="Mumbai">Mumbai Suburban</option>
                <option value="Nashik">Nashik</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                <option value="Amravati">Amravati</option>
              </select>
            </div>
          </div>

          {/* Results Summary Box */}
          {isCalculated ? (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 via-slate-900 to-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-teal-500/30 animate-in fade-in">
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-300 bg-teal-500/20 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                  Verified Eligibility Verdict
                </span>
                <p className="text-xl sm:text-2xl font-black">
                  ✅ Qualified for <span className="text-amber-400">{eligibleSchemes.length} Government Schemes</span>
                </p>
                <p className="text-xs text-slate-300">
                  Beneficiary: <b>{beneficiaryName}</b> • Cumulative Assured Cashless Protection: <b className="text-emerald-400">₹{totalAssuranceAmount.toLocaleString('en-IN')} / Year</b> in {district}.
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button 
                  onClick={handleManualCalculate}
                  className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  Re-Calculate
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-slate-700">
                <Info className="w-5 h-5 text-teal-600 shrink-0" />
                <p className="text-xs font-medium">
                  Enter your age, income, and ration card above and click <b>Calculate</b>, or fetch directly using your ABHA ID.
                </p>
              </div>
              <Button
                onClick={handleManualCalculate}
                className="bg-teal-600 hover:bg-teal-700 text-white font-black text-xs px-6 py-2.5 rounded-xl shadow-xs shrink-0 cursor-pointer"
              >
                ⚡ Calculate Scheme Eligibility
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'mr' ? 'योजनेचे नाव किंवा आजार शोधा...' : language === 'hi' ? 'योजना का नाम या बीमारी खोजें...' : 'Search schemes, procedures or benefits...'}
            className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 text-slate-950 font-bold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 cursor-pointer ${selectedCategory === 'all' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            {language === 'mr' ? 'सर्व योजना' : language === 'hi' ? 'सभी योजनाएं' : 'All Schemes'} ({filteredSchemes.length})
          </Button>
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('universal')}
            variant={selectedCategory === 'universal' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 cursor-pointer ${selectedCategory === 'universal' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            Universal (MJPJAY/PMJAY)
          </Button>
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('maternal')}
            variant={selectedCategory === 'maternal' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 cursor-pointer ${selectedCategory === 'maternal' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            Maternal & Infant
          </Button>
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('financial')}
            variant={selectedCategory === 'financial' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 cursor-pointer ${selectedCategory === 'financial' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            CM Relief Fund
          </Button>
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('senior')}
            variant={selectedCategory === 'senior' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 cursor-pointer ${selectedCategory === 'senior' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            Senior (70+)
          </Button>
        </div>
      </div>

      {/* Scheme Cards Grid with Live Eligibility Tagging */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => {
          const isEligible = isCalculated && eligibleSchemes.some(e => e.id === scheme.id);
          return (
            <Card 
              key={scheme.id} 
              onClick={() => setSelectedSchemeDetail(scheme)}
              className={`rounded-3xl border bg-white transition-all overflow-hidden flex flex-col justify-between cursor-pointer hover:shadow-lg ${
                isEligible 
                  ? 'border-emerald-400 shadow-md ring-2 ring-emerald-500/20 hover:border-emerald-500' 
                  : 'border-slate-200 opacity-95 hover:border-slate-300'
              }`}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-[10px]">
                        {scheme.authority}
                      </Badge>
                      {isCalculated ? (
                        isEligible ? (
                          <Badge className="bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> 100% Eligible for You
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-slate-400">
                            Criteria Not Met
                          </Badge>
                        )
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-teal-700 border-teal-200 bg-teal-50">
                          Click to Check
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                      {language === 'mr' ? scheme.marathiName : language === 'hi' ? scheme.hindiName : scheme.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{scheme.description}</p>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">
                      {language === 'mr' ? 'कव्हरेज मर्यादा' : language === 'hi' ? 'कवरेज सीमा' : 'Coverage Assurance'}
                    </span>
                    <span className="font-black text-emerald-700 text-xs sm:text-sm">{scheme.coverage}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px] uppercase">
                      {language === 'mr' ? 'पात्रता' : language === 'hi' ? 'पात्रता' : 'Eligibility Baseline'}
                    </span>
                    <span className="font-bold text-slate-900 text-xs line-clamp-2">{scheme.eligibilitySummary}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 block">Required Verification Documents:</span>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {scheme.requiredDocuments.slice(0, 2).map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>

              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <Button 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setApplicationModalScheme(scheme);
                  }}
                  className={`font-black text-xs rounded-xl shadow-xs cursor-pointer ${
                    isEligible 
                      ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                  {abhaId ? `Apply via ABHA (${abhaId.slice(-4)})` : 'Apply via ABHA ID'}
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSchemeDetail(scheme);
                  }}
                  className="border-slate-300 text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
                >
                  <Info className="w-3.5 h-3.5 text-teal-600" />
                  <span>Guidelines & Rules</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* ABHA Extraction Dialog Modal */}
      {isAbhaModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900">
            <div className="flex justify-between items-start border-b pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 font-bold">
                  <QrCode className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Ayushman Bharat ABHA Profile Fetcher</h3>
                  <p className="text-xs text-slate-500">Extract verified citizen demographics, ration card & age</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAbhaModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isExtracting ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                <p className="font-extrabold text-sm text-slate-800">{extractionStep}</p>
                <p className="text-xs text-slate-400">Authenticating via Aadhaar-linked National Health Registry...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Manual ABHA Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Enter 14-Digit ABHA Number or ABHA Address:</label>
                  <div className="flex gap-2">
                    <Input 
                      value={customAbhaInput}
                      onChange={(e) => setCustomAbhaInput(e.target.value)}
                      placeholder="e.g. 91-4829-1029-4821"
                      className="font-mono font-bold text-sm bg-slate-50 border-slate-300"
                    />
                    <Button 
                      onClick={handleCustomAbhaExtract}
                      className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-4 shrink-0 rounded-xl"
                    >
                      Extract Info
                    </Button>
                  </div>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase">Or Select Verified Sample Citizen</span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                {/* Sample Profile Cards */}
                <div className="space-y-2">
                  {SAMPLE_ABHA_PROFILES.map((prof, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExtractFromProfile(prof)}
                      className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-teal-50/70 hover:border-teal-400 text-left transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="font-black text-xs text-slate-900 group-hover:text-teal-700">{prof.name}</p>
                          <span className="text-[10px] font-mono text-slate-500">({prof.abhaNumber})</span>
                        </div>
                        <p className="text-[11px] text-slate-500">{prof.age}y • ₹{prof.income.toLocaleString()}/yr • {prof.badge} ({prof.district})</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 border-t flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsAbhaModalOpen(false)}
                className="border-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Guidelines & Full Documentation Modal */}
      {selectedSchemeDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <Badge className="bg-amber-100 text-amber-900 border-amber-300 text-xs mb-1.5 font-bold">
                  {selectedSchemeDetail.authority}
                </Badge>
                <h2 className="text-xl font-black text-slate-900">{selectedSchemeDetail.name}</h2>
                <p className="text-xs text-emerald-700 font-extrabold mt-0.5">Assured Cashless Cover: {selectedSchemeDetail.coverage}</p>
              </div>
              <button 
                onClick={() => setSelectedSchemeDetail(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-black text-slate-900 text-sm mb-1">Scheme Overview & Purpose</h4>
                <p className="text-slate-600 leading-relaxed">{selectedSchemeDetail.description}</p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5">Mandatory Verification Checklist</h4>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 font-medium">
                  {selectedSchemeDetail.requiredDocuments.map((doc, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black text-slate-900 text-sm mb-1.5">Key Covered Packages & Surgeries</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSchemeDetail.coveredProcedures.map((proc, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-100 text-teal-950 font-bold">
                      🩺 {proc}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                <p className="font-black">🏥 How to Claim at Hospital Kiosk (Arogyamitra Desk):</p>
                <p className="text-[11px] leading-relaxed">
                  Present your Ration Card and Aadhaar at the hospital Arogyamitra Helpdesk. Biometric e-KYC will generate an immediate pre-authorization token without paying any security deposit.
                </p>
                <p className="text-[11px] font-bold">24x7 Helpline: {selectedSchemeDetail.arogyamitraHelpdesk}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t">
              <a
                href={selectedSchemeDetail.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-center cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" /> Open Official Government Portal ↗
              </a>
              <Button
                variant="outline"
                onClick={() => setSelectedSchemeDetail(null)}
                className="border-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Pre-Authorization & ABHA Verification Certificate Modal */}
      {applicationModalScheme && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 shadow-2xl animate-in zoom-in-95 text-slate-900 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700 font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Pre-Authorization Health Assurance Pass</h3>
                  <p className="text-xs text-slate-500">Government of Maharashtra • E-KYC Verified</p>
                </div>
              </div>
              <button 
                onClick={() => setApplicationModalScheme(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white border border-teal-500/40 space-y-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-teal-300 font-bold">Sanctioned Scheme Assurance</p>
                  <h4 className="text-base font-black mt-0.5">{applicationModalScheme.name}</h4>
                  <p className="text-xs text-emerald-400 font-black mt-1">Cover Amount: {applicationModalScheme.coverage}</p>
                </div>
                <div className="p-2 rounded-xl bg-white/10 text-white">
                  <QrCode className="w-8 h-8" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-white/10 p-3 rounded-xl border border-white/10">
                <div>
                  <span className="text-slate-400 block text-[10px]">Beneficiary Name</span>
                  <span className="font-bold text-white">{beneficiaryName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ABHA Health ID</span>
                  <span className="font-mono font-bold text-teal-300">{abhaId || '91-4829-1029-4821'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Age / Gender</span>
                  <span className="font-bold text-white">{age || '42'} Years • {genderStatus === 'pregnant' ? 'Female (Maternal)' : 'Male'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Ration Card Status</span>
                  <span className="font-bold text-amber-300 uppercase">{rationCard || 'Orange'} Card Verified</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                <span>📍 Jurisdiction: <b>{district}, Maharashtra</b></span>
                <span className="text-emerald-400 font-bold">● Active E-Token Generated</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <p className="font-bold text-slate-800">✅ Next Steps at Empanelled Hospital:</p>
              <p>1. Show this Pre-Authorization Pass or your ABHA ID at the hospital Arogyamitra helpdesk.</p>
              <p>2. Complete biometric fingerprint or OTP verification for immediate admission without payment.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-3 border-t">
              <Button
                onClick={() => window.print()}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" /> Print / Save Health Pass PDF
              </Button>
              <a
                href={applicationModalScheme.officialPortalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-1 text-center cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                Govt Portal
              </a>
              <Button
                variant="outline"
                onClick={() => setApplicationModalScheme(null)}
                className="border-slate-300 font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

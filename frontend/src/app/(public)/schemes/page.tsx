"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
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
  Activity
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export default function SchemesPage() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const schemes = [
    {
      id: 'mjpjay',
      name: language === 'mr' ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY)' : language === 'hi' ? 'महात्मा ज्योतिराव फुले जन आरोग्य योजना (MJPJAY)' : 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
      coverage: '₹5,00,000 / Year / Family',
      authority: 'Government of Maharashtra',
      category: 'universal',
      desc: language === 'mr' 
        ? 'महाराष्ट्रातील सर्व शिधापत्रिकाधारकांना ९९६ हून अधिक गंभीर व शस्त्रक्रिया उपचारांसाठी मोफत कॅशलेस आरोग्य संरक्षण.'
        : language === 'hi'
        ? 'महाराष्ट्र के सभी राशन कार्ड धारकों को 996 से अधिक गंभीर और सर्जिकल उपचारों के लिए मुफ्त कैशलेस स्वास्थ्य सुरक्षा।'
        : 'Universal cashless medical coverage for over 996 secondary & tertiary procedures across all empanelled hospitals in Maharashtra.',
      eligibility: language === 'mr' ? 'पिवळे/केशरी/पांढरे शिधापत्रिकाधारक कुटुंब' : language === 'hi' ? 'पीले/नारंगी/सफेद राशन कार्ड धारक परिवार' : 'Valid Maharashtra Ration Card Holders',
      procedures: '996+ Surgeries & Therapies',
      empanelledHospitals: '1,000+ Empanelled Hospitals'
    },
    {
      id: 'pmjay',
      name: language === 'mr' ? 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (AB-PMJAY)' : language === 'hi' ? 'आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना (AB-PMJAY)' : 'Ayushman Bharat - PM Jan Arogya Yojana (AB-PMJAY)',
      coverage: '₹5,00,000 / Year / Family',
      authority: 'National Health Authority (NHA) & GoM',
      category: 'universal',
      desc: language === 'mr'
        ? 'SECC डेटाबेसमधील पात्र कुटुंबांना देशभरातील सर्व सरकारी व खाजगी संलग्न रुग्णालयांमध्ये मोफत उपचारांची सुविधा.'
        : language === 'hi'
        ? 'SECC डेटाबेस के पात्र परिवारों को देश भर के सभी सरकारी और निजी पैनलबद्ध अस्पतालों में मुफ्त इलाज की सुविधा।'
        : 'Centrally sponsored health assurance scheme providing cashless inpatient care at empanelled public and private hospitals nationwide.',
      eligibility: language === 'mr' ? 'SECC 2011 पात्र नागरिक' : language === 'hi' ? 'SECC 2011 पात्र नागरिक' : 'SECC 2011 Deprivation Criteria',
      procedures: '1,949 Treatment Packages',
      empanelledHospitals: '27,000+ Hospitals Pan-India'
    },
    {
      id: 'jssk',
      name: language === 'mr' ? 'जननी शिशु सुरक्षा कार्यक्रम (JSSK)' : language === 'hi' ? 'जननी शिशु सुरक्षा कार्यक्रम (JSSK)' : 'Janani Shishu Suraksha Karyakram (JSSK)',
      coverage: '100% Free Mother & Child Care',
      authority: 'Public Health Department, Maharashtra',
      category: 'maternal',
      desc: language === 'mr'
        ? 'गर्भवती महिला आणि १ वर्षाखालील आजारी बालकांसाठी मोफत प्रसूती, सिझेरियन, औषधे, लॅब चाचण्या व मोफत रुग्णवाहिका प्रवास.'
        : language === 'hi'
        ? 'गर्भवती महिलाओं और 1 वर्ष से कम उम्र के बीमार शिशुओं के लिए मुफ्त प्रसव, सी-सेक्शन, दवाएं, लैब जांच और मुफ्त एम्बुलेंस सुविधा।'
        : 'Completely cashless delivery, C-section, free diagnostics, medicines, and free 108 transport for pregnant mothers and sick infants.',
      eligibility: language === 'mr' ? 'सर्व गर्भवती महिला व नवजात बालके' : language === 'hi' ? 'सभी गर्भवती महिलाएं एवं नवजात शिशु' : 'All Pregnant Mothers & Newborns',
      procedures: 'Institutional Deliveries, NICU & Pediatric Care',
      empanelledHospitals: 'All Govt Medical Colleges & PHCs'
    },
    {
      id: 'cmrf',
      name: language === 'mr' ? 'मुख्यमंत्री वैद्यकीय सहाय्यता निधी (CMRF Medical Assistance)' : language === 'hi' ? 'मुख्यमंत्री चिकित्सा सहायता कोष (CMRF)' : 'Chief Minister’s Medical Relief Fund (CMRF)',
      coverage: 'Up to ₹3,00,000 Financial Grant',
      authority: 'Chief Minister Office (CMO) Maharashtra',
      category: 'financial',
      desc: language === 'mr'
        ? 'हृदय शस्त्रक्रिया, कर्करोग, अवयव प्रत्यारोपण, आणि डायलिसिस यांसारख्या गंभीर आजारांसाठी थेट आर्थिक अनुदान.'
        : language === 'hi'
        ? 'हृदय सर्जरी, कैंसर, अंग प्रत्यारोपण, और डायलिसिस जैसी गंभीर बीमारियों के लिए सीधा वित्तीय अनुदान।'
        : 'Direct financial assistance for critical life-threatening illnesses such as bypass surgery, oncology, organ transplants, and dialysis.',
      eligibility: language === 'mr' ? 'कुटुंबाचे वार्षिक उत्पन्न ₹1.6 लाखांपेक्षा कमी' : language === 'hi' ? 'पारिवारिक वार्षिक आय ₹1.6 लाख से कम' : 'Annual Income Under ₹1.6 Lakhs',
      procedures: 'Organ Transplants, Pediatric Surgeries, Cancer',
      empanelledHospitals: 'Designated Specialty Hospitals'
    },
    {
      id: 'rbsk',
      name: language === 'mr' ? 'राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)' : language === 'hi' ? 'राष्ट्रीय बाल स्वास्थ्य कार्यक्रम (RBSK)' : 'Rashtriya Bal Swasthya Karyakram (RBSK)',
      coverage: 'Free Screening & Surgical Treatment',
      authority: 'National Health Mission (NHM) Maharashtra',
      category: 'maternal',
      desc: language === 'mr'
        ? '० ते १८ वयोगटातील बालकांमधील जन्मजात दोष, आजार, कमतरता आणि विकासात्मक विकारांचे मोफत निदान व उपचार.'
        : language === 'hi'
        ? '0 से 18 वर्ष के बच्चों में जन्मजात दोष, रोग, कमियों और विकास संबंधी विकारों की मुफ्त जांच और उपचार।'
        : 'Systematic screening and free medical/surgical interventions for 4Ds (Defects at birth, Diseases, Deficiencies, Developmental delays).',
      eligibility: language === 'mr' ? '० ते १८ वर्षे वयोगटातील सर्व मुले' : language === 'hi' ? '0 से 18 वर्ष के सभी बच्चे' : 'Children Aged 0 to 18 Years',
      procedures: 'Club Foot, Cleft Lip, Congenital Heart Defects',
      empanelledHospitals: 'District Early Intervention Centres (DEIC)'
    },
  ];

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApply = (schemeName: string) => {
    showToast(`📝 Initialized digital claim verification for ${schemeName} via ABHA ID (91-4829-1029-4821)!`);
  };

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
      <div className="bg-gradient-to-r from-amber-700 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> 
            {language === 'mr' ? 'महाराष्ट्र शासन आरोग्य योजना' : language === 'hi' ? 'महाराष्ट्र सरकार स्वास्थ्य योजनाएं' : 'Govt of Maharashtra Healthcare Assurances'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {language === 'mr' ? 'शासकीय आरोग्य योजना व कॅशलेस उपचार' : language === 'hi' ? 'सरकारी स्वास्थ्य योजनाएं एवं कैशलेस उपचार' : 'Public Healthcare Assurances & Cashless Benefits'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {language === 'mr' 
              ? 'महात्मा फुले जन आरोग्य योजना (MJPJAY), आयुष्यमान भारत (PM-JAY) आणि मोफत मातृ-बाल कल्याण योजनांचा लाभ घ्या.'
              : language === 'hi'
              ? 'महात्मा फुले जन आरोग्य योजना (MJPJAY), आयुष्मान भारत (PM-JAY) और मुफ्त मातृ-शिशु कल्याण योजनाओं का लाभ उठाएं।'
              : 'Empowering Maharashtra citizens with universal cashless treatment coverage, maternal welfare, and emergency medical grants.'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'mr' ? 'योजनेचे नाव किंवा आजार शोधा...' : language === 'hi' ? 'योजना का नाम या बीमारी खोजें...' : 'Search schemes, treatments or keywords...'}
            className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-200 text-slate-950 font-bold"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('all')}
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 ${selectedCategory === 'all' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            {language === 'mr' ? 'सर्व योजना' : language === 'hi' ? 'सभी योजनाएं' : 'All Schemes'}
          </Button>
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('universal')}
            variant={selectedCategory === 'universal' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 ${selectedCategory === 'universal' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            {language === 'mr' ? 'सार्वजनिक आरोग्य कवच' : language === 'hi' ? 'यूनिवर्सल हेल्थ कवर' : 'Universal (MJPJAY/PMJAY)'}
          </Button>
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('maternal')}
            variant={selectedCategory === 'maternal' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 ${selectedCategory === 'maternal' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            {language === 'mr' ? 'माता व बाल कल्याण' : language === 'hi' ? 'मातृ एवं शिशु कल्याण' : 'Maternal & Child'}
          </Button>
          <Button 
            size="sm"
            onClick={() => setSelectedCategory('financial')}
            variant={selectedCategory === 'financial' ? 'primary' : 'outline'}
            className={`font-bold text-xs shrink-0 ${selectedCategory === 'financial' ? 'bg-teal-600 text-white' : 'border-slate-300'}`}
          >
            {language === 'mr' ? 'मुख्यमंत्री मदत निधी' : language === 'hi' ? 'मुख्यमंत्री सहायता कोष' : 'CM Relief Fund'}
          </Button>
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="rounded-3xl border border-slate-200 bg-white hover:border-amber-500 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between">
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <Badge variant="success" className="mb-2 bg-amber-50 text-amber-800 border-amber-200">
                    {scheme.authority}
                  </Badge>
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug">{scheme.name}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{scheme.desc}</p>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">
                    {language === 'mr' ? 'कव्हरेज मर्यादा' : language === 'hi' ? 'कवरेज सीमा' : 'Coverage Limit'}
                  </span>
                  <span className="font-extrabold text-emerald-700">{scheme.coverage}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">
                    {language === 'mr' ? 'पात्रता' : language === 'hi' ? 'पात्रता' : 'Eligibility'}
                  </span>
                  <span className="font-bold text-slate-900">{scheme.eligibility}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>🩺 {scheme.procedures}</span>
                <span>🏥 {scheme.empanelledHospitals}</span>
              </div>
            </CardContent>

            <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button 
                size="sm"
                onClick={() => handleApply(scheme.name)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {language === 'mr' ? 'पात्रता तपासा व लाभ घ्या' : language === 'hi' ? 'पात्रता जांचें एवं लाभ लें' : 'Check ABHA Eligibility'}
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => showToast(`📄 Opening scheme guidelines for ${scheme.name}...`)}
                className="border-slate-300 text-xs font-bold rounded-xl"
              >
                {language === 'mr' ? 'नियम व अटी' : language === 'hi' ? 'नियम व शर्तें' : 'Guidelines'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

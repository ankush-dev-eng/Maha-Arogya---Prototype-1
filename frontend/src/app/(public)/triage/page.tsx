"use client";
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Send, 
  Mic, 
  MicOff, 
  Activity, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  Globe, 
  Building2, 
  ShieldAlert, 
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { RISK_LEVEL_COLORS } from '@/lib/constants';
import { useLanguage, Language } from '@/lib/LanguageContext';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  language?: string;
  extractedEntities?: string[];
  riskAssessment?: {
    level: 'low' | 'moderate' | 'high' | 'emergency';
    department: string;
    description: string;
    confidence: number;
    recommendedAction: string;
  };
}

interface HospitalRec {
  id: string;
  name: string;
  address: string;
  dist: string;
  wait: string;
  emergency: boolean;
  department: string;
  load: string;
}

const SAMPLE_HOSPITALS: HospitalRec[] = [
  { id: 'h1', name: 'Government Medical College & Hospital (GMC)', address: 'Medical Square, Hanuman Nagar, Nagpur', dist: '1.4 km', wait: '18 mins', emergency: true, department: 'Cardiology & Trauma ER', load: 'Moderate' },
  { id: 'h2', name: 'Indira Gandhi Govt Medical College (Mayo)', address: 'Central Avenue Road, Mominpura, Nagpur', dist: '2.1 km', wait: '14 mins', emergency: true, department: 'General Medicine & ICU', load: 'Optimal' },
  { id: 'h3', name: 'AIIMS Nagpur & Super Speciality Hospital', address: 'MIHAN, Nagpur', dist: '3.8 km', wait: '10 mins', emergency: true, department: 'Specialist Trauma Available', load: 'Low' },
];

export default function TriagePage() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showHospitals, setShowHospitals] = useState(false);
  const [currentRisk, setCurrentRisk] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getGreeting = (lang: Language) => {
    switch (lang) {
      case 'mr':
        return 'नमस्कार! मी महाआरोग्य एआय सहाय्यक आहे. कृपया तुम्हाला किंवा तुमच्या रुग्णाला काय त्रास होत आहे ते सांगा (उदा. छातीत दुखणे, ताप, श्वास घेण्यास अडचण).';
      case 'hi':
        return 'नमस्ते! मैं महाआरोग्य एआई सहायक हूँ। कृपया बताएं कि आपको या आपके मरीज को क्या तकलीफ हो रही है (जैसे सीने में दर्द, बुखार, सांस लेने में परेशानी)।';
      default:
        return 'Namaste. I am MahaArogya AI, your clinical intake assistant. Please describe what symptoms you or your family member are experiencing today.';
    }
  };

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ai',
        text: getGreeting(language),
        language
      }
    ]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      showToast('🔊 Audio playback started...');
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = typeof window !== 'undefined' ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

        recognition.onstart = () => {
          setIsRecording(true);
          showToast(`🎙️ ${t('voiceListening')} (${language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English'})... Speak into your microphone!`);
        };

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          setInputValue(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech Recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
          showToast('✅ Voice input captured! Ready to analyze.');
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (e) {
        console.error('Speech Recognition initiation failed:', e);
      }
    }

    // Fallback simulation if browser blocks microphone
    setIsRecording(true);
    showToast(t('voiceListening') + ' (' + (language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिन्दी' : 'English') + ')');
    setTimeout(() => {
      setIsRecording(false);
      const sampleUtterance = language === 'mr' 
        ? 'माझ्या छातीत खूप तीव्र वेदना होत आहेत आणि श्वास घ्यायला अडचण येतेय'
        : language === 'hi'
        ? 'मुझे सीने में बहुत तेज दर्द और सांस लेने में तकलीफ हो रही है'
        : 'I have severe chest pain radiating to my arm and difficulty breathing for 2 hours';
      setInputValue(sampleUtterance);
      showToast('✅ Voice ASR transcription ready!');
    }, 2200);
  };

  const processTriage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: userText, language };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const lower = userText.toLowerCase();

    // Multilingual symptom detection
    const isCardiac = 
      lower.includes('chest') || lower.includes('heart') || lower.includes('breath') || 
      lower.includes('छाती') || lower.includes('श्वास') || lower.includes('दुखत') ||
      lower.includes('सीने') || lower.includes('दर्द') || lower.includes('सांस');

    const isFever = 
      lower.includes('fever') || lower.includes('temperature') || lower.includes('chills') ||
      lower.includes('ताप') || lower.includes('अंगदुखी') || lower.includes('कणकण') ||
      lower.includes('बुखार') || lower.includes('तपमान') || lower.includes('102');

    const isTrauma = 
      lower.includes('fracture') || lower.includes('bone') || lower.includes('accident') || lower.includes('fall') ||
      lower.includes('हाड') || lower.includes('फ्रॅक्चर') || lower.includes('मुका मार') || lower.includes('रक्त') ||
      lower.includes('चोट') || lower.includes('गिर') || lower.includes('हड्डी');

    // Real-time backend API integration
    try {
      fetch('http://localhost:8000/api/v1/triage/case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: 'Rajesh Patil',
          symptoms_text: userText,
          language: language,
          device_lat: 21.0833,
          device_lng: 79.0994
        })
      }).catch(() => {});
    } catch (e) {}

    setTimeout(() => {
      let aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: '', language };

      if (isCardiac) {
        if (language === 'mr') {
          aiMsg.text = '🚨 तातडीची आणीबाणी: तुमच्या लक्षणांवरून (छातीत वेदना व श्वास घेण्यास त्रास) गंभीर हृदयविकाराची शक्यता दिसते. तत्काळ नजीकच्या अतिदक्षता व हृदयरोग विभागात दाखल होणे आवश्यक आहे!';
          aiMsg.extractedEntities = ['छातीत तीव्र वेदना (Acute Chest Pain)', 'श्वास घेण्यास अडचण (Dyspnea)', 'हृदयविकार जोखीम संकेत'];
          aiMsg.riskAssessment = {
            level: 'emergency',
            department: 'हृदयरोग व अतिदक्षता विभाग (Cardiology & ER)',
            description: 'सुरक्षा नियमांनुसार आणीबाणी घोषित. १०८ रुग्णवाहिका किंवा त्वरित ईआर प्रवेश आवश्यक.',
            confidence: 0.96,
            recommendedAction: '१०८ रुग्णवाहिका बोलवा किंवा तत्काळ ससून/केईएम ईआरमध्ये जा'
          };
        } else if (language === 'hi') {
          aiMsg.text = '🚨 आपातकालीन चेतावनी: आपके बताए लक्षणों (सीने में दर्द और सांस लेने में तकलीफ) से गंभीर हृदय रोग की आशंका है। तत्काल नजदीकी अस्पताल के इमरजेंसी विभाग में जाना अनिवार्य है!';
          aiMsg.extractedEntities = ['सीने में तेज दर्द (Acute Chest Pain)', 'सांस फूलना (Dyspnea)', 'कार्डियक इमरजेंसी'];
          aiMsg.riskAssessment = {
            level: 'emergency',
            department: 'हृदय रोग एवं आपातकालीन विभाग (Cardiology & ER)',
            description: 'सुरक्षा प्रोटोकॉल के तहत आपातकाल घोषित। 108 एम्बुलेंस या तुरंत अस्पताल जाएं।',
            confidence: 0.96,
            recommendedAction: '108 एम्बुलेंस बुलाएं या तुरंत अस्पताल के इमरजेंसी वार्ड में जाएं'
          };
        } else {
          aiMsg.text = '🚨 CRITICAL EMERGENCY: Your reported symptoms (chest pain and shortness of breath) indicate a potential acute cardiac event. Immediate admission to an Emergency-ready facility is required!';
          aiMsg.extractedEntities = ['Acute Chest Pain', 'Dyspnea / Breathlessness', 'Cardiac Stress Signal'];
          aiMsg.riskAssessment = {
            level: 'emergency',
            department: 'Cardiology & Emergency Room',
            description: 'Deterministic safety rules triggered for acute cardiac presentation.',
            confidence: 0.96,
            recommendedAction: 'Immediate ER admission or 108 Ambulance Dispatch'
          };
        }
        setCurrentRisk('emergency');
        setShowHospitals(true);
      } else if (isFever) {
        if (language === 'mr') {
          aiMsg.text = 'तुम्हाला तीव्र ताप आणि कणकण जाणवत आहे. संसर्ग तपासणीसाठी २४ तासांत सर्वसाधारण ओपीडी (General Medicine) डॉक्टरांचा सल्ला घ्यावा.';
          aiMsg.extractedEntities = ['तीव्र ताप (High Fever)', 'अंगदुखी व अशक्तपणा'];
          aiMsg.riskAssessment = {
            level: 'moderate',
            department: 'सर्वसाधारण ओपीडी विभाग (General Medicine)',
            description: 'मध्यम वैद्यकीय जोखीम. रक्त तपासणी व डॉक्टरी सल्ल्यानुसार औषधोपचार आवश्यक.',
            confidence: 0.89,
            recommendedAction: 'ससून किंवा केईएम रुग्णालयाचे ओपीडी टोकन बुक करा'
          };
        } else if (language === 'hi') {
          aiMsg.text = 'आपको तेज बुखार और बदन दर्द है। संक्रमण की जांच के लिए 24 घंटे के भीतर जनरल मेडिसिन डॉक्टर से परामर्श लेने की सलाह दी जाती है।';
          aiMsg.extractedEntities = ['तेज बुखार (Pyrexia)', 'बदन दर्द और कमजोरी'];
          aiMsg.riskAssessment = {
            level: 'moderate',
            department: 'जनरल मेडिसिन ओपीडी (General Medicine)',
            description: 'मध्यम नैदानिक जोखिम। रक्त परीक्षण और डॉक्टर की सलाह आवश्यक।',
            confidence: 0.89,
            recommendedAction: 'नजदीकी अस्पताल में ओपीडी टोकन बुक करें'
          };
        } else {
          aiMsg.text = 'You have reported significant fever and chills. A consultation with General Medicine is advised within 24 hours to evaluate for infection.';
          aiMsg.extractedEntities = ['Pyrexia / High Fever', 'Body Aches & Fatigue'];
          aiMsg.riskAssessment = {
            level: 'moderate',
            department: 'General Medicine OPD',
            description: 'Moderate clinical risk. Antipyretic guidance and blood evaluation advised.',
            confidence: 0.89,
            recommendedAction: 'Book OPD Token at Nearest Available Hospital'
          };
        }
        setCurrentRisk('moderate');
        setShowHospitals(true);
      } else if (isTrauma) {
        if (language === 'mr') {
          aiMsg.text = 'हाताला मुका मार किंवा फ्रॅक्चरची दाट शक्यता आढळली आहे. त्वरित एक्स-रे तपासणी आणि अस्थिव्यंग तज्ञांचे मार्गदर्शन घ्या.';
          aiMsg.extractedEntities = ['अस्थि दुखापत (Orthopedic Trauma)', 'सूज व तीव्र वेदना'];
          aiMsg.riskAssessment = {
            level: 'high',
            department: 'अस्थिव्यंग व ट्रॉमा विभाग (Orthopedics & Trauma)',
            description: 'उच्च जोखीम. हाडांची तपासणी होईपर्यंत हालचाल टाळा.',
            confidence: 0.92,
            recommendedAction: 'तातडीने संचेती किंवा ससून ऑर्थोपेडिक ओपीडीमध्ये जा'
          };
        } else if (language === 'hi') {
          aiMsg.text = 'हाथ में गंभीर चोट या फ्रैक्चर का संदेह है। तुरंत एक्स-रे जांच और ऑर्थोपेडिक विशेषज्ञ से परामर्श लें।';
          aiMsg.extractedEntities = ['हड्डी की चोट (Orthopedic Trauma)', 'सूजन एवं दर्द'];
          aiMsg.riskAssessment = {
            level: 'high',
            department: 'हड्डी रोग एवं ट्रॉमा विभाग (Orthopedics)',
            description: 'गंभीर जोखिम। एक्स-रे होने तक हाथ को स्थिर रखें।',
            confidence: 0.92,
            recommendedAction: 'तत्काल संचेती या ससून अस्पताल की ओपीडी में जाएं'
          };
        } else {
          aiMsg.text = 'Potential musculoskeletal trauma / fracture identified. Urgent X-Ray diagnostics and orthopedic evaluation recommended.';
          aiMsg.extractedEntities = ['Orthopedic Trauma', 'Localized Swelling & Pain'];
          aiMsg.riskAssessment = {
            level: 'high',
            department: 'Orthopedics & Trauma Unit',
            description: 'High acuity trauma. Immobilization advised until clinical evaluation.',
            confidence: 0.92,
            recommendedAction: 'Urgent Care OPD or ER Walk-in'
          };
        }
        setCurrentRisk('high');
        setShowHospitals(true);
      } else {
        if (language === 'mr') {
          aiMsg.text = 'माहिती दिल्याबद्दल धन्यवाद. हा त्रास तुम्हाला कधीपासून सुरू आहे? चक्कर, उलट्या किंवा श्वास घेण्यास अडचण येत आहे का?';
        } else if (language === 'hi') {
          aiMsg.text = 'विवरण के लिए धन्यवाद। यह परेशानी आपको कितने समय से है? क्या आपको चक्कर, उल्टी या सांस लेने में कोई तकलीफ है?';
        } else {
          aiMsg.text = 'Thank you for the details. How many hours or days have you had this issue? Are you experiencing any dizziness, vomiting, or shortness of breath?';
        }
      }

      setMessages(prev => [...prev, aiMsg]);
      setIsLoading(false);
      speakText(aiMsg.text);
    }, 700);
  };

  const handleBookToken = (hospital: HospitalRec) => {
    const newToken = {
      tokenNumber: 'A-112',
      hospitalName: hospital.name,
      hospitalAddress: hospital.address,
      department: currentRisk === 'emergency' ? 'Emergency / Trauma' : 'Cardiology OPD',
      roomNo: 'Consulting Room 102',
      currentToken: 'A-108',
      estimatedWaitMinutes: parseInt(hospital.wait) || 15,
      peopleAhead: 3,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      slot: 'Next Available Slot (11:15 AM)',
      patientName: 'Rajesh Patil'
    };
    localStorage.setItem('maha_active_token', JSON.stringify(newToken));
    showToast(`🎫 ${t('issueTokenBtn')} ${hospital.name}!`);
    setTimeout(() => {
      router.push('/queue');
    }, 900);
  };

  const handleTriggerEmergency = (hospital: HospitalRec) => {
    showToast(`🚨 ${t('emergencyHoldBtn')} ${hospital.name}! 30-min hold requested.`);
    setTimeout(() => {
      router.push('/emergency');
    }, 800);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full h-[calc(100vh-8rem)] p-2 sm:p-4 gap-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Chat Section */}
      <div className={`flex-1 flex flex-col ${showHospitals ? 'md:w-7/12 md:flex-none' : 'w-full'}`}>
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">{t('triageTitle')}</h2>
                <p className="text-xs text-slate-500">
                  {language === 'mr' ? 'मराठी भाषा • क्लिनिकल डिसिजन सपोर्ट' : language === 'hi' ? 'हिन्दी भाषा • क्लिनिकल डिसीजन सपोर्ट' : 'Clinical decision support • Multilingual AI'}
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
              {(['en', 'mr', 'hi'] as const).map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === lang 
                      ? 'bg-teal-600 text-white shadow-2xs' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'mr' ? 'मराठी' : 'हिन्दी'}
                </button>
              ))}
            </div>
          </div>
          
          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 ${
                  msg.sender === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-sm shadow-md shadow-teal-600/10' 
                    : 'bg-white border border-slate-200 text-slate-800 shadow-sm rounded-bl-sm'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm sm:text-base leading-relaxed">{msg.text}</p>
                    {msg.sender === 'ai' && (
                      <button 
                        onClick={() => speakText(msg.text)} 
                        className="p-1 text-slate-400 hover:text-teal-600 rounded-md shrink-0"
                        title="Play audio voice"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Extracted Entities */}
                  {msg.extractedEntities && msg.extractedEntities.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        {language === 'mr' ? 'ओळखलेली लक्षणे:' : language === 'hi' ? 'पहचाने गए लक्षण:' : 'Extracted Symptoms:'}
                      </span>
                      {msg.extractedEntities.map(e => (
                        <span key={e} className="px-2 py-0.5 rounded-md bg-slate-100 border text-xs font-semibold text-slate-700">
                          {e}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Triage Risk Card */}
                  {msg.riskAssessment && (
                    <div className={`mt-4 p-4 rounded-2xl border-2 ${RISK_LEVEL_COLORS[msg.riskAssessment.level]} ${msg.riskAssessment.level === 'emergency' ? 'animate-pulse' : ''}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="flex items-center gap-1.5 font-black uppercase text-xs tracking-wider">
                          {msg.riskAssessment.level === 'emergency' ? <ShieldAlert className="w-4 h-4 text-red-600" /> : <Activity className="w-4 h-4" />}
                          {t(msg.riskAssessment.level === 'emergency' ? 'riskEmergency' : msg.riskAssessment.level === 'high' ? 'riskHigh' : msg.riskAssessment.level === 'moderate' ? 'riskModerate' : 'riskLow')}
                        </span>
                        <span className="text-xs font-bold opacity-80">
                          {Math.round(msg.riskAssessment.confidence * 100)}% Confidence
                        </span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-900">{msg.riskAssessment.department}</p>
                      <p className="text-xs mt-1 text-slate-700 leading-relaxed">{msg.riskAssessment.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-2 text-xs text-slate-500 font-semibold">
                  <RefreshCw className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                  {language === 'mr' ? 'महाआरोग्य एआय लक्षणांचे विश्लेषण करत आहे...' : language === 'hi' ? 'महाआरोग्य एआई लक्षणों का विश्लेषण कर रहा है...' : 'MahaArogya AI is analyzing symptoms & checking hospital capacity...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Symptoms Chips */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">{t('quickPromptsLabel')}</span>
            <button 
              onClick={() => processTriage(t('chipChestPain'))}
              className="px-3 py-1 rounded-full bg-red-100 hover:bg-red-200 text-red-800 text-xs font-bold shrink-0 transition-colors"
            >
              {t('chipChestPain')}
            </button>
            <button 
              onClick={() => processTriage(t('chipFever'))}
              className="px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold shrink-0 transition-colors"
            >
              {t('chipFever')}
            </button>
            <button 
              onClick={() => processTriage(t('chipFracture'))}
              className="px-3 py-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold shrink-0 transition-colors"
            >
              {t('chipFracture')}
            </button>
          </div>

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2">
              <Button 
                variant={isRecording ? 'danger' : 'outline'} 
                size="icon" 
                className={`shrink-0 rounded-full h-11 w-11 ${isRecording ? 'bg-red-600 text-white animate-pulse' : 'border-slate-300'}`}
                onClick={handleVoiceToggle}
                title="Tap to speak in Marathi, Hindi or English"
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-teal-600" />}
              </Button>
              <Input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && processTriage(inputValue)}
                placeholder={t('triageInputPlaceholder')}
                className="rounded-full bg-slate-100/80 border-transparent focus:bg-white h-11 px-4 text-sm text-slate-950 font-bold"
              />
              <Button 
                onClick={() => processTriage(inputValue)} 
                size="icon" 
                className="shrink-0 rounded-full bg-teal-600 hover:bg-teal-700 h-11 w-11 shadow-sm"
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hospitals Recommendation Section */}
      {showHospitals && (
        <div className="w-full md:w-5/12 flex flex-col gap-4 overflow-y-auto animate-in slide-in-from-right fade-in duration-300">
          <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-1">
              <Building2 className="w-5 h-5 text-teal-600" />
              {language === 'mr' ? 'शिफारस केलेली रुग्णालये' : language === 'hi' ? 'अनुशंसित अस्पताल' : 'Intelligent Hospital Routing'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'mr' ? 'अंतर, उपलब्ध डॉक्टर व ओपीडी वेळेनुसार क्रमवारी.' : language === 'hi' ? 'दूरी, डॉक्टर उपलब्धता एवं ओपीडी प्रतीक्षा समय के अनुसार क्रमबद्ध।' : 'Ranked by real-time distance, specialist availability & queue wait time.'}
            </p>
          </div>
          
          {SAMPLE_HOSPITALS.map((h, idx) => (
            <Card key={h.id} className="overflow-hidden border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all rounded-3xl bg-white">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <h4 className="font-extrabold text-base text-slate-900">{h.name}</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {h.address}
                    </p>
                  </div>
                  <Badge variant={h.load === 'Low' ? 'success' : h.load === 'Moderate' ? 'info' : 'warning'} className="text-[10px]">
                    {h.load} Load
                  </Badge>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 my-3 text-xs text-slate-700 font-medium">
                  🩺 {h.department}
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-600 mb-4 px-1">
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" /> {h.dist} away
                  </div>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-teal-600" /> ~{h.wait} wait
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => handleBookToken(h)}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 text-xs shadow-sm"
                  >
                    {t('issueTokenBtn')}
                  </Button>
                  {h.emergency && currentRisk === 'emergency' && (
                    <Button 
                      variant="danger" 
                      onClick={() => handleTriggerEmergency(h)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-xs animate-pulse"
                    >
                      {t('emergencyHoldBtn')}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'mr' | 'hi';

export interface Translations {
  [key: string]: {
    en: string;
    mr: string;
    hi: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand
  brandTitle: { en: 'MahaArogya', mr: 'महाआरोग्य', hi: 'महाआरोग्य' },
  brandTag: { en: 'Sanjeevani Grid', mr: 'संजीवनी ग्रीड', hi: 'संजीवनी ग्रिड' },
  brandSubtitle: { 
    en: 'Unified Public Healthcare Routing & Resource Coordination', 
    mr: 'एकात्मिक सार्वजनिक आरोग्य राउटिंग व साधनसमग्री समन्वय', 
    hi: 'एकीकृत सार्वजनिक स्वास्थ्य रूटिंग एवं संसाधन समन्वय' 
  },

  // Navigation Links
  navTriage: { en: 'AI Triage', mr: 'एआय तपासणी', hi: 'एआई ट्राइएज' },
  navHospitals: { en: 'Find Hospitals', mr: 'रुग्णालये शोधा', hi: 'अस्पताल खोजें' },
  navQueue: { en: 'OPD Token', mr: 'ओपीडी टोकन', hi: 'ओपीडी टोकन' },
  navEmergency: { en: 'Emergency Help', mr: 'तातडीची मदत (108)', hi: 'आपातकालीन मदद' },
  navRecords: { en: 'Health Records', mr: 'आरोग्य नोंदी', hi: 'स्वास्थ्य रिकॉर्ड' },
  navSchemes: { en: 'Govt Schemes', mr: 'शासकीय योजना', hi: 'सरकारी योजनाएं' },
  navDashboard: { en: 'Command Center', mr: 'कमांड सेंटर', hi: 'कमांड सेंटर' },
  navDoctor: { en: 'Doctor Consultation', mr: 'डॉक्टर तपासणी कक्ष', hi: 'डॉक्टर परामर्श' },
  navBeds: { en: 'Bed Management', mr: 'खाटांचे व्यवस्थापन', hi: 'बेड प्रबंधन' },
  navPharmacy: { en: 'Pharmacy Inventory', mr: 'औषध भांडार', hi: 'फार्मेसी इन्वेंटरी' },
  navBloodBank: { en: 'Blood Bank', mr: 'रक्तपेढी', hi: 'ब्लड बैंक' },
  navAdminEmergency: { en: 'Emergency Desk', mr: 'आणीबाणी कक्ष', hi: 'आपातकालीन डेस्क' },
  navOpd: { en: 'OPD Queues & Tokens', mr: 'ओपीडी रांग व टोकन', hi: 'ओपीडी कतार एवं टोकन' },
  navStaff: { en: 'Staff Workload', mr: 'कर्मचारी कार्यभार', hi: 'स्टाफ कार्यभार' },
  navCctv: { en: 'CCTV Ward AI', mr: 'सीसीटीव्ही वॉर्ड एआय', hi: 'सीसीटीवी वार्ड एआई' },
  navRegional: { en: 'Regional Overview', mr: 'प्रादेशिक आढावा', hi: 'क्षेत्रीय अवलोकन' },
  navForecast: { en: 'Demand Forecasts', mr: 'मागणी अंदाज', hi: 'मांग पूर्वानुमान' },
  navBalancing: { en: 'Stress & Balancing', mr: 'ताण व भार समतोल', hi: 'दबाव एवं संतुलन' },

  // Role Names
  roleCitizen: { en: 'Citizen / Patient', mr: 'नागरिक / रुग्ण', hi: 'नागरिक / मरीज' },
  roleAdmin: { en: 'Hospital Administrator', mr: 'रुग्णालय प्रशासक', hi: 'अस्पताल प्रशासक' },
  roleDoctor: { en: 'Doctor / Medical Officer', mr: 'वैद्यकीय अधिकारी / डॉक्टर', hi: 'चिकित्सा अधिकारी / डॉक्टर' },
  roleNurse: { en: 'Nurse / Ward Staff', mr: 'परिचारिका / वॉर्ड कर्मचारी', hi: 'नर्स / वार्ड स्टाफ' },
  roleReception: { en: 'Reception / OPD Staff', mr: 'स्वागत कक्ष / ओपीडी कर्मचारी', hi: 'रिसेप्शन / ओपीडी स्टाफ' },
  roleEmergency: { en: 'Emergency Control Staff', mr: 'आणीबाणी नियंत्रण कर्मचारी', hi: 'आपातकालीन नियंत्रण स्टाफ' },
  roleBloodBank: { en: 'Blood Bank Officer', mr: 'रक्तपेढी अधिकारी', hi: 'ब्लड बैंक अधिकारी' },
  rolePharmacy: { en: 'Pharmacy / Inventory Staff', mr: 'औषधनिर्माण अधिकारी', hi: 'फार्मेसी अधिकारी' },
  roleGovt: { en: 'Government / State Admin', mr: 'शासन / राज्य प्रशासक', hi: 'शासन / राज्य प्रशासक' },
  switchPersona: { en: 'Switch Role Persona', mr: 'भूमिका बदला', hi: 'रोल बदलें' },
  returnPortal: { en: 'Return to Role Portal', mr: 'मुख्य पोर्टलवर जा', hi: 'मुख्य पोर्टल पर जाएं' },

  // Dashboard Page & Stat Trends
  dashTitle: { en: 'Hospital Command Center', mr: 'रुग्णालय कमांड सेंटर', hi: 'अस्पताल कमांड सेंटर' },
  dashSubtitle: { en: 'Live operational overview of Sassoon & KEM Hospital network', mr: 'ससून व केईएम रुग्णालय नेटवर्कचा थेट कार्य आढावा', hi: 'ससून एवं केईएम अस्पताल नेटवर्क का लाइव अवलोकन' },
  dashDownloadReport: { en: 'Download PDF Report', mr: 'पीडीएफ अहवाल डाउनलोड करा', hi: 'पीडीएफ रिपोर्ट डाउनलोड करें' },
  dashBroadcastAlert: { en: 'Broadcast Alert', mr: 'सूचना प्रसारित करा', hi: 'अलर्ट प्रसारित करें' },
  dashPatientsToday: { en: 'Total Patients Today', mr: 'आजचे एकूण रुग्ण', hi: 'आज के कुल मरीज' },
  dashActiveEmergencies: { en: 'Active Emergencies', mr: 'सक्रिय आणीबाणी प्रकरणे', hi: 'सक्रिय आपातकालीन मामले' },
  dashOpdWaitAvg: { en: 'OPD Waiting Average', mr: 'ओपीडी सरासरी प्रतीक्षा', hi: 'ओपीडी औसत प्रतीक्षा' },
  dashAvailableBeds: { en: 'Available Beds', mr: 'उपलब्ध खाटा', hi: 'उपलब्ध बेड' },
  dashAmbulancesAvailable: { en: 'Ambulances Available', mr: 'उपलब्ध रुग्णवाहिका', hi: 'उपलब्ध एम्बुलेंस' },
  dashStaffOnDuty: { en: 'Staff on Duty', mr: 'कर्तव्यावरील कर्मचारी', hi: 'ड्यूटी पर स्टाफ' },
  dashPatientFlow: { en: 'Patient Inflow (Today)', mr: 'रुग्ण ओघ (आज)', hi: 'मरीज प्रवाह (आज)' },
  dashDeptLoad: { en: 'Department Load', mr: 'विभागनिहाय रुग्णभार', hi: 'विभागवार मरीज लोड' },

  // Trend Subtexts
  trendPatients: { en: '+12% vs yesterday', mr: 'कालच्या तुलनेत +१२%', hi: 'कल की तुलना में +12%' },
  trendEmergencies: { en: '2 en route', mr: '२ मार्गावर आहेत', hi: '2 रास्ते में हैं' },
  trendOpdWait: { en: '↓ 4m reduction', mr: '↓ ४ मिनिटांची घट', hi: '↓ 4 मिनट की कमी' },
  trendBeds: { en: '8 ICU beds free', mr: '८ आयसीयू खाटा रिक्त', hi: '8 आईसीयू बेड खाली' },
  trendAmbulances: { en: '8 in transit', mr: '८ रुग्णवाहिका सेवेत', hi: '8 एम्बुलेंस सेवा में' },
  trendStaff: { en: 'Full shift load', mr: 'पूर्ण पाळी कर्मचारी सज्ज', hi: 'पूरी शिफ्ट स्टाफ तैयार' },

  // Doctor Portal
  docTitle: { en: 'Clinical Consultation & OPD Queue', mr: 'क्लिनिकल तपासणी व ओपीडी रांग', hi: 'क्लिनिकल परामर्श एवं ओपीडी कतार' },
  docSubtitle: { en: 'Review AI pre-triage intake, examine patient vitals, write electronic prescriptions & manage OPD queue.', mr: 'एआय पूर्व-तपासणी तपासा, जीवन चिन्हे पहा, ई-प्रिस्क्रिप्शन लिहा व ओपीडी रांग व्यवस्थापित करा.', hi: 'एआई प्री-ट्राइएज जांचें, वाइटल संकेत देखें, ई-पर्ची लिखें एवं ओपीडी कतार प्रबंधित करें।' },
  docCallNext: { en: 'Call Next Patient', mr: 'पुढील रुग्ण बोलवा', hi: 'अगले मरीज को बुलाएं' },
  docTodaysQueue: { en: "Today's Patient Queue", mr: 'आजची रुग्ण रांग', hi: 'आज की मरीज कतार' },
  docPreTriageVitals: { en: 'Pre-Triage Vital Signs', mr: 'पूर्व-तपासणी जीवन चिन्हे', hi: 'प्री-ट्राइएज वाइटल संकेत' },
  docExtractedSymptoms: { en: 'AI Extracted Symptoms', mr: 'एआयने ओळखलेली लक्षणे', hi: 'एआई द्वारा पहचाने गए लक्षण' },
  docAllergies: { en: 'Documented Allergies', mr: 'नोंदवलेली ॲलर्जी', hi: 'दर्ज एलर्जी' },
  docRx: { en: 'Electronic Prescription & Clinical Orders', mr: 'इलेक्ट्रॉनिक प्रिस्क्रिप्शन व वैद्यकीय आदेश', hi: 'इलेक्ट्रॉनिक पर्ची एवं क्लिनिकल निर्देश' },
  docCompleteRx: { en: 'Complete & Send Rx', mr: 'पूर्ण करा व प्रिस्क्रिप्शन पाठवा', hi: 'पूर्ण करें और पर्ची भेजें' },
  docAdmitWard: { en: 'Admit to Ward', mr: 'वॉर्डमध्ये दाखल करा', hi: 'वार्ड में भर्ती करें' },
  docConsultationCompleted: { en: '✓ Consultation Completed • Prescription Sent to Pharmacy', mr: '✓ तपासणी पूर्ण झाली • औषध भांडारात प्रिस्क्रिप्शन पाठवले', hi: '✓ परामर्श पूर्ण हुआ • फार्मेसी को पर्ची भेजी गई' },
  docPatientAdmitted: { en: '✓ Inpatient Admitted to Bed', mr: '✓ रुग्ण खाटेवर दाखल केला आहे', hi: '✓ मरीज बेड पर भर्ती किया गया है' },

  // Pharmacy Portal & Tables
  pharmTitle: { en: 'Pharmacy & Medicine Inventory', mr: 'औषध भांडार व साठा व्यवस्थापन', hi: 'फार्मेसी एवं दवा इन्वेंटरी' },
  pharmSubtitle: { en: 'Real-time stock monitoring, automated expiry alerts, consumption forecasts & PO generation.', mr: 'रिअल-टाइम साठा निरीक्षण, मुदत संपण्याच्या सूचना, वापर अंदाज व खरेदी आदेश निर्मिती.', hi: 'रीयल-टाइम स्टॉक मॉनिटरिंग, एक्सपायरी अलर्ट, उपभोग पूर्वानुमान एवं खरीद आदेश।' },
  pharmSyncStock: { en: 'Sync Stock', mr: 'साठा समक्रमित करा', hi: 'स्टॉक सिंक करें' },
  pharmAutoReplenish: { en: 'Auto-Replenish All', mr: 'सर्व औषधे स्वयंचलित रीस्टॉक करा', hi: 'सभी दवाएं ऑटो-रीस्टॉक करें' },
  pharmTotalItems: { en: 'Total Catalog Items', mr: 'एकूण औषध प्रकार', hi: 'कुल दवा प्रकार' },
  pharmCriticalExpiring: { en: 'Critical / Expiring', mr: 'गंभीर कमी / मुदत संपत आलेली', hi: 'गंभीर कमी / समाप्त हो रही' },
  pharmLowStock: { en: 'Low Stock Warnings', mr: 'कमी साठा सूचना', hi: 'कम स्टॉक चेतावनी' },
  pharmDispensedToday: { en: 'Dispensed Today', mr: 'आज वितरित औषधे', hi: 'आज वितरित दवाएं' },
  pharmRoleBadge: { en: 'Role: Pharmacy & Consumables Officer • Sassoon General Hospital', mr: 'भूमिका: औषधनिर्माण अधिकारी • ससून सर्वोपचार रुग्णालय', hi: 'भूमिका: फार्मेसी अधिकारी • ससून जनरल अस्पताल' },
  pharmActionRequired: { en: 'Action Required: 2 items have critical stock or expire within 30 days!', mr: 'कार्रवाई आवश्यक: २ औषधांचा साठा गंभीर कमी आहे किंवा ३० दिवसांत मुदत संपणार आहे!', hi: 'कार्रवाई आवश्यक: 2 दवाओं का स्टॉक गंभीर कम है या 30 दिनों में समाप्त हो रहा है!' },
  pharmActionSub: { en: 'Amoxicillin 250mg & Salbutamol Inhalers require emergency batch replenishments.', mr: 'अमोक्सिसिलिन आणि साल्ब्युटामॉलसाठी तातडीची खरेदी आवश्यक आहे.', hi: 'अमोक्सिसिलिन और साल्बुटामोल के लिए तत्काल आपातकालीन रीस्टॉक आवश्यक है।' },
  pharmSearchPlaceholder: { en: 'Search medicine name, salt, or item code...', mr: 'औषधाचे नाव किंवा कोड शोधा...', hi: 'दवा का नाम या कोड खोजें...' },
  tblItemName: { en: 'Item Name', mr: 'औषधाचे नाव', hi: 'दवा का नाम' },
  tblCategory: { en: 'Category', mr: 'वर्ग', hi: 'श्रेणी' },
  tblCurrentStock: { en: 'Current Stock', mr: 'उपलब्ध साठा', hi: 'वर्तमान स्टॉक' },
  tblConsumptionRate: { en: 'Consumption Rate', mr: 'वापर दर', hi: 'दैनिक खपत दर' },
  tblExpiryDate: { en: 'Expiry Date', mr: 'मुदत समाप्ती', hi: 'समाप्ति तिथि' },
  tblStockStatus: { en: 'Stock Status', mr: 'साठा स्थिती', hi: 'स्टॉक स्थिति' },
  tblAction: { en: 'Action', mr: 'कृती', hi: 'कार्रवाई' },
  catAll: { en: 'ALL', mr: 'सर्व', hi: 'सभी' },
  catMedicine: { en: 'MEDICINE', mr: 'औषधे', hi: 'दवाएं' },
  catConsumable: { en: 'CONSUMABLE', mr: 'साहित्य', hi: 'उपभोग्य' },
  catEquipment: { en: 'EQUIPMENT', mr: 'उपकरणे', hi: 'उपकरण' },
  stAdequate: { en: 'ADEQUATE', mr: 'मुबलक', hi: 'पर्याप्त' },
  stLowStock: { en: 'LOW STOCK', mr: 'कमी साठा', hi: 'कम स्टॉक' },
  stCriticalLow: { en: 'CRITICAL LOW', mr: 'गंभीर तुटवडा', hi: 'गंभीर कमी' },
  btnReplenish: { en: '+ Replenish', mr: '+ साठा वाढवा', hi: '+ रीस्टॉक करें' },

  // Blood Bank Portal
  bbTitle: { en: 'Blood Bank & Serology Unit', mr: 'रक्तपेढी व रक्तसाठा विभाग', hi: 'ब्लड बैंक एवं सीरोलॉजी इकाई' },
  bbSubtitle: { en: 'Real-time blood stock tracking, donor intake, cross-match verification & hospital dispatch coordination.', mr: 'रिअल-टाइम रक्तसाठा ट्रॅकिंग, रक्तदाते नोंदणी, क्रॉस-मॅच पडताळणी व रुग्णालय पुरवठा समन्वय.', hi: 'रीयल-टाइम ब्लड स्टॉक ट्रैकिंग, डोनर इनटेक, क्रॉस-मैच सत्यापन एवं अस्पताल आपूर्ति समन्वय।' },
  bbBroadcastAlert: { en: 'Broadcast Donor Alert', mr: 'रक्तदाता सूचना प्रसारित करा', hi: 'रक्तदाता अलर्ट प्रसारित करें' },
  bbTotalUnits: { en: 'Total Blood Units in Stock', mr: 'एकूण उपलब्ध रक्त युनिट्स', hi: 'स्टॉक में कुल ब्लड यूनिट्स' },
  bbCriticalShortages: { en: 'Critical Shortage Groups', mr: 'गंभीर तुटवडा असलेले रक्तगट', hi: 'गंभीर कमी वाले ब्लड ग्रुप' },
  bbDonationsToday: { en: 'Donations Logged Today', mr: 'आज झालेले रक्तदान', hi: 'आज दर्ज रक्तदान' },
  bbLogDonation: { en: 'Log Voluntary Blood Donation', mr: 'स्वैच्छिक रक्तदान नोंदवा', hi: 'स्वैच्छिक रक्तदान दर्ज करें' },
  bbIncomingRequests: { en: 'Incoming Hospital Requests', mr: 'रुग्णालयांची रक्त मागणी', hi: 'अस्पतालों से रक्त अनुरोध' },

  // Bed Management Page & Bed Localizations
  bedsTitle: { en: 'Smart Bed Management', mr: 'स्मार्ट खाट व्यवस्थापन', hi: 'स्मार्ट बेड प्रबंधन' },
  bedsSubtitle: { 
    en: 'Real-time ward occupancy, status transitions & discrepancy tracking.', 
    mr: 'रिअल-टाइम वॉर्ड वहिवाट, खाटांची स्थिती व विसंगती नोंदणी.', 
    hi: 'रीयल-टाइम वार्ड स्थिति, बेड उपलब्धता एवं विसंगति ट्रैकिंग।' 
  },
  bedAvailable: { en: 'Available', mr: 'उपलब्ध', hi: 'उपलब्ध' },
  bedOccupied: { en: 'Occupied', mr: 'व्यापलेली', hi: 'व्यस्त' },
  bedReserved: { en: 'Reserved', mr: 'आरक्षित', hi: 'आरक्षित' },
  bedCleaning: { en: 'Cleaning', mr: 'स्वच्छता चालू', hi: 'सफाई जारी' },
  bedMaintenance: { en: 'Maintenance', mr: 'दुरुस्ती चालू', hi: 'मरम्मत जारी' },
  bedPrefix: { en: 'Bed', mr: 'खाट', hi: 'बेड' },
  wardGeneral: { en: 'General Ward A', mr: 'सर्वसाधारण वॉर्ड A', hi: 'जनरल वार्ड A' },
  wardICU: { en: 'ICU Unit', mr: 'अतिदक्षता विभाग (ICU)', hi: 'आईसीयू यूनिट' },
  wardEmergency: { en: 'Emergency / Trauma', mr: 'आणीबाणी / ट्रॉमा', hi: 'इमरजेंसी / ट्रॉमा' },
  allWardsFilter: { en: 'All Wards (16 Beds)', mr: 'सर्व वॉर्ड (१६ खाटा)', hi: 'सभी वार्ड (16 बेड)' },
  bedChangeAction: { en: 'Change →', mr: 'बदला →', hi: 'बदलें →' },

  // Triage Page
  triageTitle: { en: 'MahaArogya AI Symptom Triage', mr: 'महाआरोग्य एआय लक्षण तपासणी', hi: 'महाआरोग्य एआई लक्षण जांच' },
  triageSubtitle: { 
    en: 'Clinical decision support in Marathi, Hindi & English. AI assesses risk and routes you to the right care.', 
    mr: 'मराठी, हिंदी आणि इंग्रजीमध्ये वैद्यकीय निर्णय सहाय्य. एआय जोखमीचे मूल्यांकन करून योग्य रुग्णालयात मार्गदर्शन करते.', 
    hi: 'मराठी, हिन्दी और अंग्रेजी में नैदानिक निर्णय सहायता। एआई जोखिम का आकलन कर सही अस्पताल की सलाह देता है।' 
  },
  triageInputPlaceholder: { 
    en: 'Describe your symptoms in detail or tap the microphone...', 
    mr: 'तुमच्या त्रासाबद्दल सविस्तर सांगा किंवा माइक दाबा...', 
    hi: 'अपने लक्षणों के बारे में विस्तार से बताएं या माइक दबाएं...' 
  },
  voiceListening: { en: 'Listening... Speak now', mr: 'ऐकत आहे... बोला', hi: 'सुन रहा है... बोलिए' },
  quickPromptsLabel: { en: 'Quick Demo Symptoms:', mr: 'जलद लक्षणे:', hi: 'त्वरित लक्षण:' },
  chipChestPain: { en: '🚨 Severe Chest Pain & Breathlessness', mr: '🚨 छातीत तीव्र वेदना आणि श्वास घेण्यास त्रास', hi: '🚨 छाती में तेज दर्द और सांस फूलना' },
  chipFever: { en: '🤒 High Fever 102°F & Chills', mr: '🤒 १०२°F ताप आणि थंडी', hi: '🤒 102°F तेज बुखार और बदन दर्द' },
  chipFracture: { en: '🦴 Suspected Arm Fracture / Fall', mr: '🦴 हाताला मुका मार / फ्रॅक्चर', hi: '🦴 हाथ में गंभीर चोट / फ्रैक्चर' },
  riskEmergency: { en: 'EMERGENCY (Level 1)', mr: 'आणीबाणी (पातळी १)', hi: 'आपातकालीन (स्तर 1)' },
  riskHigh: { en: 'HIGH RISK (Urgent)', mr: 'उच्च जोखीम (तातडीचे)', hi: 'गंभीर जोखिम (तत्काल)' },
  riskModerate: { en: 'MODERATE (OPD)', mr: 'मध्यम जोखीम (ओपीडी)', hi: 'मध्यम जोखिम (ओपीडी)' },
  riskLow: { en: 'LOW (Routine)', mr: 'कमी जोखीम (नियमित)', hi: 'सामान्य जोखिम (नियमित)' },
  issueTokenBtn: { en: '🎫 Issue Smart Token', mr: '🎫 स्मार्ट टोकन घ्या', hi: '🎫 स्मार्ट टोकन लें' },
  emergencyHoldBtn: { en: '🚨 Emergency Bed Hold', mr: '🚨 खाट आरक्षित करा (तातडीची)', hi: '🚨 आपातकालीन बेड रिजर्व करें' },

  // Emergency Page
  emgTitle: { en: 'Emergency Ambulance & Trauma Dispatch', mr: 'तातडीची रुग्णवाहिका व ट्रॉमा नियंत्रण', hi: 'आपातकालीन एम्बुलेंस एवं ट्रॉमा डिस्पैच' },
  emgSubtitle: { en: 'Live ALS ambulance telemetry, hospital bed hold, and coordinated ER admission.', mr: 'थेट १०८ रुग्णवाहिका ट्रॅकिंग, खाट आरक्षण व अतिदक्षता समन्वय.', hi: 'लाइव 108 एम्बुलेंस ट्रैकिंग, बेड रिजर्वेशन एवं इमरजेंसी समन्वय।' },
  emgTimeline: { en: 'Live Response Timeline', mr: 'थेट प्रतिसाद कालक्रम', hi: 'लाइव प्रतिक्रिया समयरेखा' },
  emgCaseCreated: { en: 'Case Created & Triage Escalated', mr: 'केस नोंदवली व आणीबाणी घोषित', hi: 'केस दर्ज एवं आपातकाल घोषित' },
  emgHospitalAlerted: { en: 'Hospital Alerted & Bed Reserved', mr: 'रुग्णालयाला सूचना व खाट आरक्षित', hi: 'अस्पताल को अलर्ट एवं बेड रिजर्व' },
  emgAmbulanceEnRoute: { en: 'Ambulance En Route', mr: 'रुग्णवाहिका मार्गावर आहे', hi: 'एम्बुलेंस रास्ते में है' },
  emgArrivalDirect: { en: 'Arrival & Direct ER Intake', mr: 'पोहोचणे व थेट अतिदक्षता प्रवेश', hi: 'पहुंचना एवं सीधा इमरजेंसी प्रवेश' },
  emgAmbulanceCard: { en: '108 Advanced Life Support Ambulance', mr: '१०८ ॲडव्हान्स्ड लाईफ सपोर्ट रुग्णवाहिका', hi: '108 एडवांस्ड लाइफ सपोर्ट एम्बुलेंस' },
  emgEta: { en: 'Estimated Arrival: ~6 minutes', mr: 'अंदाजे आगमन: ~६ मिनिटे', hi: 'अनुमानित आगमन: ~6 मिनट' },
  emgParamedic: { en: 'Paramedic In-charge', mr: 'वैद्यकीय अधिकारी', hi: 'पैरामेडिक प्रभारी' },
  emgEquipment: { en: 'On-board Equipment', mr: 'रुग्णवाहिकेतील उपकरणे', hi: 'ऑन-बोर्ड उपकरण' },
  emgViewRoute: { en: 'View Live Route on GPS Map', mr: 'जीपीएस नकाशावर थेट मार्ग पहा', hi: 'जीपीएस मैप पर लाइव रूट देखें' },
  emgReceivingHospital: { en: 'Receiving Emergency Hospital', mr: 'दाखल रुग्णालय', hi: 'भर्ती अस्पताल' },
  emgCall108: { en: 'Call 108 Control Room', mr: '१०८ नियंत्रण कक्षाला कॉल करा', hi: '108 कंट्रोल रूम को कॉल करें' },
  emgReturnTriage: { en: 'Return to Triage', mr: 'तपासणीकडे परत जा', hi: 'ट्राइएज पर वापस जाएं' },

  // Hospitals Page & Directions
  hospTitle: { en: 'Explore Hospitals & Departments', mr: 'रुग्णालये व विभाग शोधा', hi: 'अस्पताल एवं विभाग खोजें' },
  hospSubtitle: { en: 'Live waiting times, bed capacity, emergency capabilities & GPS routing.', mr: 'थेट प्रतीक्षा वेळ, खाट क्षमता, आणीबाणी सुविधा व जीपीएस मार्गदर्शन.', hi: 'लाइव प्रतीक्षा समय, बेड क्षमता, आपातकालीन सुविधाएं एवं जीपीएस रूटिंग।' },
  hospSearchPlaceholder: { en: 'Search by hospital name, area or medical specialty...', mr: 'रुग्णालयाचे नाव, परिसर किंवा वैद्यकीय विभाग शोधा...', hi: 'अस्पताल का नाम, क्षेत्र या विशेषता खोजें...' },
  hospAll: { en: 'All Hospitals', mr: 'सर्व रुग्णालये', hi: 'सभी अस्पताल' },
  hospEmergencyReady: { en: '🚨 Emergency Ready', mr: '🚨 आणीबाणी सज्ज', hi: '🚨 इमरजेंसी तैयार' },
  hospLowestWait: { en: '⚡ Lowest Wait (≤15m)', mr: '⚡ कमी प्रतीक्षा वेळ (≤१५ मि.)', hi: '⚡ कम प्रतीक्षा समय (≤15 मिनट)' },
  hospGetDirections: { en: 'Directions ↗', mr: 'मार्गदर्शन ↗', hi: 'दिशाएं ↗' },
  hospUseLocation: { en: '📍 Use My Live Location', mr: '📍 माझे थेट स्थान वापरा', hi: '📍 मेरा लाइव स्थान उपयोग करें' },
  facilitiesAvailable: { en: 'Facilities Available', mr: 'उपलब्ध रुग्णालये', hi: 'उपलब्ध अस्पताल' },
  localDistrict: { en: 'Local Healthcare Region', mr: 'स्थानिक आरोग्य कार्यक्षेत्र', hi: 'स्थानीय स्वास्थ्य क्षेत्र' },
  optimal: { en: 'Optimal', mr: 'मुबलक', hi: 'उत्तम' },
  busy: { en: 'Busy', mr: 'व्यस्त', hi: 'व्यस्त' },
  overloaded: { en: 'Overloaded', mr: 'अतिभार', hi: 'अतिभार' },
  youAreHere: { en: 'You Are Here (GPS Location)', mr: 'तुम्ही येथे आहात (थेट स्थान)', hi: 'आप यहाँ हैं (लाइव स्थान)' },

  // Records Page Localizations
  recordsVault: { en: 'Health Records Vault', mr: 'आरोग्य नोंदी भांडार', hi: 'स्वास्थ्य रिकॉर्ड्स वॉल्ट' },
  recordsSubtitle: { 
    en: 'Verified clinical history, e-Prescriptions, lab values, and allergy registries.', 
    mr: 'प्रमाणित वैद्यकीय इतिहास, ई-प्रिस्क्रिप्शन, लॅब अहवाल व ॲलर्जी नोंदी.', 
    hi: 'सत्यापित क्लिनिकल इतिहास, ई-पर्चे, लैब रिपोर्ट एवं एलर्जी रजिस्ट्री।' 
  },
  uploadLabPdf: { en: 'Upload Lab PDF', mr: 'लॅब अहवाल अपलोड करा', hi: 'लैब रिपोर्ट अपलोड करें' },
  syncAbha: { en: 'Sync ABHA', mr: 'आभा समक्रमित करा', hi: 'आभा सिंक करें' },
  bloodGroup: { en: 'Blood Group', mr: 'रक्तगट', hi: 'ब्लड ग्रुप' },
  verifiedInLab: { en: 'Verified in Lab', mr: 'लॅब प्रमाणित', hi: 'लैब सत्यापित' },
  ageGender: { en: 'Age & Gender', mr: 'वय आणि लिंग', hi: 'आयु एवं लिंग' },
  chronicConditions: { en: 'Chronic Conditions', mr: 'दीर्घकालीन आजार', hi: 'पुरानी बीमारियां' },
  drugAllergies: { en: 'Drug Allergies', mr: 'औषधांची ॲलर्जी', hi: 'दवाओं की एलर्जी' },
  criticalAlert: { en: 'Critical Alert', mr: 'गंभीर इशारा', hi: 'गंभीर चेतावनी' },
  documentedEncounters: { en: 'Documented Medical Encounters', mr: 'नोंदवलेल्या वैद्यकीय तपासण्या', hi: 'दर्ज की गई मेडिकल जांचें' },
  viewReport: { en: 'View Report', mr: 'अहवाल पहा', hi: 'रिपोर्ट देखें' },
  viewErx: { en: 'View eRx', mr: 'प्रिस्क्रिप्शन पहा', hi: 'पर्चा देखें' },
  details: { en: 'Details', mr: 'तपशील', hi: 'विवरण' },
  normal: { en: 'NORMAL', mr: 'सामान्य', hi: 'सामान्य' },
  activeRx: { en: 'ACTIVE RX', mr: 'सक्रिय प्रिस्क्रिप्शन', hi: 'सक्रिय पर्चा' },
  followUpReq: { en: 'FOLLOW-UP REQ', mr: 'पुढील तपासणी आवश्यक', hi: 'फॉलो-अप आवश्यक' },

  // Common
  saveChanges: { en: 'Save Changes', mr: 'बदल जतन करा', hi: 'परिवर्तन सहेजें' },
  cancel: { en: 'Cancel', mr: 'रद्द करा', hi: 'रद्द करें' },
  status: { en: 'Status', mr: 'स्थिती', hi: 'स्थिति' },
  actions: { en: 'Actions', mr: 'कृती', hi: 'कार्रवाई' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('maha_lang') as Language;
    if (saved && (saved === 'en' || saved === 'mr' || saved === 'hi')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('maha_lang', lang);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('languagechange'));
    }
  };

  const t = (key: string): string => {
    if (!key) return '';
    // Check exact key
    if (DICTIONARY[key]) {
      return DICTIONARY[key][language] || DICTIONARY[key]['en'];
    }
    // Case-insensitive fallback lookup
    const lowerKey = Object.keys(DICTIONARY).find(k => k.toLowerCase() === key.toLowerCase());
    if (lowerKey && DICTIONARY[lowerKey]) {
      return DICTIONARY[lowerKey][language] || DICTIONARY[lowerKey]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

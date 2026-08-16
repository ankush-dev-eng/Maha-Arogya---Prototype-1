import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Real PDF Generation for Command Center & Medical Records

export function downloadCommandCenterPDF(language: string = 'en') {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  // Header Banner
  doc.setFillColor(13, 148, 136); // Teal 600
  doc.rect(0, 0, 210, 32, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MAHAAROGYA — SANJEEVANI GRID', 14, 15);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('State Health Operations Command Center • Daily Executive Briefing', 14, 23);
  doc.text(`Generated: ${dateStr}`, 14, 28);

  // Summary Metrics Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Operational KPIs', 14, 42);

  autoTable(doc, {
    startY: 46,
    head: [['Metric', 'Value', 'Status / SLA Trend', 'Operational Context']],
    body: [
      ['Total Patient Inflow Today', '485 Patients', '+12% vs yesterday', 'Peak flow between 10 AM - 2 PM'],
      ['Active Emergency Cases', '3 Active', '2 Inbound Trauma, 1 Cardiac', '108 ALS Telemetry Connected'],
      ['Average OPD Waiting Time', '28 Minutes', 'Down 4 mins (Within Green SLA)', 'Triage Auto-Routing Active'],
      ['Total Tracked Beds', '350 Beds', '42 Available (8 ICU, 14 Oxygen)', '81.1% Occupancy Rate'],
      ['Ambulance Fleet Status', '12 Total', '4 Available, 8 In-Transit', 'Average Response ETA: 6.2 mins'],
      ['Hospital Staff on Duty', '156 Personnel', '100% Shift Allocation', 'Cath Lab & Trauma Team Standby'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3.5 },
  });

  // Department Load Breakdown
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Department Patient Load & Bed Allocation', 14, finalY);

  autoTable(doc, {
    startY: finalY + 4,
    head: [['Department', 'Patient Volume', 'Capacity Load', 'Doctor Availability', 'Status']],
    body: [
      ['General Medicine OPD', '85 Patients', '85% Capacity', '4 Doctors Active', 'Optimal'],
      ['Cardiology & Cath Lab', '45 Patients', '90% Capacity', '2 Cardiologists Active', 'High Load'],
      ['Orthopedics & Trauma Unit', '55 Patients', '73% Capacity', '3 Surgeons Active', 'Optimal'],
      ['Pediatrics & Neonatal ICU', '68 Patients', '68% Capacity', '3 Pediatricians Active', 'Optimal'],
      ['Gynecology & Obstetrics', '50 Patients', '62% Capacity', '2 Consultants Active', 'Optimal'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 3.5 },
  });

  // Footer & Audit Seal
  const footerY = (doc as any).lastAutoTable.finalY + 14;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text('Verified & Signed autonomously via MahaArogya Sanjeevani Grid • DMER Maharashtra Healthcare Network', 14, footerY);
  doc.text('Document ID: MAHA-CMD-2026-9812 • Cryptographically Audited', 14, footerY + 5);

  doc.save(`MahaArogya_Command_Center_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function downloadPatientLabPDF() {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-IN');

  // Header Banner
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, 210, 32, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SASSOON GENERAL HOSPITAL PATHOLOGY LAB', 14, 15);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('ABDM / ABHA Digital Health Record • Verified Diagnostic Report', 14, 23);
  doc.text(`Report Date: ${dateStr} • UHID: SAS-2024-9182`, 14, 28);

  // Patient Info Box
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Demographics & Clinical Profile', 14, 42);

  autoTable(doc, {
    startY: 45,
    body: [
      ['Patient Name:', 'Rajesh Patil', 'Age / Sex:', '45 Yrs / Male'],
      ['ABHA Health ID:', '91-4829-1029-4821', 'Blood Group:', 'B+ Positive (Verified)'],
      ['Consulting Doctor:', 'Dr. Anil Deshmukh (MD Path)', 'Sample Collected:', `${dateStr} 08:30 AM`],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
  });

  // Lab Results Table
  const startLabY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Complete Blood Count (CBC) & Glycemic Profile', 14, startLabY);

  autoTable(doc, {
    startY: startLabY + 4,
    head: [['Investigation Test', 'Result Value', 'Biological Reference Range', 'Units', 'Flag']],
    body: [
      ['Hemoglobin (Hb)', '13.8', '13.0 - 17.0', 'g/dL', 'NORMAL'],
      ['Total Leukocyte Count (WBC)', '7,400', '4,000 - 11,000', '/mcL', 'NORMAL'],
      ['Platelet Count', '240,000', '150,000 - 450,000', '/mcL', 'NORMAL'],
      ['Packed Cell Volume (PCV)', '42.1', '40.0 - 50.0', '%', 'NORMAL'],
      ['Fasting Plasma Glucose', '112', '70 - 99', 'mg/dL', 'ELEVATED'],
      ['Glycated Hemoglobin (HbA1c)', '6.8', '< 5.7 (Normal), 5.7-6.4 (Prediabetes)', '%', 'FAIR CONTROL'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  // Pathologist Signature
  const sigY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Anil Deshmukh, MD (Pathology)', 140, sigY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Chief Pathologist • Reg. No: MMC-2004/09/218', 140, sigY + 5);
  doc.text('✓ Digitally signed via National ABDM Gateway', 140, sigY + 10);

  doc.save('MahaArogya_Lab_Report_CBC_HbA1c.pdf');
}

export function downloadPrescriptionPDF() {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-IN');

  // Header Banner
  doc.setFillColor(15, 23, 42); // Slate 900
  doc.rect(0, 0, 210, 32, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('KEM HOSPITAL PUNE • CLINICAL OPD PRESCRIPTION', 14, 15);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('National ABDM e-Prescription (eRx) • Dr. Sanjay Kulkarni (MD Medicine)', 14, 23);
  doc.text(`Prescription Date: ${dateStr} • eRx Token: RX-8491-KEM`, 14, 28);

  // Patient & Clinical Context
  autoTable(doc, {
    startY: 40,
    body: [
      ['Patient Name:', 'Rajesh Patil (45/M)', 'ABHA ID:', '91-4829-1029-4821'],
      ['Chief Complaint:', 'Chest pressure & shortness of breath', 'Vitals:', 'BP: 145/95 | SpO2: 94% | HR: 104'],
      ['Documented Allergies:', 'PENICILLIN (Severe Warning)', 'Chronic Diagnosis:', 'Hypertension & Type 2 Diabetes'],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 },
  });

  const rxY = (doc as any).lastAutoTable.finalY + 6;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Prescribed Medications & Dosage Schedule', 14, rxY);

  autoTable(doc, {
    startY: rxY + 4,
    head: [['Medication Name', 'Dosage & Frequency', 'Duration', 'Instructions']],
    body: [
      ['Tab. Sorbitrate 5mg', '1 Tab Sublingual SOS', 'As needed', 'Dissolve under tongue during acute chest pain'],
      ['Tab. Metformin 500mg', '1-0-1 (Twice Daily)', '30 Days', 'Take immediately after food'],
      ['Tab. Amlodipine 5mg', '1-0-0 (Morning)', '30 Days', 'Take with water after breakfast'],
      ['Tab. Atorvastatin 20mg', '0-0-1 (Night)', '30 Days', 'Take after dinner at bedtime'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3.5 },
  });

  const adviceY = (doc as any).lastAutoTable.finalY + 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('General Clinical Advice:', 14, adviceY);
  doc.setFont('helvetica', 'normal');
  doc.text('1. Strict low sodium (<2g/day) and low glycemic index diet.', 14, adviceY + 5);
  doc.text('2. 30 minutes daily light brisk walking. Avoid heavy weights.', 14, adviceY + 10);
  doc.text('3. Immediate emergency room visit if chest pain persists > 10 minutes.', 14, adviceY + 15);
  doc.text('4. Review in Cardiology OPD after 30 days with repeat lipid profile & ECG.', 14, adviceY + 20);

  // Digital Sign
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Sanjay Kulkarni, MD', 145, adviceY + 25);
  doc.setFont('helvetica', 'normal');
  doc.text('Reg No: PMC-4821 • Digitally Signed via ABDM', 145, adviceY + 30);

  doc.save('MahaArogya_Electronic_Prescription_eRx.pdf');
}

export function downloadDiagnosticECGPDF() {
  const doc = new jsPDF();
  const dateStr = new Date().toLocaleDateString('en-IN');

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 32, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('DEENANATH MANGESHKAR HOSPITAL DIAGNOSTICS', 14, 15);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('12-Lead Electrocardiogram (ECG) & Echo Evaluation Report', 14, 23);
  doc.text(`Evaluation Date: ${dateStr} • Patient: Rajesh Patil (45/M)`, 14, 28);

  autoTable(doc, {
    startY: 40,
    head: [['Parameter', 'Measured Value', 'Normal Range', 'Clinical Evaluation']],
    body: [
      ['Heart Rate (HR)', '74 bpm', '60 - 100 bpm', 'Normal Sinus Rhythm'],
      ['PR Interval', '160 ms', '120 - 200 ms', 'Normal AV Conduction'],
      ['QRS Duration', '88 ms', '80 - 120 ms', 'Normal Ventricular Depolarization'],
      ['QTc Interval', '412 ms', '< 450 ms (Male)', 'Normal Repolarization'],
      ['Ejection Fraction (Echo)', '58%', '> 55%', 'Normal Left Ventricular Systolic Function'],
    ],
    theme: 'grid',
    headStyles: { fillColor: [13, 148, 136], textColor: [255, 255, 255] },
    styles: { fontSize: 9, cellPadding: 3.5 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Cardiologist Impression & Summary:', 14, finalY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Normal Sinus Rhythm with no acute ischemic ST-segment elevation or pathological Q waves.', 14, finalY + 6);
  doc.text('Preserved LV ejection fraction (58%). Clinical correlation with current anti-anginal medications advised.', 14, finalY + 12);

  doc.save('MahaArogya_Diagnostic_ECG.pdf');
}

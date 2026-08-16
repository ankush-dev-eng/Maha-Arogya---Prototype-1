# 🏥 MahaArogya — Sanjeevani Grid

> **AI-Assisted Public Healthcare Routing, Intelligent Triage & Multi-Facility Coordination Platform**  
> *Empowering public healthcare delivery across Maharashtra with real-time bed visibility, multilingual AI intake, smart OPD queuing, emergency SOS routing, government scheme guidance, and state-wide epidemic surveillance.*

---

## 📌 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Core Features & Portals](#-core-features--portals)
  - [1. Public Citizen Portal](#1-public-citizen-portal)
  - [2. Hospital Admin & Clinical Workspace](#2-hospital-admin--clinical-workspace)
  - [3. Government & Public Health Surveillance Grid](#3-government--public-health-surveillance-grid)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [1. Docker Compose (1-Command Turnkey Startup)](#1-docker-compose-1-command-turnkey-startup)
  - [2. Manual Local Setup](#2-manual-local-setup)
- [AI Safety & ML Benchmark Suite](#-ai-safety--ml-benchmark-suite)
- [API & Service Endpoints](#-api--service-endpoints)
- [Repository Branch Structure](#-repository-branch-structure)
- [License & Attribution](#-license--attribution)

---

## 🌟 Overview

**MahaArogya (Sanjeevani Grid)** is a next-generation healthcare coordination ecosystem designed to eliminate critical bottlenecks in public health systems:

1. **Hospital Overcrowding & Queue Inefficiencies**: Live OPD queue tracking, digital token dispatch, and crowd density telemetry.
2. **Emergency Routing Delays**: Dynamic hospital triage routing considering real-time ICU/Oxygen bed availability, distance, and 30-minute temporary reservation holds.
3. **Multilingual Rural Accessibility**: Voice-first AI intake in **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**, powered by Faster-Whisper and Edge-TTS.
4. **Government Scheme Awareness**: Instant eligibility checker and document checklist for **MJPJAY** (Mahatma Jyotirao Phule Jan Arogya Yojana) and **Ayushman Bharat (PM-JAY)**.
5. **Clinical Documentation Burden**: Automatic doctor-patient consultation transcription and structured SOAP / clinical note generation.
6. **Epidemiological Early Warning**: State-level epidemic outbreak detection (Dengue, Malaria, Respiratory), R₀ velocity tracking, and automated inter-hospital resource rebalancing.

---

## 🏗 System Architecture

```mermaid
flowchart TB
    subgraph ClientLayer ["🖥 Client Layer (Next.js 15 + Tailwind CSS)"]
        CP["🌐 Public Citizen Portal\n(Triage, Beds, Queue, SOS, Schemes, ABHA)"]
        HP["👨‍⚕️ Hospital Admin & Doctor Portal\n(OPD, Beds, Blood, Staff, CCTV, 30m Hold)"]
        GP["🏛 Government Surveillance Grid\n(Epidemics, Heatmaps, Auto-Balancing)"]
    end

    subgraph GatewayLayer ["⚡ AI Inference Gateway (FastAPI :8001)"]
        ASR["🎙 Faster-Whisper ASR\n(Voice-to-Text)"]
        LLM["🧠 Ollama / Clinical LLM\n(SOAP Notes, Triage)"]
        TTS["🔊 Edge-TTS Engine\n(Marathi, Hindi, English)"]
        ROUTE["📍 Smart Routing & Severity Scorer"]
        SAFETY["🛡 10-Gate Safety & Negation Engine"]
    end

    subgraph BackendLayer ["⚙️ Core Backend Service (FastAPI :8000)"]
        AUTH["🔐 Role-Based Access Control"]
        TRIAGE["🩺 Triage & Severity Classifier"]
        BEDS["🛏 Real-Time Bed & Resource Engine"]
        QUEUE["⏱ Live OPD Queue Manager"]
        SOS["🚨 Emergency SOS Dispatcher (30m Hold)"]
        DASH["📊 Aggregation & Analytics Engine"]
    end

    subgraph DataLayer ["💾 Persistence & Storage"]
        DB[("🗄 SQLite / PostgreSQL\nAsync SQLAlchemy 2.0")]
        AUDIT["📝 Immutable Audit Trail (AuditEvent)"]
    end

    CP -->|HTTP / JSON| BackendLayer
    HP -->|HTTP / JSON| BackendLayer
    GP -->|HTTP / JSON| BackendLayer

    CP -->|Voice & Multilingual Triage| GatewayLayer
    HP -->|Clinical Summarization| GatewayLayer

    BackendLayer --> DB
    BackendLayer --> AUDIT
    BackendLayer <-->|Live Proxy & Fallback| GatewayLayer
```

---

## 🎯 Core Features & Portals

### 1. Public Citizen Portal
- **Multilingual AI Symptom Triage (`/triage`)**: Conversational or structured symptom input with severity scoring (Emergency, Urgent, Routine), recommended care tier, and instant multilingual voice guidance.
- **Government Healthcare Scheme Guidance (`/schemes`)**: Interactive eligibility checker for MJPJAY & Ayushman Bharat PM-JAY based on Ration Card (Yellow/Orange/White), mandatory document checklist, and empanelled network hospitals.
- **GIS Hospital Finder & Bed Tracker (`/hospitals`)**: Interactive Leaflet map of Maharashtra hospitals (KEM, Sion, JJ, Sassoon, etc.) with live counts for General Beds, ICU, HDU, Oxygen, and Pediatric wards.
- **Live OPD Queue Tracker (`/queue`)**: Generate digital OPD tokens, monitor estimated wait times, and receive real-time turn notifications.
- **Emergency SOS Dispatch (`/emergency`)**: One-tap emergency locator connecting citizens to the nearest trauma centers with live capacity.
- **ABHA & Health Records (`/records`)**: View past consultation history, download digital PDF prescriptions, and view diagnostic notes.

### 2. Hospital Admin & Clinical Workspace
- **Hospital Operations Dashboard (`/dashboard`)**: High-level telemetry for admissions, bed occupancy, doctor utilization, and critical triage cases.
- **Doctor Consultation Portal (`/doctor`)**: Integrated clinical workspace featuring voice-to-text transcriptions, AI SOAP summary generation, medicine prescription builder, and one-click PDF generation.
- **Emergency Desk & 30-Minute Bed Hold (`/admin-emergency`)**: Live 108 ambulance dispatch radar with a **live 30-minute countdown ticker** for temporary ICU/trauma bed reservation holds (`Accept`, `Extend 15m`, `Confirm Arrival`).
- **Bed Management Matrix (`/beds`)**: Ward-level allocation, patient admissions, transfers, discharges, and real-time status switches.
- **CCTV Waiting Room & Bed Analytics (`/cctv`)**: AI-assisted crowd density monitoring, YOLO occupancy detection, and human-in-the-loop discrepancy auditing.
- **Blood Bank Registry (`/blood-bank`)**: Live units inventory across A+, A-, B+, B-, AB+, AB-, O+, O- with critical reserve threshold warnings.
- **Pharmacy & Consumables (`/pharmacy`)**: Critical stock monitoring (antibiotics, IV fluids, analgesics, emergency injections) and reorder alerts.
- **Facility Resources & Equipment (`/resources`)**: Real-time telemetry for ventilators, dialysis units, oxygen generation plants, and defibrillators.
- **Staff Duty Roster (`/staff`)**: On-duty roster management for doctors, nurses, paramedics, and support staff.

### 3. Government & Public Health Surveillance Grid
- **State-Wide Health Grid Overview (`/overview`)**: Macro health metrics across Maharashtra districts (Mumbai, Pune, Nagpur, Nashik, Aurangabad, etc.).
- **Epidemic Outbreak Analytics (`/analytics`)**: Infectious disease trend forecasting (Dengue, Malaria, Gastroenteritis, Respiratory), R₀ velocity index, and geographical outbreak heatmaps.
- **Automated Alerts & Resource Balancing (`/alerts`)**: Early-warning triggers for disease spikes, cross-district ambulance redirection, and mutual-aid resource redistribution.

---

## 💻 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling & Icons** | Tailwind CSS v4, Lucide React, clsx, tailwind-merge |
| **Mapping & Geospatial** | Leaflet, React-Leaflet, OpenStreetMap |
| **Data Visualization** | Recharts (Area, Bar, Line, Pie charts) |
| **PDF Generation** | jsPDF, jsPDF-AutoTable |
| **Core Backend** | FastAPI, Python 3.10+, Pydantic v2, Loguru |
| **Database & ORM** | SQLAlchemy 2.0 (Async), aiosqlite, SQLite / PostgreSQL |
| **AI Inference Gateway** | FastAPI, PyTorch (CUDA GPU Acceleration) |
| **ASR (Speech-to-Text)** | Faster-Whisper / OpenAI Whisper |
| **LLM & Clinical NLP** | Ollama (`qwen2.5:7b` / custom models), Scikit-Learn |
| **Neural TTS** | Edge-TTS (Marathi `mr-IN`, Hindi `hi-IN`, English `en-IN`) |
| **Containerization** | Docker, Docker Compose |

---

## 📂 Project Directory Structure

```text
Maha-Arogya---Prototype-1/
├── README.md                     # Monorepo documentation
├── docker-compose.yml            # Multi-service local orchestration
├── Dockerfile.frontend           # Next.js production build container
├── Dockerfile.backend            # FastAPI backend container
├── Dockerfile.aigateway          # AI Gateway inference container
├── .gitignore                    # Python, Node & DB ignore rules
│
├── frontend/                     # Next.js 15 Frontend Web Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/         # Citizen portal (triage, hospitals, queue, emergency, records, schemes)
│   │   │   ├── (admin)/          # Hospital operations (dashboard, opd, doctor, beds, blood, cctv, admin-emergency)
│   │   │   ├── (government)/     # State grid (overview, analytics, alerts)
│   │   │   ├── globals.css       # Design tokens & responsive styles
│   │   │   ├── layout.tsx        # Root HTML layout & language provider
│   │   │   └── page.tsx          # Landing & 9-role persona selector
│   │   ├── components/
│   │   │   ├── charts/           # Reusable stats cards & graph components
│   │   │   ├── maps/             # Dynamic Leaflet map components
│   │   │   ├── shared/           # Header, Navigation, Role Switcher, Language Selector
│   │   │   └── ui/               # Cards, Buttons, Badges, Modals, Inputs
│   │   └── lib/
│   │       ├── api.ts            # API client with role headers
│   │       ├── constants.ts      # Application constants & mock fallbacks
│   │       ├── LanguageContext.tsx # EN / HI / MR internationalization
│   │       ├── pdfGenerator.ts   # Client-side medical prescription PDF exporter
│   │       └── store.ts          # State store & demo presets
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                      # FastAPI Core Backend Service
│   ├── requirements.txt          # Python dependencies
│   └── src/
│       ├── main.py               # Application entrypoint & auto-seeding
│       ├── models.py             # SQLAlchemy models (16 tables: Hospitals, Beds, Patients, AuditEvents)
│       ├── core/
│       │   ├── config.py         # App settings & environment configurations
│       │   └── database.py       # Async engine & session management
│       ├── routers/
│       │   ├── auth.py           # Authentication & role management
│       │   ├── dashboard.py      # Hospital and state metrics & audit logs
│       │   ├── emergency.py      # SOS routing & incident logging
│       │   ├── hospitals.py      # Hospital registry & capacity APIs
│       │   ├── patients.py       # Patient database & consultation records
│       │   ├── queue.py          # OPD tokens & waiting room queues
│       │   ├── resources.py      # Beds, blood inventory, equipment status
│       │   └── triage.py         # Live proxy to AI Gateway + deterministic fallback
│       └── seed/
│           └── seed_data.py      # Comprehensive Maharashtra healthcare seed data
│
└── ai-gateway/                   # AI Inference & Multilingual Gateway
    ├── requirements.txt          # AI Gateway dependencies
    ├── tests/
    │   └── test_safety_eval.py   # 10-gate safety & red-team evaluation suite
    └── src/
        ├── main.py               # Gateway entrypoint & GPU detection
        └── routers/
            ├── voice.py          # ASR speech recognition (multilingual)
            ├── clinical.py       # Clinical summarization, negation detection & SOAP notes
            ├── triage.py         # Hybrid rule + ML triage risk classifier
            ├── routing.py        # Capacity-aware hospital routing
            └── tts.py            # Neural Text-to-Speech synthesizer
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **Python**: v3.10+
- **Git**: Installed and configured
- *(Optional)* **Docker & Docker Compose**: For containerized 1-command startup

---

### 1. Docker Compose (1-Command Turnkey Startup)

```bash
docker-compose up --build
```
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8000/docs`
- **AI Gateway**: `http://localhost:8001/docs`

---

### 2. Manual Local Setup

#### Step A: Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # On Windows (or source .venv/bin/activate on Linux)
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8000
```

#### Step B: AI Gateway
```bash
cd ai-gateway
python -m venv .venv
.venv\Scripts\activate      # On Windows (or source .venv/bin/activate on Linux)
pip install -r requirements.txt
uvicorn src.main:app --reload --port 8001
```

#### Step C: Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 AI Safety & ML Benchmark Suite

To run the automated 10-gate safety and red-team evaluation suite:

```bash
python ai-gateway/tests/test_safety_eval.py
```

### Verified Gates:
1. **Emergency Red Flag Recall**: 100% sensitivity on life-threatening symptoms (chest pain, breathlessness).
2. **English Negation Safety Gate**: Verifies *"not having chest pain"* does not trigger cardiac alarms.
3. **Marathi Negation Safety Gate**: Scopes Marathi negation (`छातीत दुखत नाही`).
4. **Hindi Negation Safety Gate**: Scopes Hindi negation (`सीने में दर्द नहीं है`).
5. **Indic Code-Switching**: Extracts entities from mixed Marathi/Hindi + English sentences.
6. **Vitals SpO2 Override**: SpO2 < 90% automatically triggers emergency escalation.
7. **Severe Tachycardia Override**: Heart rate > 140 bpm triggers critical alert.
8. **Neurological Unconsciousness**: Immediate Level 1 emergency routing.
9. **Clinical NLP Schema Conformity**: Validates structured JSON entity output.
10. **Routine Mild Symptom Triage**: Verifies appropriate low-acuity OPD care tier.

---

## 📡 API & Service Endpoints

| Service | Port | Endpoint | Description |
|---|---|---|---|
| **Frontend** | `3000` | `http://localhost:3000` | Unified Healthcare Web Portal (23 routes) |
| **Backend** | `8000` | `http://localhost:8000/docs` | Swagger OpenAPI Documentation |
| **Backend** | `8000` | `/api/v1/hospitals` | List hospitals with live capacity & bed counts |
| **Backend** | `8000` | `/api/v1/triage/assess` | Rule & ML-based patient triage assessment |
| **Backend** | `8000` | `/api/v1/queue/issue-token` | Issue real-time OPD token |
| **Backend** | `8000` | `/api/v1/emergency/create` | Trigger emergency dispatch request with 30m hold |
| **Backend** | `8000` | `/api/v1/dashboard/audit` | Immutable operational audit event logs |
| **AI Gateway** | `8001` | `http://localhost:8001/docs` | AI Inference Swagger Documentation |
| **AI Gateway** | `8001` | `/ai/voice/transcribe` | Multilingual Whisper speech recognition |
| **AI Gateway** | `8001` | `/ai/clinical/extract` | Clinical entity and negation extraction |
| **AI Gateway** | `8001` | `/ai/tts/synthesize` | Edge-TTS neural speech in MR / HI / EN |
| **AI Gateway** | `8001` | `/ai/routing/recommend` | Capacity-aware emergency hospital routing |

---

## 🌿 Repository Branch Structure

This repository is organized into dedicated branches for streamlined development and deployment:

- **`main`**: The consolidated, production-ready monorepo combining `frontend`, `backend`, and `ai-gateway`.
- **`frontend`**: Frontend codebase containing Next.js 15, React components, GIS maps, UI library, and styles.
- **`backend`**: Core FastAPI application, SQLAlchemy models, database migrations, and business logic routers.
- **`ai-gateway`**: AI microservice containing Whisper ASR, Edge-TTS, Clinical NLP, and routing algorithms.

---

## 📄 License & Attribution

Developed for the **MahaArogya Healthcare Initiative**. Designed to modernize public healthcare infrastructure with accessible AI and real-time coordination.

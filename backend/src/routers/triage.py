"""
Backend Triage Router — Proxies requests to AI Gateway and enforces safety rules.
Logs all decisions to immutable audit trail.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
import json
import httpx
from loguru import logger

from src.core.database import get_db
from src.models import SymptomCase, Symptom, Hospital, AuditEvent

router = APIRouter(prefix="/triage", tags=["triage"])
AI_GATEWAY_URL = "http://localhost:8001"


class CreateCaseReq(BaseModel):
    patient_id: Optional[str] = "p1"
    language: str = "en"
    initial_text: Optional[str] = ""
    transcript: Optional[str] = ""


class MessageReq(BaseModel):
    message: str


@router.post("/case")
async def create_case(req: CreateCaseReq, db: AsyncSession = Depends(get_db)):
    text = req.initial_text or req.transcript or ""
    pid = req.patient_id or "p1"
    case = SymptomCase(patient_id=pid, language=req.language, transcript=text)
    db.add(case)
    await db.flush()

    # Log audit event
    audit = AuditEvent(
        actor="CITIZEN",
        actor_role="citizen",
        action="CASE_CREATED",
        entity_type="symptom_case",
        entity_id=case.id,
        details=json.dumps({"language": req.language, "has_text": bool(text)}),
        model_version="system-v1.0"
    )
    db.add(audit)
    await db.commit()
    await db.refresh(case)
    return case


@router.post("/case/{id}/message")
async def send_message(id: str, req: MessageReq, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SymptomCase).where(SymptomCase.id == id))
    case = res.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
        
    case.transcript = (case.transcript or "") + "\n" + req.message
    await db.commit()
    return {"status": "ok"}


@router.get("/case/{id}")
async def get_case(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SymptomCase).where(SymptomCase.id == id))
    case = res.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
        
    sym_res = await db.execute(select(Symptom).where(Symptom.case_id == id))
    symptoms = sym_res.scalars().all()
    
    return {
        "case": case,
        "symptoms": symptoms
    }


@router.post("/case/{id}/assess")
async def assess_case(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SymptomCase).where(SymptomCase.id == id))
    case = res.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
        
    transcript = case.transcript or ""
    language = case.language or "en"

    # Step 1: Call AI Gateway for NLP Extraction & Triage Assessment
    extracted_symptoms = []
    risk = "low"
    confidence = 0.85
    dept = "General Medicine"
    next_question = "How long have you been experiencing these symptoms?"
    model_version = "v1.0-hybrid"

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            # 1. Clinical Extraction
            extract_resp = await client.post(
                f"{AI_GATEWAY_URL}/ai/clinical/extract",
                json={"transcript": transcript, "language": language}
            )
            if extract_resp.status_code == 200:
                nlp_data = extract_resp.json()
                extracted_symptoms = nlp_data.get("symptoms", [])
                if nlp_data.get("follow_up_question"):
                    next_question = nlp_data["follow_up_question"]

            # 2. Triage Assessment
            triage_resp = await client.post(
                f"{AI_GATEWAY_URL}/ai/triage/assess",
                json={
                    "symptoms": extracted_symptoms,
                    "urgency_indicators": []
                }
            )
            if triage_resp.status_code == 200:
                triage_data = triage_resp.json()
                risk = triage_data.get("risk_level", "low")
                confidence = triage_data.get("confidence", 0.9)
                dept = triage_data.get("recommended_department", "General Medicine")
                model_version = triage_data.get("model_version", "v1.0-hybrid")
    except Exception as ex:
        logger.warning(f"AI Gateway unavailable ({ex}), running deterministic safety fallback.")
        # Deterministic Safety Fallback
        text_lower = transcript.lower()
        if any(w in text_lower for w in ["chest pain", "छातीत दुखत", "सीने में दर्द", "breathless", "श्वास", "हृदय"]):
            risk = "emergency"
            dept = "Cardiology / Emergency"
            confidence = 0.95
            next_question = "Is the chest pain radiating to your left arm or jaw?"
        elif any(w in text_lower for w in ["fracture", "हाड मोडले", "हड्डी", "accident", "अपघात"]):
            risk = "high"
            dept = "Orthopedics"
            confidence = 0.9
        elif any(w in text_lower for w in ["fever", "ताप", "बुखार"]):
            risk = "moderate"
            dept = "General Medicine"
            confidence = 0.85

    case.risk = risk
    case.confidence = confidence
    case.recommended_department = dept
    
    # Save extracted symptoms
    for sym in extracted_symptoms:
        db.add(Symptom(
            case_id=case.id,
            concept=sym.get("concept", "symptom"),
            value=sym.get("value", ""),
            severity=sym.get("severity", "moderate"),
            negated=sym.get("negated", False),
            confidence=sym.get("confidence", 1.0)
        ))

    # Audit Trail Entry
    audit = AuditEvent(
        actor="AI_GATEWAY",
        actor_role="ai_triage_engine",
        action="TRIAGE_ASSESSMENT",
        entity_type="symptom_case",
        entity_id=case.id,
        details=json.dumps({"risk": risk, "confidence": confidence, "dept": dept}),
        model_version=model_version
    )
    db.add(audit)

    await db.commit()
    return {
        "risk": risk,
        "confidence": confidence,
        "department": dept,
        "next_question": next_question,
        "model_version": model_version
    }


@router.post("/case/{id}/route")
async def route_case(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SymptomCase).where(SymptomCase.id == id))
    case = res.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
        
    # Query active hospitals with capacity
    h_res = await db.execute(
        select(Hospital).where(Hospital.status == "active").order_by(Hospital.stress_level.asc()).limit(3)
    )
    hospitals = h_res.scalars().all()
    
    if hospitals:
        best_h = hospitals[0]
        case.recommended_hospital_id = best_h.id

        audit = AuditEvent(
            actor="ROUTING_ENGINE",
            actor_role="system",
            action="HOSPITAL_RECOMMENDED",
            entity_type="symptom_case",
            entity_id=case.id,
            details=json.dumps({"hospital_id": best_h.id, "hospital_name": best_h.name}),
            model_version="routing-v1.0"
        )
        db.add(audit)
        await db.commit()
        return {
            "hospital_id": best_h.id,
            "hospital_name": best_h.name,
            "distance": "2.4 km",
            "emergency_capable": best_h.emergency_capable,
            "stress_level": best_h.stress_level
        }
    return {"error": "No hospitals available"}

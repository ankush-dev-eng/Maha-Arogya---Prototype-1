from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List
import json

from src.core.database import get_db
from src.models import SymptomCase, Symptom, Hospital

router = APIRouter(prefix="/triage", tags=["triage"])

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
        
    # Mock AI logic based on keywords
    text = (case.transcript or "").lower()
    
    risk = "low"
    confidence = 0.8
    dept = "general"
    
    if "chest pain" in text or "breathless" in text:
        risk = "emergency"
        dept = "cardiology"
        confidence = 0.95
    elif "fever" in text and "high" in text:
        risk = "moderate"
        dept = "general"
    elif "fracture" in text or "bone" in text:
        risk = "high"
        dept = "orthopedics"
        
    case.risk = risk
    case.confidence = confidence
    case.recommended_department = dept
    
    # Mock symptom extraction
    if "chest pain" in text:
        db.add(Symptom(case_id=case.id, concept="chest_pain", severity="severe"))
    if "fever" in text:
        db.add(Symptom(case_id=case.id, concept="fever", severity="moderate"))
        
    await db.commit()
    return {"risk": risk, "confidence": confidence, "department": dept, "next_question": "Can you describe the pain more specifically?"}

@router.post("/case/{id}/route")
async def route_case(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(SymptomCase).where(SymptomCase.id == id))
    case = res.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
        
    # Mock routing: pick first active hospital
    h_res = await db.execute(select(Hospital).where(Hospital.status == "active").limit(1))
    h = h_res.scalar_one_or_none()
    
    if h:
        case.recommended_hospital_id = h.id
        await db.commit()
        return {"hospital_id": h.id, "hospital_name": h.name, "distance": "2.5 km"}
    return {"error": "No hospitals available"}

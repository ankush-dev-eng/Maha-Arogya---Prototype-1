from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional, List

from src.core.database import get_db
from src.models import Hospital, EmergencyCase, OPDToken, Bed

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/hospital/{id}")
async def get_hospital_dashboard(id: str, db: AsyncSession = Depends(get_db)):
    # OPD waiting
    opd_res = await db.execute(
        select(OPDToken).where(OPDToken.hospital_id == id, OPDToken.status == "waiting")
    )
    opd_waiting = len(opd_res.scalars().all())
    
    # Active emergencies
    em_res = await db.execute(
        select(EmergencyCase).where(
            EmergencyCase.hospital_id == id,
            EmergencyCase.status.not_in(["resolved", "cancelled"])
        )
    )
    emergencies = len(em_res.scalars().all())
    
    # Beds
    bed_res = await db.execute(select(Bed).where(Bed.hospital_id == id))
    beds = bed_res.scalars().all()
    available_beds = sum(1 for b in beds if b.state == "available")
    icu_available = sum(1 for b in beds if b.state == "available" and b.ward == "ICU")
    
    return {
        "opd_waiting": opd_waiting,
        "active_emergencies": emergencies,
        "available_beds": available_beds,
        "icu_available": icu_available
    }

@router.get("/government")
async def get_government_dashboard(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Hospital))
    hospitals = res.scalars().all()
    
    summary = []
    for h in hospitals:
        summary.append({
            "id": h.id,
            "name": h.name,
            "stress_level": h.stress_level,
            "status": h.status
        })
        
    return {"hospitals": summary}

@router.get("/government/heatmap")
async def get_heatmap(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Hospital))
    hospitals = res.scalars().all()
    
    data = []
    for h in hospitals:
        data.append({
            "id": h.id,
            "lat": h.latitude,
            "lng": h.longitude,
            "weight": h.stress_level
        })
    return data

@router.get("/anomalies")
async def get_anomalies(db: AsyncSession = Depends(get_db)):
    from src.models import Anomaly
    res = await db.execute(select(Anomaly).order_by(Anomaly.created_at.desc()).limit(10))
    anomalies = res.scalars().all()
    if anomalies:
        return anomalies
    return [
        {"type": "surge", "hospital": "Pune General", "message": "OPD queue exceeding capacity", "score": 0.88, "status": "active"},
        {"type": "shortage", "hospital": "City Hospital", "message": "O- blood stock critical", "score": 0.94, "status": "active"},
        {"type": "mismatch", "hospital": "KEM Hospital", "message": "CCTV bed occupancy discrepancy detected in General Ward B", "score": 0.76, "status": "acknowledged"}
    ]

@router.get("/audit")
async def get_audit_log(db: AsyncSession = Depends(get_db)):
    from src.models import AuditEvent
    res = await db.execute(select(AuditEvent).order_by(AuditEvent.timestamp.desc()).limit(20))
    events = res.scalars().all()
    if events:
        return events
    return [
        {"action": "BED_ALLOCATION", "actor": "Dr. Sharma", "entity_type": "bed", "entity_id": "bed-12", "timestamp": "2026-08-16T10:00:00Z", "model_version": "v1.0"},
        {"action": "EMERGENCY_ACKNOWLEDGED", "actor": "Nurse Anjali", "entity_type": "emergency_case", "entity_id": "emg-9182", "timestamp": "2026-08-16T09:45:00Z", "model_version": "v1.0"}
    ]

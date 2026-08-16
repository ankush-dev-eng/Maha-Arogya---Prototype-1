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
async def get_anomalies():
    # Mock anomalies
    return [
        {"type": "surge", "hospital": "Pune General", "message": "OPD queue exceeding capacity"},
        {"type": "shortage", "hospital": "City Hospital", "message": "O- blood stock critical"}
    ]

@router.get("/audit")
async def get_audit_log():
    # Mock audit events
    return [
        {"action": "bed_allocation", "user": "Dr. Sharma", "timestamp": "2026-08-16T10:00:00Z"},
        {"action": "emergency_accepted", "user": "Nurse Anjali", "timestamp": "2026-08-16T09:45:00Z"}
    ]

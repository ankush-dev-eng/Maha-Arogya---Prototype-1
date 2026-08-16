from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from src.core.database import get_db
from src.models import EmergencyCase, SymptomCase

router = APIRouter(prefix="/emergency", tags=["emergency"])

class CreateEmergencyReq(BaseModel):
    case_id: str
    lat: Optional[float] = None
    lng: Optional[float] = None

class AcknowledgeReq(BaseModel):
    staff_id: str
    staff_name: str

class UpdateStatusReq(BaseModel):
    status: str

@router.post("/create")
async def create_emergency(req: CreateEmergencyReq, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(SymptomCase).where(SymptomCase.id == req.case_id))
    case = case_res.scalar_one_or_none()
    if not case:
        raise HTTPException(404, "Case not found")
        
    emergency = EmergencyCase(
        case_id=req.case_id,
        hospital_id=case.recommended_hospital_id,
        status="created"
    )
    db.add(emergency)
    await db.commit()
    await db.refresh(emergency)
    return emergency

@router.get("/active")
async def get_active_emergencies(db: AsyncSession = Depends(get_db)):
    res = await db.execute(
        select(EmergencyCase).where(EmergencyCase.status.not_in(["resolved", "cancelled"]))
    )
    return res.scalars().all()

@router.get("/{id}")
async def get_emergency(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(EmergencyCase).where(EmergencyCase.id == id))
    emergency = res.scalar_one_or_none()
    if not emergency:
        raise HTTPException(404, "Emergency not found")
    return emergency

@router.post("/{id}/acknowledge")
async def acknowledge_emergency(id: str, req: AcknowledgeReq, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(EmergencyCase).where(EmergencyCase.id == id))
    emergency = res.scalar_one_or_none()
    if not emergency:
        raise HTTPException(404, "Emergency not found")
        
    emergency.status = "acknowledged"
    emergency.acknowledged_at = datetime.utcnow()
    emergency.acknowledged_by = req.staff_name
    await db.commit()
    await db.refresh(emergency)
    return emergency

@router.post("/{id}/reserve")
async def request_reservation(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(EmergencyCase).where(EmergencyCase.id == id))
    emergency = res.scalar_one_or_none()
    if not emergency:
        raise HTTPException(404, "Emergency not found")
        
    emergency.reservation_status = "requested"
    await db.commit()
    return emergency

@router.post("/{id}/confirm")
async def confirm_reservation(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(EmergencyCase).where(EmergencyCase.id == id))
    emergency = res.scalar_one_or_none()
    if not emergency:
        raise HTTPException(404, "Emergency not found")
        
    emergency.reservation_status = "confirmed"
    await db.commit()
    return emergency

@router.put("/{id}/status")
async def update_status(id: str, req: UpdateStatusReq, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(EmergencyCase).where(EmergencyCase.id == id))
    emergency = res.scalar_one_or_none()
    if not emergency:
        raise HTTPException(404, "Emergency not found")
        
    emergency.status = req.status
    await db.commit()
    await db.refresh(emergency)
    return emergency

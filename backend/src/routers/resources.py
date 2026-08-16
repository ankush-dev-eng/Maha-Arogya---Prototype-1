from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel
from typing import Optional, List

from src.core.database import get_db
from src.models import Bed, Inventory, Staff, Resource, BloodStock

router = APIRouter(prefix="/resources", tags=["resources"])

class BedStateUpdateReq(BaseModel):
    state: str
    patient_name: Optional[str] = None

@router.get("/beds/{hospital_id}")
async def get_beds(
    hospital_id: str,
    ward: Optional[str] = None,
    state: Optional[str] = None,
    bed_type: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Bed).where(Bed.hospital_id == hospital_id)
    if ward:
        stmt = stmt.where(Bed.ward == ward)
    if state:
        stmt = stmt.where(Bed.state == state)
    if bed_type:
        stmt = stmt.where(Bed.bed_type == bed_type)
        
    res = await db.execute(stmt)
    return res.scalars().all()

@router.put("/beds/{id}/state")
async def update_bed_state(id: str, req: BedStateUpdateReq, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Bed).where(Bed.id == id))
    bed = res.scalar_one_or_none()
    if not bed:
        raise HTTPException(404, "Bed not found")
        
    bed.state = req.state
    if req.patient_name is not None:
        bed.patient_name = req.patient_name
        
    await db.commit()
    await db.refresh(bed)
    return bed

@router.get("/beds/{hospital_id}/summary")
async def get_beds_summary(hospital_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Bed).where(Bed.hospital_id == hospital_id))
    beds = res.scalars().all()
    
    total = len(beds)
    available = sum(1 for b in beds if b.state == "available")
    occupied = sum(1 for b in beds if b.state == "occupied")
    
    return {
        "total": total,
        "available": available,
        "occupied": occupied
    }

@router.get("/blood/{hospital_id}")
async def get_blood_stock(hospital_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(BloodStock).where(BloodStock.hospital_id == hospital_id))
    return res.scalars().all()

@router.get("/inventory/{hospital_id}")
async def get_inventory(
    hospital_id: str,
    q: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Inventory).where(Inventory.hospital_id == hospital_id)
    if q:
        stmt = stmt.where(Inventory.item_name.ilike(f"%{q}%"))
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/staff/{hospital_id}")
async def get_staff(hospital_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Staff).where(Staff.hospital_id == hospital_id))
    return res.scalars().all()

@router.get("/equipment/{hospital_id}")
async def get_equipment(hospital_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Resource).where(Resource.hospital_id == hospital_id))
    return res.scalars().all()

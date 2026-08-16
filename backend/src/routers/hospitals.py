from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func
from pydantic import BaseModel
from typing import Optional, List
import math

from src.core.database import get_db
from src.models import Hospital, Department

router = APIRouter(prefix="/hospitals", tags=["hospitals"])

@router.get("/")
async def list_hospitals(
    city: Optional[str] = None,
    emergency_capable: Optional[bool] = None,
    status: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Hospital)
    if city:
        stmt = stmt.where(Hospital.city == city)
    if emergency_capable is not None:
        stmt = stmt.where(Hospital.emergency_capability == emergency_capable)
    if status:
        stmt = stmt.where(Hospital.status == status)
        
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/nearby")
async def nearby_hospitals(
    lat: float,
    lng: float,
    db: AsyncSession = Depends(get_db)
):
    # Simple euclidean distance for mock
    res = await db.execute(select(Hospital))
    hospitals = res.scalars().all()
    
    for h in hospitals:
        # hacky euclidean distance sorting
        dist = math.sqrt((h.latitude - lat)**2 + (h.longitude - lng)**2)
        h._distance = dist
        
    hospitals.sort(key=lambda x: getattr(x, '_distance', 0))
    return hospitals[:10]

@router.get("/search")
async def search_hospitals(
    q: str,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Hospital).where(
        or_(
            Hospital.name.ilike(f"%{q}%"),
            Hospital.city.ilike(f"%{q}%")
        )
    )
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/{id}")
async def get_hospital(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Hospital).where(Hospital.id == id))
    h = res.scalar_one_or_none()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return h

@router.get("/{id}/departments")
async def get_hospital_departments(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Department).where(Department.hospital_id == id))
    return res.scalars().all()

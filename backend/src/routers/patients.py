from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List

from src.core.database import get_db
from src.models import Patient, SymptomCase, OPDToken

router = APIRouter(prefix="/patients", tags=["patients"])

class PatientCreate(BaseModel):
    name: str
    age: int
    sex: str
    language: str = "en"
    phone: Optional[str] = None
    blood_group: Optional[str] = None

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    sex: Optional[str] = None
    phone: Optional[str] = None

@router.post("/")
async def create_patient(req: PatientCreate, db: AsyncSession = Depends(get_db)):
    p = Patient(**req.model_dump())
    db.add(p)
    await db.commit()
    await db.refresh(p)
    return p

@router.get("/{id}")
async def get_patient(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Patient).where(Patient.id == id))
    p = res.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    return p

@router.put("/{id}")
async def update_patient(id: str, req: PatientUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Patient).where(Patient.id == id))
    p = res.scalar_one_or_none()
    if not p:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    for k, v in req.model_dump(exclude_unset=True).items():
        setattr(p, k, v)
        
    await db.commit()
    await db.refresh(p)
    return p

@router.get("/{id}/records")
async def get_patient_records(id: str, db: AsyncSession = Depends(get_db)):
    cases_res = await db.execute(select(SymptomCase).where(SymptomCase.patient_id == id))
    tokens_res = await db.execute(select(OPDToken).where(OPDToken.patient_id == id))
    
    return {
        "cases": cases_res.scalars().all(),
        "appointments": tokens_res.scalars().all()
    }

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List

from src.core.database import get_db
from src.models import OPDToken, Department

router = APIRouter(prefix="/queue", tags=["queue"])

class CreateTokenReq(BaseModel):
    patient_id: str
    hospital_id: str
    department_id: str

class UpdateTokenReq(BaseModel):
    status: str

@router.post("/token")
async def create_token(req: CreateTokenReq, db: AsyncSession = Depends(get_db)):
    dept_res = await db.execute(select(Department).where(Department.id == req.department_id))
    dept = dept_res.scalar_one_or_none()
    if not dept:
        raise HTTPException(404, "Department not found")
        
    # generate token number
    tokens_res = await db.execute(
        select(OPDToken).where(OPDToken.department_id == req.department_id)
    )
    existing = len(tokens_res.scalars().all())
    
    token = OPDToken(
        token_number=existing + 1,
        patient_id=req.patient_id,
        hospital_id=req.hospital_id,
        department_id=req.department_id,
        queue_position=existing + 1,
        estimated_wait_minutes=(existing + 1) * dept.avg_wait_minutes
    )
    db.add(token)
    
    dept.current_queue += 1
    
    await db.commit()
    await db.refresh(token)
    return token

@router.get("/token/{id}")
async def get_token(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(OPDToken).where(OPDToken.id == id))
    token = res.scalar_one_or_none()
    if not token:
        raise HTTPException(404, "Token not found")
    return token

@router.get("/hospital/{id}/queue")
async def get_hospital_queues(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Department).where(Department.hospital_id == id))
    depts = res.scalars().all()
    return depts

@router.put("/token/{id}/status")
async def update_token_status(id: str, req: UpdateTokenReq, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(OPDToken).where(OPDToken.id == id))
    token = res.scalar_one_or_none()
    if not token:
        raise HTTPException(404, "Token not found")
        
    token.status = req.status
    if req.status in ["completed", "no_show", "cancelled"]:
        token.queue_position = 0
        # decrement dept queue
        dept_res = await db.execute(select(Department).where(Department.id == token.department_id))
        dept = dept_res.scalar_one_or_none()
        if dept and dept.current_queue > 0:
            dept.current_queue -= 1
            
    await db.commit()
    await db.refresh(token)
    return token

@router.get("/token/{id}/wait")
async def get_token_wait(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(OPDToken).where(OPDToken.id == id))
    token = res.scalar_one_or_none()
    if not token:
        raise HTTPException(404, "Token not found")
        
    return {"queue_position": token.queue_position, "estimated_wait_minutes": token.estimated_wait_minutes}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional, List

from src.core.database import get_db
from src.models import UserDemo

router = APIRouter(prefix="/auth", tags=["auth"])

class RoleSelectRequest(BaseModel):
    role: str
    display_name: str
    hospital_id: Optional[str] = None

class RoleSelectResponse(BaseModel):
    token: str
    user_id: str

@router.post("/select-role", response_model=RoleSelectResponse)
async def select_role(req: RoleSelectRequest, db: AsyncSession = Depends(get_db)):
    user = UserDemo(
        role=req.role,
        display_name=req.display_name,
        hospital_id=req.hospital_id
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return RoleSelectResponse(token=f"demo-token-{user.id}", user_id=user.id)

@router.get("/roles")
async def get_roles():
    return {
        "roles": [
            "citizen", "hospital_admin", "doctor", "nurse", "reception",
            "emergency_staff", "blood_bank", "pharmacy", "government"
        ]
    }

@router.get("/me")
async def get_me(token: str, db: AsyncSession = Depends(get_db)):
    if not token.startswith("demo-token-"):
        raise HTTPException(status_code=401, detail="Invalid token")
    user_id = token.replace("demo-token-", "")
    stmt = select(UserDemo).where(UserDemo.id == user_id)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

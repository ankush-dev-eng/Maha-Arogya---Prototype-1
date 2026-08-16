"""
Hospital Routing Router — Weighted scoring algorithm for hospital recommendation.
Ranks hospitals by distance, department availability, wait time, emergency capability, and load.
"""
import math
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel
from loguru import logger

router = APIRouter()


class RoutingRequest(BaseModel):
    patient_lat: float
    patient_lng: float
    department_type: str = "general"
    risk_level: str = "low"  # low, moderate, high, emergency
    hospitals: list[dict]  # [{id, name, lat, lng, emergency_capability, stress_level, departments: [{type, avg_wait, status}]}]


class HospitalRecommendation(BaseModel):
    hospital_id: str
    hospital_name: str
    score: float
    distance_km: float
    estimated_wait_minutes: int
    department_available: bool
    emergency_capable: bool
    stress_level: float
    reasons: list[str]


class RoutingResponse(BaseModel):
    recommendations: list[HospitalRecommendation]
    model_version: str = "v1.0-weighted-scoring"


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points in km."""
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlng = math.radians(lng2 - lng1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlng/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return round(R * c, 2)


@router.post("/recommend", response_model=RoutingResponse)
async def recommend_hospitals(req: RoutingRequest):
    """
    Rank hospitals using weighted scoring.
    Weights adjust based on case urgency — emergencies prioritize capability over distance.
    """
    # Adjust weights based on urgency
    if req.risk_level == "emergency":
        weights = {"distance": 0.15, "department": 0.20, "wait": 0.10, "emergency": 0.35, "load": 0.20}
    elif req.risk_level == "high":
        weights = {"distance": 0.20, "department": 0.25, "wait": 0.15, "emergency": 0.25, "load": 0.15}
    else:
        weights = {"distance": 0.30, "department": 0.25, "wait": 0.20, "emergency": 0.10, "load": 0.15}

    recommendations = []

    for hospital in req.hospitals:
        if hospital.get("status") == "inactive":
            continue

        reasons = []
        scores = {}

        # 1. Distance score (closer = better, normalized 0-1)
        distance = haversine_distance(
            req.patient_lat, req.patient_lng,
            hospital["latitude"], hospital["longitude"]
        )
        # Score: 1.0 for 0km, 0.0 for 20+km
        scores["distance"] = max(0, 1 - (distance / 20))
        if distance < 3:
            reasons.append(f"Very close ({distance} km)")
        elif distance < 8:
            reasons.append(f"Nearby ({distance} km)")

        # 2. Department availability score
        dept_available = False
        dept_wait = 30  # default
        departments = hospital.get("departments", [])
        for dept in departments:
            if dept.get("type") == req.department_type and dept.get("status") == "active":
                dept_available = True
                dept_wait = dept.get("avg_wait_minutes", 30)
                break
        scores["department"] = 1.0 if dept_available else 0.2
        if dept_available:
            reasons.append(f"{req.department_type.title()} department available")

        # 3. Wait time score (lower = better)
        scores["wait"] = max(0, 1 - (dept_wait / 60))
        if dept_wait < 15:
            reasons.append(f"Short wait (~{dept_wait} min)")

        # 4. Emergency capability score
        emergency_capable = hospital.get("emergency_capability", False)
        scores["emergency"] = 1.0 if emergency_capable else 0.0
        if emergency_capable and req.risk_level in ("high", "emergency"):
            reasons.append("Emergency care available")

        # 5. Load score (lower stress = better)
        stress = hospital.get("stress_level", 0.5)
        scores["load"] = 1.0 - stress
        if stress < 0.3:
            reasons.append("Low hospital load")
        elif stress > 0.7:
            reasons.append("⚠️ High hospital load")

        # Skip non-emergency hospitals for emergency cases
        if req.risk_level == "emergency" and not emergency_capable:
            continue

        # Calculate weighted score
        total_score = sum(scores[k] * weights[k] for k in weights)

        recommendations.append(HospitalRecommendation(
            hospital_id=hospital["id"],
            hospital_name=hospital["name"],
            score=round(total_score, 3),
            distance_km=distance,
            estimated_wait_minutes=dept_wait,
            department_available=dept_available,
            emergency_capable=emergency_capable,
            stress_level=stress,
            reasons=reasons if reasons else ["Available for consultation"],
        ))

    # Sort by score descending
    recommendations.sort(key=lambda x: x.score, reverse=True)

    return RoutingResponse(recommendations=recommendations[:5])

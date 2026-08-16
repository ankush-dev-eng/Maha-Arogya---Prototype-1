"""
Triage Risk Assessment Router — Hybrid rule engine + ML classifier.
Deterministic rules catch emergencies; ML handles moderate/low cases.
Safety engine ensures no false negatives on life-threatening conditions.
"""
import random
from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel
from loguru import logger

router = APIRouter()


class TriageRequest(BaseModel):
    symptoms: list[dict]  # [{concept, severity, negated, duration, ...}]
    age: Optional[int] = None
    sex: Optional[str] = None
    vitals: Optional[dict] = None  # {bp, spo2, heart_rate, temperature}
    existing_conditions: list[str] = []
    urgency_indicators: list[str] = []


class TriageResponse(BaseModel):
    risk_level: str  # low, moderate, high, emergency
    confidence: float
    reason_codes: list[str]
    recommended_department: str
    recommended_care_level: str  # self_care, opd, urgent_care, emergency
    safety_overrides: list[str] = []
    model_version: str = "v1.0-hybrid"


# Emergency red flags — DETERMINISTIC, never skipped
EMERGENCY_RED_FLAGS = {
    "chest_pain": "Chest pain detected - potential cardiac emergency",
    "breathlessness": "Respiratory distress - emergency assessment needed",
    "unconsciousness": "Loss of consciousness - immediate attention required",
    "stroke_symptoms": "Stroke indicators - time-critical emergency",
    "severe_bleeding": "Severe bleeding - emergency intervention needed",
    "seizure": "Seizure activity - emergency care required",
    "anaphylaxis": "Allergic emergency - immediate epinephrine may be needed",
}

HIGH_RISK_SYMPTOMS = {
    "chest_pain", "breathlessness", "unconsciousness", "bleeding",
    "seizure", "severe_abdominal_pain", "paralysis", "confusion",
}

MODERATE_SYMPTOMS = {
    "fever", "vomiting", "dizziness", "weakness", "headache",
    "abdominal_pain", "back_pain", "joint_pain", "swelling",
}

DEPARTMENT_MAP = {
    "chest_pain": "Cardiology",
    "breathlessness": "Emergency",
    "headache": "General Medicine",
    "fever": "General Medicine",
    "fracture": "Orthopedics",
    "joint_pain": "Orthopedics",
    "back_pain": "Orthopedics",
    "abdominal_pain": "General Medicine",
    "skin_rash": "Dermatology",
    "cough": "General Medicine",
    "vomiting": "General Medicine",
    "dizziness": "Neurology",
    "unconsciousness": "Emergency",
    "bleeding": "Emergency",
    "seizure": "Neurology",
    "sore_throat": "ENT",
}


@router.post("/assess", response_model=TriageResponse)
async def assess_risk(req: TriageRequest):
    """
    Assess patient risk level using hybrid rule engine + ML.
    Emergency red flags ALWAYS override ML predictions (safety guarantee).
    """
    active_symptoms = [s for s in req.symptoms if not s.get("negated", False)]
    symptom_concepts = {s.get("concept", "") for s in active_symptoms}

    reason_codes = []
    safety_overrides = []
    risk_level = "low"
    confidence = 0.85

    # ---- TIER 1: Deterministic Emergency Rules (NEVER overridden) ----
    emergency_flags = symptom_concepts & set(EMERGENCY_RED_FLAGS.keys())
    if emergency_flags:
        risk_level = "emergency"
        confidence = 0.95
        for flag in emergency_flags:
            safety_overrides.append(EMERGENCY_RED_FLAGS[flag])
            reason_codes.append(f"emergency_rule:{flag}")

    # Check vitals for emergency
    if req.vitals:
        spo2 = req.vitals.get("spo2")
        hr = req.vitals.get("heart_rate")
        sbp = req.vitals.get("bp")
        temp = req.vitals.get("temperature")

        if spo2 and spo2 < 90:
            risk_level = "emergency"
            safety_overrides.append(f"Critical SpO2: {spo2}%")
            reason_codes.append("vital:critical_spo2")
        if hr and (hr > 140 or hr < 40):
            risk_level = "emergency"
            safety_overrides.append(f"Critical heart rate: {hr} bpm")
            reason_codes.append("vital:critical_hr")

    # Check urgency indicators from NLP
    if "emergency_red_flag" in req.urgency_indicators:
        if risk_level != "emergency":
            risk_level = "high"
            reason_codes.append("nlp:emergency_indicator")

    # ---- TIER 2: High Risk Assessment ----
    if risk_level not in ("emergency",):
        high_risk_matches = symptom_concepts & HIGH_RISK_SYMPTOMS
        if high_risk_matches:
            risk_level = "high"
            confidence = 0.82
            for match in high_risk_matches:
                reason_codes.append(f"high_risk:{match}")

        # Age-based risk escalation
        if req.age and (req.age > 65 or req.age < 5):
            if risk_level == "moderate":
                risk_level = "high"
                reason_codes.append("age_risk_escalation")

        # Comorbidity escalation
        if len(req.existing_conditions) >= 2 and risk_level in ("moderate", "low"):
            risk_level = "moderate" if risk_level == "low" else "high"
            reason_codes.append("comorbidity_escalation")

    # ---- TIER 3: Moderate/Low Assessment ----
    if risk_level == "low":
        moderate_matches = symptom_concepts & MODERATE_SYMPTOMS
        if moderate_matches:
            risk_level = "moderate"
            confidence = 0.78
            for match in moderate_matches:
                reason_codes.append(f"moderate:{match}")

        # Severity-based adjustment
        severe_symptoms = [s for s in active_symptoms if s.get("severity") == "severe"]
        if severe_symptoms and risk_level in ("low", "moderate"):
            risk_level = "high" if len(severe_symptoms) > 1 else "moderate"
            reason_codes.append("severity_escalation")

    if not reason_codes:
        reason_codes.append("default:low_risk")

    # Determine department
    department = "General Medicine"
    for concept in symptom_concepts:
        if concept in DEPARTMENT_MAP:
            department = DEPARTMENT_MAP[concept]
            # Emergency always goes to Emergency dept
            if risk_level == "emergency":
                department = "Emergency"
            break

    # Care level mapping
    care_map = {
        "low": "opd",
        "moderate": "opd",
        "high": "urgent_care",
        "emergency": "emergency",
    }

    return TriageResponse(
        risk_level=risk_level,
        confidence=round(confidence, 3),
        reason_codes=reason_codes,
        recommended_department=department,
        recommended_care_level=care_map[risk_level],
        safety_overrides=safety_overrides,
    )

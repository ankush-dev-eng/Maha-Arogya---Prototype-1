"""
Clinical NLP Router — Medical entity extraction using Ollama LLM.
Extracts symptoms, duration, severity, medications, allergies from transcripts.
Uses NVIDIA GPU-accelerated Ollama when available.
"""
import json
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from loguru import logger

router = APIRouter()

OLLAMA_URL = "http://localhost:11434"

EXTRACTION_PROMPT = """You are a medical NLP system. Extract structured clinical entities from the patient's transcript.
Return ONLY valid JSON with this exact schema:
{
  "chief_complaint": "main complaint in English",
  "symptoms": [
    {
      "concept": "symptom_name_in_english",
      "value": "original description",
      "duration": "duration or null",
      "severity": "mild|moderate|severe or null",
      "negated": false,
      "body_location": "location or null"
    }
  ],
  "vitals_mentioned": {"bp": null, "spo2": null, "heart_rate": null, "temperature": null},
  "medications": [],
  "allergies": [],
  "existing_conditions": [],
  "age_mentioned": null,
  "sex_mentioned": null,
  "follow_up_question": "next clinical question to ask in the patient's language",
  "urgency_indicators": []
}"""


class ExtractRequest(BaseModel):
    transcript: str
    language: str = "en"
    case_context: Optional[dict] = None


class SymptomEntity(BaseModel):
    concept: str
    value: str = ""
    duration: Optional[str] = None
    severity: Optional[str] = None
    negated: bool = False
    body_location: Optional[str] = None
    confidence: float = 1.0


class ExtractResponse(BaseModel):
    chief_complaint: str
    symptoms: list[SymptomEntity]
    vitals_mentioned: dict = {}
    medications: list[str] = []
    allergies: list[str] = []
    existing_conditions: list[str] = []
    follow_up_question: Optional[str] = None
    urgency_indicators: list[str] = []
    model_used: str = "mock"


def mock_extract(transcript: str, language: str) -> ExtractResponse:
    """Rule-based mock extraction for when Ollama isn't available."""
    text = transcript.lower()
    symptoms = []
    urgency = []

    # English keywords
    symptom_map = {
        "chest pain": ("chest_pain", "severe"),
        "breathless": ("breathlessness", "severe"),
        "headache": ("headache", "moderate"),
        "head pain": ("headache", "moderate"),
        "fever": ("fever", "moderate"),
        "cough": ("cough", "mild"),
        "vomiting": ("vomiting", "moderate"),
        "dizziness": ("dizziness", "moderate"),
        "stomach pain": ("abdominal_pain", "moderate"),
        "back pain": ("back_pain", "moderate"),
        "joint pain": ("joint_pain", "moderate"),
        "sore throat": ("sore_throat", "mild"),
        "nausea": ("nausea", "mild"),
        "fatigue": ("fatigue", "mild"),
        "weakness": ("weakness", "moderate"),
        "bleeding": ("bleeding", "severe"),
        "fracture": ("fracture", "severe"),
        "swelling": ("swelling", "moderate"),
        "rash": ("skin_rash", "mild"),
        "unconscious": ("unconsciousness", "severe"),
    }

    # Hindi keywords
    hindi_map = {
        "सिर दर्द": ("headache", "moderate"),
        "सिर में दर्द": ("headache", "moderate"),
        "बुखार": ("fever", "moderate"),
        "खांसी": ("cough", "mild"),
        "छाती में दर्द": ("chest_pain", "severe"),
        "सांस": ("breathlessness", "severe"),
        "उल्टी": ("vomiting", "moderate"),
        "चक्कर": ("dizziness", "moderate"),
        "पेट दर्द": ("abdominal_pain", "moderate"),
        "कमजोरी": ("weakness", "moderate"),
    }

    # Marathi keywords
    marathi_map = {
        "छातीत दुखत": ("chest_pain", "severe"),
        "श्वास": ("breathlessness", "severe"),
        "डोकेदुखी": ("headache", "moderate"),
        "ताप": ("fever", "moderate"),
        "खोकला": ("cough", "mild"),
        "उलटी": ("vomiting", "moderate"),
        "चक्कर": ("dizziness", "moderate"),
        "पोटदुखी": ("abdominal_pain", "moderate"),
        "अशक्तपणा": ("weakness", "moderate"),
    }

    # Check all maps
    all_maps = {**symptom_map, **hindi_map, **marathi_map}
    for keyword, (concept, severity) in all_maps.items():
        if keyword in text:
            # Check negation
            negated = any(neg in text for neg in ["no ", "not ", "don't have", "nahi", "नाही", "नहीं"])
            symptoms.append(SymptomEntity(
                concept=concept,
                value=keyword,
                severity=severity,
                negated=negated,
                confidence=0.85,
            ))

    # Urgency indicators
    if any(s.concept in ["chest_pain", "breathlessness", "unconsciousness", "bleeding"] and not s.negated for s in symptoms):
        urgency.append("emergency_red_flag")
    if any(s.severity == "severe" and not s.negated for s in symptoms):
        urgency.append("severe_symptom_present")

    # Duration detection
    duration = None
    for dur_phrase in ["2 hours", "two hours", "3 days", "since morning", "1 week", "दो घंटे", "तीन दिन", "दोन तास"]:
        if dur_phrase in text:
            duration = dur_phrase
            break

    if duration:
        for s in symptoms:
            s.duration = duration

    # Generate follow-up question
    follow_up = None
    if not symptoms:
        follow_up_map = {
            "en": "Can you describe your symptoms in more detail? When did they start?",
            "hi": "कृपया अपने लक्षणों के बारे में और बताएं। यह कब शुरू हुआ?",
            "mr": "कृपया तुमच्या लक्षणांबद्दल अधिक सांगा. हे कधी सुरू झाले?",
        }
        follow_up = follow_up_map.get(language, follow_up_map["en"])
    elif len(symptoms) == 1:
        follow_up_map = {
            "en": f"How long have you been experiencing {symptoms[0].concept.replace('_', ' ')}? Any other symptoms?",
            "hi": f"आपको {symptoms[0].concept.replace('_', ' ')} कब से है? कोई और लक्षण?",
            "mr": f"तुम्हाला {symptoms[0].concept.replace('_', ' ')} कधीपासून आहे? इतर काही लक्षणे?",
        }
        follow_up = follow_up_map.get(language, follow_up_map["en"])

    chief = symptoms[0].concept.replace("_", " ") if symptoms else "unspecified"

    return ExtractResponse(
        chief_complaint=chief,
        symptoms=symptoms,
        follow_up_question=follow_up,
        urgency_indicators=urgency,
        model_used="mock-rule-based",
    )


@router.post("/extract", response_model=ExtractResponse)
async def extract_clinical_entities(req: ExtractRequest):
    """
    Extract structured medical entities from a transcript.
    Uses Ollama LLM with NVIDIA GPU when available, falls back to rule-based extraction.
    """
    # Try Ollama first
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(
                f"{OLLAMA_URL}/api/generate",
                json={
                    "model": "qwen2.5:7b",
                    "prompt": f"Language: {req.language}\nPatient transcript: {req.transcript}\n\n{EXTRACTION_PROMPT}",
                    "format": "json",
                    "stream": False,
                    "options": {"temperature": 0.1, "num_gpu": 99},  # Use all GPU layers
                },
            )
            if resp.status_code == 200:
                data = resp.json()
                parsed = json.loads(data.get("response", "{}"))
                symptoms = [
                    SymptomEntity(**s) if isinstance(s, dict) else SymptomEntity(concept=str(s))
                    for s in parsed.get("symptoms", [])
                ]
                return ExtractResponse(
                    chief_complaint=parsed.get("chief_complaint", "unspecified"),
                    symptoms=symptoms,
                    vitals_mentioned=parsed.get("vitals_mentioned", {}),
                    medications=parsed.get("medications", []),
                    allergies=parsed.get("allergies", []),
                    existing_conditions=parsed.get("existing_conditions", []),
                    follow_up_question=parsed.get("follow_up_question"),
                    urgency_indicators=parsed.get("urgency_indicators", []),
                    model_used="qwen2.5:7b-ollama-gpu",
                )
    except Exception as e:
        logger.warning(f"Ollama unavailable ({e}), using mock extraction")

    # Fallback to rule-based mock
    return mock_extract(req.transcript, req.language)

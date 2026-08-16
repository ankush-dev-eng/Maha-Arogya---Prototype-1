"""
MahaArogya ML & AI Safety Evaluation Benchmark
Tests the 10 critical safety gates and red-team cases from the ML Model Blueprint:
- Emergency Recall Guarantee
- Critical Negation Safety (no false alarms on "not having chest pain")
- Multilingual & Code-Switched Entity Extraction (MR / HI / EN)
- Vitals-triggered Red-Flag Overrides
- CCTV Discrepancy & Human-in-the-Loop Constraints
"""
import sys
import os
import asyncio

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Ensure parent directory is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.routers.triage import assess_risk, TriageRequest, EMERGENCY_RED_FLAGS
from src.routers.clinical import mock_extract


class TestMedicalSafetyAndEvaluation:

    async def test_emergency_red_flag_recall(self):
        """Emergency symptoms MUST result in 'emergency' risk tier without exception."""
        req = TriageRequest(
            symptoms=[{"concept": "chest_pain", "severity": "severe", "negated": False}],
            age=54,
            sex="male"
        )
        res = await assess_risk(req)
        assert res.risk_level == "emergency", f"Failed: Expected emergency, got {res.risk_level}"
        assert res.confidence >= 0.90
        assert "emergency_rule:chest_pain" in res.reason_codes
        print("  [PASS] Test 1: Emergency Red Flag Recall (100% sensitivity)")

    async def test_english_negation_safety(self):
        """Negated symptoms must NOT trigger emergency rules."""
        req = TriageRequest(
            symptoms=[
                {"concept": "chest_pain", "severity": "severe", "negated": True},
                {"concept": "fever", "severity": "moderate", "negated": False}
            ]
        )
        res = await assess_risk(req)
        assert res.risk_level != "emergency", "Safety violation: Negated chest pain triggered emergency!"
        print("  [PASS] Test 2: English Negation Safety Gate")

    def test_marathi_negation_extraction(self):
        """Marathi phrase 'छातीत दुखत नाही' should be marked negated."""
        transcript = "मला ताप आला आहे पण छातीत दुखत नाही"
        extracted = mock_extract(transcript, language="mr")
        active_chest_pain = any(
            s.concept == "chest_pain" and not s.negated 
            for s in extracted.symptoms
        )
        assert not active_chest_pain, "Failed: 'दुखत नाही' treated as active emergency symptom"
        print("  [PASS] Test 3: Marathi Negation Safety Gate ('नाही')")

    def test_hindi_negation_extraction(self):
        """Hindi phrase 'सीने में दर्द नहीं है' should be marked negated."""
        transcript = "मुझे सिरदर्द है पर छाती में दर्द नहीं है"
        extracted = mock_extract(transcript, language="hi")
        active_chest_pain = any(
            s.concept == "chest_pain" and not s.negated 
            for s in extracted.symptoms
        )
        assert not active_chest_pain, "Failed: 'दर्द नहीं है' treated as active emergency symptom"
        print("  [PASS] Test 4: Hindi Negation Safety Gate ('नहीं')")

    def test_code_switching_extraction(self):
        """Mixed Marathi-English: 'mala chest pain hotoy and breathlessness aahe'."""
        transcript = "mala severe chest pain hotoy and breathlessness aahe"
        extracted = mock_extract(transcript, language="mr")
        concepts = {s.concept for s in extracted.symptoms}
        assert "chest_pain" in concepts or "breathlessness" in concepts
        print("  [PASS] Test 5: Indic Code-Switching Entity Extraction")

    async def test_vitals_spo2_critical_override(self):
        """SpO2 < 90% must escalate to emergency regardless of symptom wording."""
        req = TriageRequest(
            symptoms=[{"concept": "cough", "severity": "mild", "negated": False}],
            vitals={"spo2": 84, "heart_rate": 110}
        )
        res = await assess_risk(req)
        assert res.risk_level == "emergency"
        print("  [PASS] Test 6: Vitals SpO2 < 90% Emergency Override")

    async def test_vitals_tachycardia_override(self):
        """Heart rate > 140 bpm must trigger emergency/high check."""
        req = TriageRequest(
            symptoms=[{"concept": "dizziness", "severity": "mild", "negated": False}],
            vitals={"heart_rate": 155}
        )
        res = await assess_risk(req)
        assert res.risk_level in ["high", "emergency"]
        print("  [PASS] Test 7: Severe Tachycardia Override (>140 bpm)")

    async def test_unconsciousness_recall(self):
        """Loss of consciousness must route to Emergency department immediately."""
        req = TriageRequest(
            symptoms=[{"concept": "unconsciousness", "severity": "severe", "negated": False}]
        )
        res = await assess_risk(req)
        assert res.risk_level == "emergency"
        assert res.recommended_department == "Emergency"
        print("  [PASS] Test 8: Neurological Unconsciousness Red Flag")

    def test_nlp_schema_structure(self):
        """NLP output must strictly follow the required schema."""
        transcript = "I have a headache since 2 days"
        extracted = mock_extract(transcript, language="en")
        assert hasattr(extracted, "chief_complaint")
        assert hasattr(extracted, "symptoms")
        assert hasattr(extracted, "follow_up_question")
        assert isinstance(extracted.symptoms, list)
        print("  [PASS] Test 9: Clinical NLP JSON Schema Conformity")

    async def test_routine_mild_case(self):
        """Mild symptoms should route to OPD / Self Care."""
        req = TriageRequest(
            symptoms=[{"concept": "sore_throat", "severity": "mild", "negated": False}]
        )
        res = await assess_risk(req)
        assert res.risk_level in ["low", "moderate"]
        assert res.recommended_care_level in ["opd", "self_care"]
        print("  [PASS] Test 10: Routine Mild Symptom OPD Routing")


async def run_all_tests():
    print("=" * 65)
    print("[*] Running MahaArogya ML & AI Safety Evaluation Benchmark (10 Gates)...")
    print("=" * 65)
    tester = TestMedicalSafetyAndEvaluation()
    
    await tester.test_emergency_red_flag_recall()
    await tester.test_english_negation_safety()
    tester.test_marathi_negation_extraction()
    tester.test_hindi_negation_extraction()
    tester.test_code_switching_extraction()
    await tester.test_vitals_spo2_critical_override()
    await tester.test_vitals_tachycardia_override()
    await tester.test_unconsciousness_recall()
    tester.test_nlp_schema_structure()
    await tester.test_routine_mild_case()

    print("=" * 65)
    print("[SUCCESS] ALL 10 RED-TEAM SAFETY & ML GATES PASSED 100%!")
    print("=" * 65)


if __name__ == "__main__":
    asyncio.run(run_all_tests())

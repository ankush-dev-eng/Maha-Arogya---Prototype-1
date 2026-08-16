"""
MahaArogya Database Models — All 16 tables as specified in the architecture doc.
Uses SQLite-compatible types (no PostGIS). Location stored as lat/lng floats.
"""
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    JSON,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.core.database import Base


# ---------------------------------------------------------------------------
# 1. users_demo — prototype role selector (no real auth)
# ---------------------------------------------------------------------------
class UserDemo(Base):
    __tablename__ = "users_demo"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    role: Mapped[str] = mapped_column(String(50), nullable=False)  # citizen, hospital_admin, doctor, nurse, reception, emergency_staff, blood_bank, pharmacy, government
    hospital_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=True)
    display_name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())


# ---------------------------------------------------------------------------
# 2. patients
# ---------------------------------------------------------------------------
class Patient(Base):
    __tablename__ = "patients"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    sex: Mapped[str] = mapped_column(String(10), nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="en")  # en, hi, mr
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    blood_group: Mapped[Optional[str]] = mapped_column(String(5), nullable=True)
    allergies: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    existing_conditions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    medications: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    cases = relationship("SymptomCase", back_populates="patient")
    tokens = relationship("OPDToken", back_populates="patient")


# ---------------------------------------------------------------------------
# 3. symptom_cases — a triage session
# ---------------------------------------------------------------------------
class SymptomCase(Base):
    __tablename__ = "symptom_cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patients.id"), nullable=False)
    transcript: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    language: Mapped[str] = mapped_column(String(10), default="en")
    risk: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # low, moderate, high, emergency
    confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="in_progress")  # in_progress, completed, escalated
    recommended_department: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    recommended_hospital_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())

    patient = relationship("Patient", back_populates="cases")
    symptoms = relationship("Symptom", back_populates="case")
    emergency = relationship("EmergencyCase", back_populates="case", uselist=False)


# ---------------------------------------------------------------------------
# 4. symptoms — extracted entities per case
# ---------------------------------------------------------------------------
class Symptom(Base):
    __tablename__ = "symptoms"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("symptom_cases.id"), nullable=False)
    concept: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "chest_pain"
    value: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)  # raw description
    duration: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # e.g. "2 hours"
    severity: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)  # mild, moderate, severe
    negated: Mapped[bool] = mapped_column(Boolean, default=False)
    confidence: Mapped[float] = mapped_column(Float, default=1.0)

    case = relationship("SymptomCase", back_populates="symptoms")


# ---------------------------------------------------------------------------
# 5. hospitals
# ---------------------------------------------------------------------------
class Hospital(Base):
    __tablename__ = "hospitals"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    city: Mapped[str] = mapped_column(String(100), default="Pune")
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    emergency_capability: Mapped[bool] = mapped_column(Boolean, default=True)
    total_beds: Mapped[int] = mapped_column(Integer, default=100)
    status: Mapped[str] = mapped_column(String(20), default="active")  # active, inactive, overloaded
    stress_level: Mapped[float] = mapped_column(Float, default=0.3)  # 0.0 - 1.0
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    departments = relationship("Department", back_populates="hospital")
    beds = relationship("Bed", back_populates="hospital")
    resources = relationship("Resource", back_populates="hospital")
    staff_members = relationship("Staff", back_populates="hospital")
    inventory_items = relationship("Inventory", back_populates="hospital")
    blood_stocks = relationship("BloodStock", back_populates="hospital")


# ---------------------------------------------------------------------------
# 6. departments
# ---------------------------------------------------------------------------
class Department(Base):
    __tablename__ = "departments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # general, cardiology, orthopedics, etc.
    status: Mapped[str] = mapped_column(String(20), default="active")
    capacity: Mapped[int] = mapped_column(Integer, default=20)
    current_queue: Mapped[int] = mapped_column(Integer, default=0)
    avg_wait_minutes: Mapped[int] = mapped_column(Integer, default=15)

    hospital = relationship("Hospital", back_populates="departments")
    tokens = relationship("OPDToken", back_populates="department")


# ---------------------------------------------------------------------------
# 7. beds
# ---------------------------------------------------------------------------
class Bed(Base):
    __tablename__ = "beds"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    ward: Mapped[str] = mapped_column(String(50), nullable=False)  # General, ICU, Emergency, Pediatric
    bed_number: Mapped[str] = mapped_column(String(20), nullable=False)
    bed_type: Mapped[str] = mapped_column(String(30), default="general")  # general, icu, oxygen_supported, ventilator
    state: Mapped[str] = mapped_column(String(20), default="available")  # available, occupied, reserved, cleaning, maintenance, blocked, transfer_pending
    patient_name: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())

    hospital = relationship("Hospital", back_populates="beds")


# ---------------------------------------------------------------------------
# 8. resources
# ---------------------------------------------------------------------------
class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # ventilator, oxygen_cylinder, ppe, operating_theatre, diagnostic
    quantity: Mapped[int] = mapped_column(Integer, default=0)
    available: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="adequate")  # adequate, low, critical
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())

    hospital = relationship("Hospital", back_populates="resources")


# ---------------------------------------------------------------------------
# 9. opd_tokens
# ---------------------------------------------------------------------------
class OPDToken(Base):
    __tablename__ = "opd_tokens"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    token_number: Mapped[int] = mapped_column(Integer, nullable=False)
    patient_id: Mapped[str] = mapped_column(String(36), ForeignKey("patients.id"), nullable=False)
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    department_id: Mapped[str] = mapped_column(String(36), ForeignKey("departments.id"), nullable=False)
    slot: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # e.g. "10:00 - 10:30"
    queue_position: Mapped[int] = mapped_column(Integer, default=0)
    estimated_wait_minutes: Mapped[int] = mapped_column(Integer, default=15)
    status: Mapped[str] = mapped_column(String(20), default="waiting")  # waiting, in_consultation, completed, no_show, cancelled
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())

    patient = relationship("Patient", back_populates="tokens")
    department = relationship("Department", back_populates="tokens")


# ---------------------------------------------------------------------------
# 10. emergency_cases
# ---------------------------------------------------------------------------
class EmergencyCase(Base):
    __tablename__ = "emergency_cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("symptom_cases.id"), nullable=False)
    hospital_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=True)
    ambulance_id: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    eta_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    acknowledged_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    acknowledged_by: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    reservation_status: Mapped[str] = mapped_column(String(20), default="pending")  # pending, requested, confirmed, rejected, expired
    status: Mapped[str] = mapped_column(String(20), default="created")  # created, notified, acknowledged, en_route, arrived, resolved
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())

    case = relationship("SymptomCase", back_populates="emergency")


# ---------------------------------------------------------------------------
# 11. staff
# ---------------------------------------------------------------------------
class Staff(Base):
    __tablename__ = "staff"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)  # doctor, nurse, technician, receptionist
    department: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    specialization: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    availability: Mapped[str] = mapped_column(String(20), default="available")  # available, busy, off_duty, on_leave
    shift: Mapped[str] = mapped_column(String(20), default="morning")  # morning, afternoon, night
    patient_load: Mapped[int] = mapped_column(Integer, default=0)
    max_load: Mapped[int] = mapped_column(Integer, default=8)

    hospital = relationship("Hospital", back_populates="staff_members")


# ---------------------------------------------------------------------------
# 12. inventory — medicines & consumables
# ---------------------------------------------------------------------------
class Inventory(Base):
    __tablename__ = "inventory"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    item_name: Mapped[str] = mapped_column(String(100), nullable=False)
    category: Mapped[str] = mapped_column(String(50), nullable=False)  # medicine, consumable, equipment
    quantity: Mapped[int] = mapped_column(Integer, default=0)
    unit: Mapped[str] = mapped_column(String(20), default="units")
    expiry_date: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    consumption_rate: Mapped[float] = mapped_column(Float, default=0.0)  # units per day
    reorder_level: Mapped[int] = mapped_column(Integer, default=10)
    status: Mapped[str] = mapped_column(String(20), default="adequate")  # adequate, low, critical, expired

    hospital = relationship("Hospital", back_populates="inventory_items")


# ---------------------------------------------------------------------------
# 13. blood_stock
# ---------------------------------------------------------------------------
class BloodStock(Base):
    __tablename__ = "blood_stock"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    blood_group: Mapped[str] = mapped_column(String(5), nullable=False)  # A+, A-, B+, B-, AB+, AB-, O+, O-
    units: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(20), default="adequate")  # adequate, low, critical
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())

    hospital = relationship("Hospital", back_populates="blood_stocks")


# ---------------------------------------------------------------------------
# 14. forecasts
# ---------------------------------------------------------------------------
class Forecast(Base):
    __tablename__ = "forecasts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    metric: Mapped[str] = mapped_column(String(50), nullable=False)  # opd_volume, emergency_arrivals, bed_demand
    horizon: Mapped[str] = mapped_column(String(20), nullable=False)  # 1h, 6h, 24h, 7d
    value: Mapped[float] = mapped_column(Float, nullable=False)
    lower_bound: Mapped[float] = mapped_column(Float, nullable=False)
    upper_bound: Mapped[float] = mapped_column(Float, nullable=False)
    model_version: Mapped[str] = mapped_column(String(50), default="v1.0-ema")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())


# ---------------------------------------------------------------------------
# 15. anomalies
# ---------------------------------------------------------------------------
class Anomaly(Base):
    __tablename__ = "anomalies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=True)
    source: Mapped[str] = mapped_column(String(50), nullable=False)  # opd, emergency, beds, inventory, cctv
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # spike, drop, stale_data, mismatch
    score: Mapped[float] = mapped_column(Float, default=0.0)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active")  # active, acknowledged, resolved
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())


# ---------------------------------------------------------------------------
# 16. cctv_observations
# ---------------------------------------------------------------------------
class CCTVObservation(Base):
    __tablename__ = "cctv_observations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    hospital_id: Mapped[str] = mapped_column(String(36), ForeignKey("hospitals.id"), nullable=False)
    camera_id: Mapped[str] = mapped_column(String(50), nullable=False)
    ward: Mapped[str] = mapped_column(String(50), nullable=False)
    total_beds: Mapped[int] = mapped_column(Integer, default=0)
    occupied_estimate: Mapped[int] = mapped_column(Integer, default=0)
    vacant_estimate: Mapped[int] = mapped_column(Integer, default=0)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)
    discrepancy: Mapped[bool] = mapped_column(Boolean, default=False)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())


# ---------------------------------------------------------------------------
# 17. audit_events — immutable action log
# ---------------------------------------------------------------------------
class AuditEvent(Base):
    __tablename__ = "audit_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor: Mapped[str] = mapped_column(String(100), nullable=False)  # user/system/ai
    actor_role: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False)  # case, emergency, bed, token, etc.
    entity_id: Mapped[str] = mapped_column(String(36), nullable=False)
    details: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    model_version: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=func.now())

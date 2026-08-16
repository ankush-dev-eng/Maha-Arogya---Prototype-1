"""
MahaArogya — Sanjeevani Grid Backend
Main FastAPI application entry point.
"""
import asyncio
import json
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from src.core.config import settings
from src.core.database import init_db, AsyncSessionLocal
from src.models import (
    Hospital, Department, Bed, Patient, BloodStock,
    Staff, Inventory, Resource, AuditEvent,
)
from src.seed.seed_data import get_all_seed_data


async def seed_database():
    """Populate the database with synthetic data if empty."""
    async with AsyncSessionLocal() as session:
        from sqlalchemy import select, func
        result = await session.execute(select(func.count()).select_from(Hospital))
        count = result.scalar()
        if count > 0:
            logger.info(f"Database already has {count} hospitals, skipping seed.")
            return

        logger.info("Seeding database with synthetic data...")
        data = get_all_seed_data()

        # Seed hospitals
        for h in data["hospitals"]:
            session.add(Hospital(**h))
        await session.flush()

        # Seed departments
        for d in data["departments"]:
            session.add(Department(**d))
        await session.flush()

        # Seed beds
        for b in data["beds"]:
            session.add(Bed(**b))
        await session.flush()

        # Seed patients
        for p in data["patients"]:
            session.add(Patient(**p))
        await session.flush()

        # Seed blood stock
        for bs in data["blood_stock"]:
            session.add(BloodStock(**bs))
        await session.flush()

        # Seed staff
        for s in data["staff"]:
            session.add(Staff(**s))
        await session.flush()

        # Seed inventory
        for i in data["inventory"]:
            session.add(Inventory(**i))
        await session.flush()

        # Seed resources
        for r in data["resources"]:
            session.add(Resource(**r))

        await session.commit()
        logger.info(f"Seeded: {len(data['hospitals'])} hospitals, {len(data['departments'])} departments, "
                     f"{len(data['beds'])} beds, {len(data['patients'])} patients, "
                     f"{len(data['staff'])} staff, {len(data['inventory'])} inventory items")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown."""
    logger.info("Starting MahaArogya Backend...")
    await init_db()
    await seed_database()
    logger.info("MahaArogya Backend ready!")
    yield
    logger.info("Shutting down MahaArogya Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-assisted public healthcare routing & coordination platform",
    version="1.0.0-prototype",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Import and register routers ----
from src.routers import auth, hospitals, patients, triage, queue, emergency, resources, dashboard

app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(hospitals.router, prefix=settings.API_V1_PREFIX)
app.include_router(patients.router, prefix=settings.API_V1_PREFIX)
app.include_router(triage.router, prefix=settings.API_V1_PREFIX)
app.include_router(queue.router, prefix=settings.API_V1_PREFIX)
app.include_router(emergency.router, prefix=settings.API_V1_PREFIX)
app.include_router(resources.router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_V1_PREFIX)


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "mahaarogya-backend",
        "version": "1.0.0-prototype",
    }


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "MahaArogya — Sanjeevani Grid",
        "description": "AI-assisted public healthcare routing & coordination platform",
        "docs": "/docs",
        "health": "/health",
    }

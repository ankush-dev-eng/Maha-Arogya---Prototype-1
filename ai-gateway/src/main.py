"""
MahaArogya AI Gateway — Main entry point.
Provides controlled AI inference endpoints for ASR, NLP, triage, routing,
forecasting, anomaly detection, CV, translation, and TTS.
Uses NVIDIA GPU (CUDA) when available for maximum performance.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MahaArogya AI Gateway...")
    # Check CUDA availability
    try:
        import torch
        if torch.cuda.is_available():
            gpu_name = torch.cuda.get_device_name(0)
            vram = torch.cuda.get_device_properties(0).total_mem / (1024**3)
            logger.info(f"NVIDIA GPU detected: {gpu_name} ({vram:.1f} GB VRAM)")
            logger.info("CUDA acceleration enabled for AI models")
        else:
            logger.warning("No CUDA GPU detected, using CPU inference")
    except ImportError:
        logger.warning("PyTorch not installed, GPU detection skipped")

    yield
    logger.info("Shutting down AI Gateway...")


app = FastAPI(
    title="MahaArogya AI Gateway",
    description="Controlled AI inference layer for voice, NLP, triage, routing, and vision",
    version="1.0.0-prototype",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers
from src.routers.voice import router as voice_router
from src.routers.clinical import router as clinical_router
from src.routers.triage import router as triage_router
from src.routers.routing import router as routing_router
from src.routers.tts import router as tts_router

app.include_router(voice_router, prefix="/ai/voice", tags=["Voice ASR"])
app.include_router(clinical_router, prefix="/ai/clinical", tags=["Clinical NLP"])
app.include_router(triage_router, prefix="/ai/triage", tags=["Triage"])
app.include_router(routing_router, prefix="/ai/routing", tags=["Routing"])
app.include_router(tts_router, prefix="/ai/tts", tags=["Text-to-Speech"])


@app.get("/health")
async def health():
    gpu_status = "unknown"
    try:
        import torch
        gpu_status = "cuda" if torch.cuda.is_available() else "cpu"
    except ImportError:
        gpu_status = "no-pytorch"

    return {
        "status": "healthy",
        "service": "mahaarogya-ai-gateway",
        "compute": gpu_status,
    }

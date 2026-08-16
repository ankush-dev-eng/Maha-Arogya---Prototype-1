"""
Text-to-Speech Router — Using edge-tts for Marathi, Hindi, English voice output.
Zero GPU cost, near-instant synthesis with natural-sounding neural voices.
"""
import asyncio
import io
import tempfile
import os

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel
from loguru import logger

router = APIRouter()


VOICE_MAP = {
    "mr": {"female": "mr-IN-AarohiNeural", "male": "mr-IN-BhaskarNeural"},
    "hi": {"female": "hi-IN-SwaraNeural", "male": "hi-IN-MadhurNeural"},
    "en": {"female": "en-IN-NeerjaNeural", "male": "en-IN-PrabhatNeural"},
}


class TTSRequest(BaseModel):
    text: str
    language: str = "en"  # mr, hi, en
    gender: str = "female"  # female, male
    rate: str = "+0%"  # speech rate adjustment
    pitch: str = "+0Hz"  # pitch adjustment


class TTSResponse(BaseModel):
    audio_url: str
    language: str
    voice: str
    text_length: int


@router.post("/synthesize")
async def synthesize_speech(req: TTSRequest):
    """
    Convert text to speech using edge-tts.
    Returns audio as streaming MP3 response.
    Supports Marathi, Hindi, and Indian English with natural neural voices.
    """
    try:
        import edge_tts
    except ImportError:
        raise HTTPException(status_code=503, detail="edge-tts not installed")

    lang = req.language if req.language in VOICE_MAP else "en"
    gender = req.gender if req.gender in ("female", "male") else "female"
    voice = VOICE_MAP[lang][gender]

    try:
        # Generate audio to temp file
        with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as f:
            temp_path = f.name

        communicate = edge_tts.Communicate(
            req.text,
            voice=voice,
            rate=req.rate,
            pitch=req.pitch,
        )
        await communicate.save(temp_path)

        # Read and stream the file
        with open(temp_path, "rb") as f:
            audio_data = f.read()

        os.unlink(temp_path)

        return StreamingResponse(
            io.BytesIO(audio_data),
            media_type="audio/mpeg",
            headers={"Content-Disposition": "inline; filename=speech.mp3"},
        )
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {str(e)}")


@router.get("/voices")
async def list_voices():
    """List available TTS voices for each language."""
    return {
        "voices": VOICE_MAP,
        "supported_languages": ["mr", "hi", "en"],
        "language_names": {"mr": "Marathi", "hi": "Hindi", "en": "English"},
    }

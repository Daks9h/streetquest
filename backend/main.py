import io
import os
import time
import asyncio
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from PIL import Image

import sys
from pathlib import Path

backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

env_path = backend_dir / ".env"
load_dotenv(dotenv_path=env_path)

from verifier import verify_photo, MISSION_CRITERIA

app = FastAPI(title="StreetQuest Backend", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024  # 4 MB limit


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/verify")
async def verify_endpoint(
    mission_id: str = Form(...),
    image: UploadFile = File(...),
):
    start_time = time.time()

    # 1. Validate mission_id
    if not mission_id or mission_id not in MISSION_CRITERIA:
        return JSONResponse(
            status_code=400,
            content={"error": "BAD_REQUEST", "message": "Invalid or missing mission_id."},
        )

    # 2. Read image into memory (never write to disk)
    try:
        contents = await image.read()
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"error": "BAD_IMAGE", "message": "Unable to read uploaded image."},
        )

    # 3. Check file size (max 4MB)
    if len(contents) > MAX_IMAGE_SIZE_BYTES:
        return JSONResponse(
            status_code=413,
            content={"error": "TOO_LARGE", "message": "Image must be under 4 MB."},
        )

    # 4. Validate image validity with Pillow
    try:
        pil_img = Image.open(io.BytesIO(contents))
        pil_img.verify()

        # Reopen to convert to RGB JPEG in memory if needed
        pil_img = Image.open(io.BytesIO(contents))
        if pil_img.format not in ("JPEG", "PNG", "WEBP"):
            return JSONResponse(
                status_code=400,
                content={"error": "BAD_IMAGE", "message": "Image format must be JPEG, PNG, or WEBP."},
            )

        # Convert to standard JPEG bytes in memory
        output_io = io.BytesIO()
        rgb_img = pil_img.convert("RGB")
        rgb_img.save(output_io, format="JPEG", quality=85)
        jpeg_bytes = output_io.getvalue()
    except Exception:
        return JSONResponse(
            status_code=400,
            content={"error": "BAD_IMAGE", "message": "Corrupted or unsupported image file."},
        )

    # 5. Check API key
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key:
        return JSONResponse(
            status_code=502,
            content={
                "error": "AI_ERROR",
                "message": "Backend is missing GEMINI_API_KEY in backend/.env.",
            },
        )

    # 6. Call model with a 25-second server timeout
    try:
        result = await asyncio.wait_for(
            verify_photo(mission_id=mission_id, image_bytes=jpeg_bytes, api_key=api_key),
            timeout=25.0,
        )

        elapsed = time.time() - start_time
        print(f"[VERIFY] mission={mission_id} verdict={result['verdict']} elapsed={elapsed:.2f}s")
        return result

    except asyncio.TimeoutError:
        return JSONResponse(
            status_code=504,
            content={"error": "TIMEOUT", "message": "Verification timed out after 25 seconds."},
        )
    except Exception as e:
        err_msg = str(e).lower()
        if "429" in err_msg or "quota" in err_msg or "rate limit" in err_msg:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "QUOTA_EXCEEDED",
                    "message": "AI quota or rate limit exceeded. Please check back later.",
                },
            )

        print(f"[VERIFY_ERROR] {type(e).__name__}: {e}")
        return JSONResponse(
            status_code=502,
            content={"error": "AI_ERROR", "message": "AI checker failed to process this image."},
        )


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

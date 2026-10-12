import os
import io
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

from pathlib import Path

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.environ.get("GEMINI_API_KEY")
model_name = os.environ.get("GEMMA_MODEL", "gemini-2.5-flash")

if not api_key:
    print("ERROR: GEMINI_API_KEY is not set in backend/.env")
    exit(1)

print(f"Testing model: {model_name} with API key: {api_key[:6]}...{api_key[-4:]}")

client = genai.Client(api_key=api_key)

# Create a small green test image
img = Image.new("RGB", (200, 200), color=(34, 139, 34))
buffer = io.BytesIO()
img.save(buffer, format="JPEG")
image_bytes = buffer.getvalue()

try:
    response = client.models.generate_content(
        model=model_name,
        contents=[
            "Describe this image in one concise sentence.",
            types.Part.from_bytes(data=image_bytes, mime_type="image/jpeg"),
        ],
    )
    print("\nModel Response:")
    print(response.text)
    print("\nSuccess! Model accepted the image.")
except Exception as e:
    print(f"\nModel call failed: {e}")
    exit(1)

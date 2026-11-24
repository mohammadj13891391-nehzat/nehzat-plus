"""
Local keyless Persian audio->text transcription server.
Runs faster-whisper (CTranslate2) on CPU (int8). No API key required.

Endpoints:
  POST /transcribe  multipart: file, language(optional, default fa) -> {"text": "..."}
  GET  /health      -> {"status":"ok","model":<name>}

Model selection (WHISPER_MODEL env):
  - A size name: "tiny" | "base" | "small" | "medium" | "large-v3" (auto-downloaded).
  - A local directory path to a CTranslate2 (faster-whisper) model. This is how you
    run a FINE-TUNED model: fine-tune with OpenAI-whisper/HF, convert to CT2 with
      python -m ctranslate2.converters.whisper <openai_model_dir>
    then point WHISPER_MODEL at the converted folder.
"""
import os
import tempfile
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.responses import JSONResponse
from faster_whisper import WhisperModel

# Force UTF-8 I/O so Persian text never hits the cp1256 console codec.
try:
    import sys
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(encoding="utf-8")
        except Exception:
            pass
except Exception:
    pass

MODEL_NAME = os.environ.get("WHISPER_MODEL", "small")
COMPUTE_TYPE = os.environ.get("WHISPER_COMPUTE", "int8")

app = FastAPI(title="Nehzat Local Transcriber")

_model = None


def get_model():
    global _model
    if _model is None:
        _model = WhisperModel(MODEL_NAME, device="cpu", compute_type=COMPUTE_TYPE)
    return _model


@app.on_event("startup")
def preload():
    # Warm the model so the first real request is fast.
    get_model()


@app.get("/health")
def health():
    return {"status": "ok", "model": MODEL_NAME}


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...), language: str = Form("fa")):
    data = await file.read()
    if not data:
        return JSONResponse(status_code=400, content={"detail": "empty file"})

    suffix = os.path.splitext(file.filename or "audio")[1] or ".wav"
    tmp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            tmp.write(data)
            tmp_path = tmp.name

        model = get_model()
        segments, info = model.transcribe(
            tmp_path,
            language=language if language and language != "auto" else None,
            vad_filter=True,
            beam_size=5,
        )
        text = " ".join(seg.text.strip() for seg in segments).strip()
        return {"text": text, "language": info.language, "duration": info.duration}
    except Exception as e:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"detail": str(e)})
    finally:
        if tmp_path and os.path.exists(tmp_path):
            os.remove(tmp_path)


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", "9500"))
    uvicorn.run(app, host="127.0.0.1", port=port)

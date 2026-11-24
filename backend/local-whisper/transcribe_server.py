"""
Local keyless Persian audio->text transcription server.
Runs faster-whisper (CTranslate2) on CPU (int8). No API key required.

Endpoints:
  POST /transcribe  multipart: file, language(optional, default fa) -> {"text": "..."}
  GET  /health      -> {"status":"ok","model":<active>}
  GET  /models      -> {"models":[...], "active":<name>, "modelsDir":<path>}
  POST /reload      body {"model": "<name>|<path>|\"latest\""} -> hot-swap active model

Model selection (WHISPER_MODEL env):
  - A size name: "tiny" | "base" | "small" | "medium" | "large-v3" (auto-downloaded).
  - A local directory path to a CTranslate2 (faster-whisper) model. This is how you
    run a FINE-TUNED model: fine-tune with OpenAI-whisper/HF, convert to CT2 with
      python -m ctranslate2.converters.whisper <openai_model_dir>
    then point WHISPER_MODEL at the converted folder.
"""
import os
import tempfile
import threading
from fastapi import FastAPI, UploadFile, File, Form, Body
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
MODELS_DIR = os.environ.get(
    "WHISPER_MODELS_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "models")
)

app = FastAPI(title="Nehzat Local Transcriber")

_model = None
_model_name = MODEL_NAME
_model_lock = threading.Lock()


def get_model():
    global _model
    if _model is None:
        with _model_lock:
            if _model is None:
                _model = WhisperModel(_model_name, device="cpu", compute_type=COMPUTE_TYPE)
    return _model


def resolve_startup_model():
    """Prefer the newest fine-tuned model over the base size name, so a trained
    model is picked up automatically on (re)start. Override by pointing
    WHISPER_MODEL at an explicit path to disable this."""
    global _model_name
    if os.path.isdir(_model_name):
        return _model_name
    latest = latest_finetuned()
    if latest:
        return latest
    return _model_name


def reload_model(name):
    """Hot-swap the active model (e.g. to a freshly fine-tuned CT2 directory)."""
    global _model, _model_name
    with _model_lock:
        _model = WhisperModel(name, device="cpu", compute_type=COMPUTE_TYPE)
        _model_name = name
    return name


def latest_finetuned():
    """Return the newest models/nehzat-fa-* directory, or None."""
    if not os.path.isdir(MODELS_DIR):
        return None
    cands = [
        os.path.join(MODELS_DIR, d)
        for d in os.listdir(MODELS_DIR)
        if d.startswith("nehzat-fa") and os.path.isdir(os.path.join(MODELS_DIR, d))
    ]
    if not cands:
        return None
    return max(cands, key=lambda p: os.path.getmtime(p))


@app.on_event("startup")
def preload():
    # Warm the model so the first real request is fast. Auto-pick the newest
    # fine-tuned model if one exists (see resolve_startup_model).
    global _model_name
    _model_name = resolve_startup_model()
    get_model()


@app.get("/health")
def health():
    return {"status": "ok", "model": _model_name}


@app.get("/models")
def list_models():
    """List available fine-tuned models in the models dir."""
    if not os.path.isdir(MODELS_DIR):
        return {"models": []}
    names = [
        d
        for d in sorted(os.listdir(MODELS_DIR))
        if os.path.isdir(os.path.join(MODELS_DIR, d))
    ]
    return {"models": names, "active": _model_name, "modelsDir": MODELS_DIR}


@app.post("/reload")
def reload(body: dict = Body(...)):
    """Hot-swap the active model. Body: {"model": "<name-or-path>"} or
    {"model": "latest"} to auto-pick the newest models/nehzat-fa-* dir."""
    name = (body or {}).get("model") or ""
    if not name:
        return JSONResponse(status_code=400, content={"detail": "missing 'model'"})
    if name == "latest":
        latest = latest_finetuned()
        if not latest:
            return JSONResponse(
                status_code=404, content={"detail": "no fine-tuned model found in models/"}
            )
        name = latest
    if not os.path.isabs(name):
        candidate = os.path.join(MODELS_DIR, name)
        if os.path.isdir(candidate):
            name = candidate
    if not os.path.isdir(name):
        return JSONResponse(status_code=400, content={"detail": f"model path not found: {name}"})
    try:
        reloaded = reload_model(name)
    except Exception as e:  # noqa: BLE001
        return JSONResponse(status_code=500, content={"detail": f"reload failed: {e}"})
    return {"status": "ok", "model": reloaded}


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

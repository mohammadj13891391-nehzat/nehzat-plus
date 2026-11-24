"""
Prepare a Whisper fine-tuning dataset from the Nehzat training manifest.

The backend endpoint GET /admin/coaches/training/export returns a JSONL manifest:
  {"id": 1, "path": "D:/.../public/uploads/training/xxx.wav", "text": "متن ..."}
(one object per line). This script converts each sample to the 16 kHz mono WAV
layout expected by OpenAI-whisper's `train.py`, writing:
  <out>/train.jsonl   {"audio": "train/000001.wav", "text": "..."}
  <out>/val.jsonl     (held-out last N% of samples, same layout)
  <out>/train/NNNNNN.wav  and  <out>/val/NNNNNN.wav  (16 kHz mono PCM16)

Usage:
  python prepare_dataset.py --manifest manifest.jsonl --out dataset
  python prepare_dataset.py --base http://localhost:3000 --token <jwt> --out dataset

Notes:
  - Resampling needs `av` (already in the server venv) or `ffmpeg` on PATH.
  - `--min-samples N` (default 20) aborts with a helpful message if the corpus
    is too small to be worth fine-tuning.
  - `--val-fraction 0.1` controls the validation split.
"""
import argparse
import json
import os
import struct
import subprocess
import sys
import urllib.request

TARGET_SR = 16000


def fetch_manifest(base: str, token: str) -> str:
    req = urllib.request.Request(
        f"{base.rstrip('/')}/admin/coaches/training/export",
        headers={"Authorization": f"Bearer {token}"},
    )
    with urllib.request.urlopen(req) as r:
        data = r.read()
    return data.decode("utf-8")


def load_manifest(path: str) -> list:
    samples = []
    with open(path, "r", encoding="utf-8-sig") as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            samples.append(obj)
    return samples


def resample_to_wav16k(src: str, dst: str) -> None:
    """Convert any audio file to 16 kHz mono PCM16 WAV."""
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    # Prefer ffmpeg (handles mp3/m4a/ogg/flac/webm). Fall back to `av`.
    if _have_ffmpeg():
        cmd = [
            "ffmpeg", "-y", "-i", src,
            "-ar", str(TARGET_SR), "-ac", "1", "-c:a", "pcm_s16le", dst,
        ]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return
    _resample_with_av(src, dst)


_ffmpeg_cache = None


def _have_ffmpeg() -> bool:
    global _ffmpeg_cache
    if _ffmpeg_cache is None:
        try:
            probe = subprocess.run(
                ["ffmpeg", "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL
            )
            _ffmpeg_cache = probe.returncode == 0
        except (FileNotFoundError, OSError):
            _ffmpeg_cache = False
    return _ffmpeg_cache


def _resample_with_av(src: str, dst: str) -> None:
    import av  # noqa: WPS433 (local import; optional dependency)

    container = av.open(src)
    stream = container.streams.audio[0]
    stream.time_base  # touch
    frames = []
    resampler = av.AudioResampler(format="s16", layout="mono", rate=TARGET_SR)
    for frame in container.decode(stream):
        for out in resampler.resample(frame):
            frames.append(out)
    for out in resampler.resample(None):  # flush
        frames.append(out)
    container.close()

    if not frames:
        raise RuntimeError(f"no audio frames decoded from {src}")

    # Concatenate all frames' planar samples into one contiguous mono buffer.
    planes = []
    total = 0
    for fr in frames:
        for plane in fr.planes:
            planes.append(bytes(plane))
        total += fr.samples
    raw = b"".join(planes)
    # `av` planes are per-plane; for mono the single plane already holds all samples.
    with open(dst, "wb") as f:
        f.write(_wav_header(total, TARGET_SR, 1, 16))
        f.write(raw)


def _wav_header(nframes: int, sr: int, channels: int, bits: int) -> bytes:
    byte_rate = sr * channels * bits // 8
    block_align = channels * bits // 8
    data_size = nframes * block_align
    header = b"RIFF"
    header += struct.pack("<I", 36 + data_size)
    header += b"WAVE"
    header += b"fmt "
    header += struct.pack("<I", 16)
    header += struct.pack("<H", 1)  # PCM
    header += struct.pack("<H", channels)
    header += struct.pack("<I", sr)
    header += struct.pack("<I", byte_rate)
    header += struct.pack("<H", block_align)
    header += struct.pack("<H", bits)
    header += b"data"
    header += struct.pack("<I", data_size)
    return header


def write_split(split_dir: str, samples: list, split_name: str) -> str:
    wav_dir = os.path.join(split_dir, split_name)
    os.makedirs(wav_dir, exist_ok=True)
    jsonl_path = os.path.join(split_dir, f"{split_name}.jsonl")
    with open(jsonl_path, "w", encoding="utf-8") as out:
        for i, s in enumerate(samples, start=1):
            wav_rel = f"{split_name}/{i:06d}.wav"
            wav_abs = os.path.join(split_dir, wav_rel)
            resample_to_wav16k(s["path"], wav_abs)
            text = s.get("text", "").strip()
            out.write(json.dumps({"audio": wav_rel, "text": text}, ensure_ascii=False) + "\n")
    return jsonl_path


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--manifest", help="Path to a JSONL manifest file.")
    ap.add_argument("--base", help="Backend base URL to fetch the manifest from.")
    ap.add_argument("--token", default=os.environ.get("NEHZAT_TOKEN", ""),
                    help="Bearer JWT (or set NEHZAT_TOKEN).")
    ap.add_argument("--out", required=True, help="Output dataset directory.")
    ap.add_argument("--min-samples", type=int, default=20)
    ap.add_argument("--val-fraction", type=float, default=0.1)
    args = ap.parse_args()

    if args.manifest:
        samples = load_manifest(args.manifest)
    elif args.base:
        if not args.token:
            sys.exit("Need --token (or NEHZAT_TOKEN) when fetching from --base.")
        samples = [json.loads(l) for l in fetch_manifest(args.base, args.token).splitlines() if l.strip()]
    else:
        sys.exit("Provide --manifest <file> or --base <url>.")

    samples = [s for s in samples if s.get("text", "").strip() and os.path.exists(s.get("path", ""))]
    if len(samples) < args.min_samples:
        sys.exit(
            f"Only {len(samples)} usable samples; need at least {args.min_samples} "
            "before fine-tuning is worthwhile. Keep collecting short audio+text samples."
        )

    n_val = max(1, int(len(samples) * args.val_fraction))
    val, train = samples[-n_val:], samples[:-n_val]

    train_jsonl = write_split(args.out, train, "train")
    val_jsonl = write_split(args.out, val, "val")

    print(f"train: {len(train)} samples -> {train_jsonl}")
    print(f"val:   {len(val)} samples -> {val_jsonl}")
    print("Next: run train.ps1 (or train.py) on this dataset.")


if __name__ == "__main__":
    main()

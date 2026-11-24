"""
Self-contained Whisper fine-tuner for Persian (Nehzat).

Fine-tunes a HuggingFace Whisper model on the dataset prepared by
prepare_dataset.py (which writes <out>/train.jsonl + val.jsonl, each line:
  {"audio": "train/000001.wav", "text": "متن ..."}
, plus the resampled 16 kHz mono WAVs under <out>/train and <out>/val).

After training it saves the final checkpoint to <out>/hf-finetuned, which
train.ps1 then converts to CTranslate2 for faster-whisper.

Usage:
  python finetune_whisper.py --dataset_dir dataset --model_size tiny \
      --out_dir dataset/hf-finetuned --epochs 4 --batch_size 4

Requirements (installed by train.ps1 into .venv-train):
  torch, transformers, datasets, soundfile, accelerate, ctranslate2
"""
import argparse
import json
import os
import sys

import numpy as np
import torch
from datasets import Dataset
from transformers import (
    WhisperFeatureExtractor,
    WhisperForConditionalGeneration,
    WhisperTokenizer,
    Seq2SeqTrainer,
    Seq2SeqTrainingArguments,
)

TARGET_SR = 16000


def load_audio(path: str) -> np.ndarray:
    import soundfile as sf

    data, sr = sf.read(path, dtype="float32")
    if data.ndim > 1:  # collapse to mono
        data = data.mean(axis=1)
    if sr != TARGET_SR:
        # simple linear resample fallback (prepare_dataset already gives 16 kHz)
        ratio = TARGET_SR / sr
        n_out = int(len(data) * ratio)
        x_old = np.linspace(0.0, 1.0, num=len(data), endpoint=False)
        x_new = np.linspace(0.0, 1.0, num=n_out, endpoint=False)
        data = np.interp(x_new, x_old, data).astype(np.float32)
    return data


def read_jsonl(path: str) -> list:
    rows = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                rows.append(json.loads(line))
    return rows


def build_dataset(dataset_dir: str, split: str) -> Dataset:
    jsonl = os.path.join(dataset_dir, f"{split}.jsonl")
    if not os.path.exists(jsonl):
        raise FileNotFoundError(f"Missing {jsonl} — run prepare_dataset.py first.")
    rows = read_jsonl(jsonl)
    audios, texts = [], []
    for r in rows:
        wav = r["audio"].replace("\\", "/")
        wav_abs = os.path.join(dataset_dir, wav)
        if not os.path.exists(wav_abs):
            continue
        if not r.get("text", "").strip():
            continue
        audios.append(load_audio(wav_abs))
        texts.append(r["text"].strip())
    return Dataset.from_dict({"audio": audios, "text": texts})


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--dataset_dir", required=True, help="Dir from prepare_dataset.py.")
    ap.add_argument("--model_size", default="tiny",
                    choices=["tiny", "base", "small", "medium"])
    ap.add_argument("--out_dir", default=None,
                    help="Final HF checkpoint dir (default <dataset_dir>/hf-finetuned).")
    ap.add_argument("--checkpoint_dir", default=None,
                    help="Where Trainer saves intermediate checkpoints.")
    ap.add_argument("--epochs", type=int, default=4)
    ap.add_argument("--max_steps", type=int, default=-1,
                    help="If >0, use max_steps instead of epochs.")
    ap.add_argument("--batch_size", type=int, default=4)
    ap.add_argument("--lr", type=float, default=1e-5)
    ap.add_argument("--max_source_length", type=int, default=30)
    ap.add_argument("--max_target_length", type=int, default=225)
    ap.add_argument("--language", default="fa",
                    help="Language token prefix for the decoder start token.")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    out_dir = args.out_dir or os.path.join(args.dataset_dir, "hf-finetuned")
    ckpt_dir = args.checkpoint_dir or os.path.join(
        os.path.dirname(os.path.abspath(out_dir)), "checkpoints"
    )

    hf_id = f"openai/whisper-{args.model_size}"
    print(f"Loading feature extractor + tokenizer + model from {hf_id} ...")
    feature_extractor = WhisperFeatureExtractor.from_pretrained(hf_id)
    tokenizer = WhisperTokenizer.from_pretrained(hf_id, language=args.language, task="transcribe")
    model = WhisperForConditionalGeneration.from_pretrained(hf_id)
    model.config.forced_decoder_ids = None  # let the language token drive decoding

    train_ds = build_dataset(args.dataset_dir, "train")
    val_ds = build_dataset(args.dataset_dir, "val") if os.path.exists(
        os.path.join(args.dataset_dir, "val.jsonl")
    ) else None
    print(f"train samples: {len(train_ds)}" + (f", val samples: {len(val_ds)}" if val_ds else ""))
    if len(train_ds) == 0:
        sys.exit("No usable training samples. Abort.")

    def preprocess(batch):
        audio = [a for a in batch["audio"]]
        model_inputs = feature_extractor(audio, sampling_rate=TARGET_SR, return_attention_mask=True)
        input_features = model_inputs["input_features"]
        attention_mask = model_inputs.get("attention_mask")
        labels = tokenizer(
            text=batch["text"],
            padding="max_length",
            max_length=args.max_target_length,
            padding_side="right",
            truncation=True,
            return_tensors="np",
        )["input_ids"]
        labels = np.where(labels != tokenizer.pad_token_id, labels, -100)
        out = {"input_features": input_features, "labels": labels}
        if attention_mask is not None:
            out["attention_mask"] = attention_mask
        return out

    train_ds = train_ds.map(preprocess, batched=True, remove_columns=train_ds.column_names)
    if val_ds is not None:
        val_ds = val_ds.map(preprocess, batched=True, remove_columns=val_ds.column_names)

    training_kwargs = {}
    if args.max_steps > 0:
        training_kwargs["max_steps"] = args.max_steps
        training_kwargs["num_train_epochs"] = 1
    else:
        training_kwargs["num_train_epochs"] = args.epochs

    training_args = Seq2SeqTrainingArguments(
        output_dir=out_dir,
        per_device_train_batch_size=args.batch_size,
        per_device_eval_batch_size=args.batch_size,
        learning_rate=args.lr,
        weight_decay=0.01,
        warmup_steps=500,
        gradient_accumulation_steps=2,
        fp16=False,
        bf16=torch.cuda.is_available() and torch.cuda.is_bf16_supported(),
        logging_steps=25,
        eval_strategy="steps" if val_ds is not None else "no",
        eval_steps=500 if val_ds is not None else None,
        save_strategy="steps",
        save_steps=500,
        save_total_limit=2,
        predict_with_generate=False,
        report_to=[],
        seed=args.seed,
        max_source_length=args.max_source_length,
        **training_kwargs,
    )

    trainer = Seq2SeqTrainer(
        model=model,
        args=training_args,
        train_dataset=train_ds,
        eval_dataset=val_ds,
        processing_class=tokenizer,
    )

    print("Starting fine-tuning (CPU). This can take a while for small models...")
    trainer.train(resume_from_checkpoint=False)

    print(f"Saving final HF checkpoint to {out_dir}")
    trainer.save_model(out_dir)
    feature_extractor.save_pretrained(out_dir)
    tokenizer.save_pretrained(out_dir)
    print("Done. Next: convert to CTranslate2 (see train.ps1).")


if __name__ == "__main__":
    main()

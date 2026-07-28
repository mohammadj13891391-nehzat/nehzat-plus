#!/usr/bin/env bun
/**
 * Zen HA Pipeline — High Availability Dynamic Failover Pipeline
 *
 * Reads available free models from opencode.jsonc (zen provider) dynamically.
 * When you add a new free model to opencode.jsonc, it AUTO-JOINS the pipeline.
 *
 * Pipeline is circular: when a model disconnects, next one takes over instantly.
 * Project NEVER stops — context preserved across ALL failovers.
 *
 * Usage:
 *   bun zen-ha-pipeline.ts "task description"
 *   bun zen-ha-pipeline.ts --resume
 *   bun zen-ha-pipeline.ts --register <model-id>
 *   bun zen-ha-pipeline.ts --status
 *   bun zen-ha-pipeline.ts --help
 */

import { $ } from "bun";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// ──────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────
const CWD = process.cwd();
const STATE_FILE = join(CWD, ".zen-ha-state.json");
const CONTEXT_FILE = join(CWD, ".zen-ha-context.md");
const CONFIG_FILE = join(CWD, "opencode.jsonc");

const DEFAULT_CATEGORIES: Record<string, string> = {
  "ling": "deep",
  "deepseek": "deep",
  "nemotron": "ultrabrain",
  "north": "quick",
  "mimo": "visual-engineering",
  "big-pickle": "quick",
  "hy3": "unspecified-low",
  "default": "quick"
};

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface HAModelConfig {
  id: string;
  name: string;
  model: string;
  category: string;
  specialty: string;
  priority: number;
  timeoutMs: number;
  maxRetries: number;
}

interface HAState {
  task: string;
  currentIndex: number;
  cycleCount: number;
  history: Array<{
    model: string;
    name: string;
    timestamp: string;
    success: boolean;
    outputLength: number;
    error?: string;
  }>;
  isRunning: boolean;
  lastCheckpoint: string;
}

// ──────────────────────────────────────────────
// Dynamic Model Discovery
// ──────────────────────────────────────────────

/**
 * Read zen provider models from opencode.jsonc dynamically.
 * Any new free model added under the "zen" provider automatically joins.
 */
function discoverModels(): HAModelConfig[] {
  let configText: string;

  // Try project-level config first
  if (existsSync(CONFIG_FILE)) {
    configText = readFileSync(CONFIG_FILE, "utf-8");

    // Extract zen provider section
    const zenMatch = configText.match(/"zen"\s*:\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/s);
    if (zenMatch) {
      const zenSection = zenMatch[1];

      // Extract model IDs
      const modelMatches = zenSection.matchAll(/"([^"]+)"\s*:\s*\{[^}]*"name"\s*:\s*"([^"]+)"[^}]*\}/g);

      const models: HAModelConfig[] = [];
      let priority = 1;

      for (const match of modelMatches) {
        const [, modelId, modelName] = match;
        models.push({
          id: modelId,
          name: modelName.replace(/\s*\(Free\)/, "").trim(),
          model: `zen/${modelId}`,
          category: inferCategory(modelId),
          specialty: inferSpecialty(modelId),
          priority: priority++,
          timeoutMs: inferTimeout(modelId),
          maxRetries: inferRetries(modelId)
        });
      }

      // Sort by priority
      models.sort((a, b) => a.priority - b.priority);

      if (models.length > 0) {
        return models;
      }
    }
  }

  // Fallback: hardcoded models (same as discovered earlier)
  const fallbackModels = [
    { id: "ling-3.0-flash-free", name: "Ling 3.0 Flash Free", model: "zen/ling-3.0-flash-free", category: "deep", specialty: "Fast reasoning and coding", priority: 1, timeoutMs: 90000, maxRetries: 3 },
    { id: "big-pickle", name: "Big Pickle", model: "zen/big-pickle", category: "quick", specialty: "Quick tests, smoke checks", priority: 2, timeoutMs: 60000, maxRetries: 3 },
    { id: "deepseek-v4-flash-free", name: "DeepSeek V4 Flash", model: "zen/deepseek-v4-flash-free", category: "deep", specialty: "Primary reasoning and coding", priority: 3, timeoutMs: 120000, maxRetries: 2 },
    { id: "mimo-v2.5-free", name: "MiMo V2.5", model: "zen/mimo-v2.5-free", category: "visual-engineering", specialty: "Vision, review, quality", priority: 4, timeoutMs: 120000, maxRetries: 2 },
    { id: "nemotron-3-ultra-free", name: "Nemotron 3 Ultra", model: "zen/nemotron-3-ultra-free", category: "ultrabrain", specialty: "Architect, plan, orchestrate", priority: 5, timeoutMs: 180000, maxRetries: 2 },
    { id: "north-mini-code-free", name: "North Mini Code", model: "zen/north-mini-code-free", category: "quick", specialty: "Agentic coding, terminal", priority: 6, timeoutMs: 120000, maxRetries: 3 },
    { id: "hy3-free", name: "Hy3 Preview", model: "zen/hy3-free", category: "unspecified-low", specialty: "Verify types, structure", priority: 7, timeoutMs: 90000, maxRetries: 2 }
  ];

  return fallbackModels;
}

function inferCategory(modelId: string): string {
  const lower = modelId.toLowerCase();
  for (const [key, cat] of Object.entries(DEFAULT_CATEGORIES)) {
    if (lower.includes(key)) return cat;
  }
  return DEFAULT_CATEGORIES.default;
}

function inferSpecialty(modelId: string): string {
  if (modelId.includes("ling")) return "Fast reasoning, all-purpose";
  if (modelId.includes("deepseek")) return "Primary reasoning and coding";
  if (modelId.includes("nemotron")) return "Architecture and orchestration";
  if (modelId.includes("north")) return "Agentic coding and execution";
  if (modelId.includes("mimo")) return "Multimodal review and quality";
  if (modelId.includes("big-pickle")) return "Quick validation and smoke test";
  if (modelId.includes("hy3")) return "Type verification and structure check";
  return "General purpose";
}

function inferTimeout(modelId: string): number {
  if (modelId.includes("nemotron")) return 180000;
  if (modelId.includes("north")) return 120000;
  if (modelId.includes("mimo")) return 120000;
  if (modelId.includes("ling")) return 90000;
  if (modelId.includes("hy3")) return 90000;
  if (modelId.includes("deepseek")) return 120000;
  if (modelId.includes("big-pickle")) return 60000;
  return 90000;
}

function inferRetries(modelId: string): number {
  if (modelId.includes("nemotron")) return 2;
  if (modelId.includes("north")) return 3;
  if (modelId.includes("big-pickle")) return 3;
  if (modelId.includes("ling")) return 3;
  return 2;
}

// ──────────────────────────────────────────────
// Model Registration
// ──────────────────────────────────────────────

/**
 * Register a new free model in opencode.jsonc zen provider.
 * This makes the model auto-join the pipeline.
 */
function registerModel(modelId: string): boolean {
  if (!existsSync(CONFIG_FILE)) {
    console.error(`❌ Config file not found: ${CONFIG_FILE}`);
    return false;
  }

  let config = readFileSync(CONFIG_FILE, "utf-8");

  // Check if model already exists
  if (config.includes(`"${modelId}"`)) {
    console.log(`⚠️  Model "${modelId}" already registered in opencode.jsonc`);

    // Check if it's in zen provider
    const zenMatch = config.match(/"zen"\s*:\s*\{[\s\S]*?"models"\s*:\s*\{([\s\S]*?)\}\s*[\s\S]*?\}/);
    if (zenMatch && zenMatch[1].includes(`"${modelId}"`)) {
      console.log("✅ Already in zen provider — it will auto-join the pipeline on next run");
      return true;
    }
  }

  // Add new model to zen provider
  // Find the models block and insert before closing brace
  const newModelEntry = `        "${modelId}": { "name": "${modelId.replace(/-/g, " ").replace(/\bfree\b/gi, "").trim()} (Free)" },`;

  const modelsBlockMatch = config.match(/("zen"\s*:\s*\{[\s\S]*?"models"\s*:\s*\{)([\s\S]*?)(\n\s+\}\s*\n\s+\}\s*\n\s+\})/);

  if (modelsBlockMatch) {
    const before = modelsBlockMatch[1] + modelsBlockMatch[2];
    const after = modelsBlockMatch[3];
    const newContent = before + "\n" + newModelEntry + after;
    config = config.replace(modelsBlockMatch[0], newContent);
    writeFileSync(CONFIG_FILE, config);
    console.log(`✅ Registered "${modelId}" in opencode.jsonc!`);
    console.log("   → It will auto-join the pipeline next time you run HA Pipeline.");
    return true;
  } else {
    console.error("❌ Could not find zen provider models block in opencode.jsonc");
    console.log("   → Please add the model manually under provider.zen.models");
    return false;
  }
}

// ──────────────────────────────────────────────
// State Management
// ──────────────────────────────────────────────

function loadState(): HAState | null {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, "utf-8"));
  }
  return null;
}

function saveState(state: HAState) {
  state.lastCheckpoint = new Date().toISOString();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function loadContext(): string {
  if (existsSync(CONTEXT_FILE)) {
    return readFileSync(CONTEXT_FILE, "utf-8");
  }
  return "";
}

function saveContext(context: string) {
  writeFileSync(CONTEXT_FILE, context);
}

function createInitialState(task: string, models: HAModelConfig[]): HAState {
  const initialContext = `# Zen HA Pipeline — Project Context\n\n**Task:** ${task}\n**Started:** ${new Date().toISOString()}\n**Models in pipeline:** ${models.map(m => m.name).join(" → ")} (circular)\n\n---\n\n`;
  saveContext(initialContext);

  return {
    task,
    currentIndex: 0,
    cycleCount: 0,
    history: [],
    isRunning: true,
    lastCheckpoint: new Date().toISOString()
  };
}

// ──────────────────────────────────────────────
// Pipeline Execution
// ──────────────────────────────────────────────

function buildPrompt(model: HAModelConfig, task: string, context: string): string {
  return `You are ${model.name} in a HIGH-AVAILABILITY PIPELINE.

═══════════════════════════════════
TASK: ${task}
═══════════════════════════════════

FULL CONTEXT FROM PREVIOUS MODELS (read ALL of it):
${context}

═══════════════════════════════════
YOUR SPECIALTY: ${model.specialty}
═══════════════════════════════════

CRITICAL RULES:
1. Read the FULL CONTEXT above carefully.
2. Continue the project where previous model left off.
3. DO NOT repeat work already done — ADVANCE THE PROJECT.
4. Output ONLY your contribution.
5. End with a line starting: === HA_PIPELINE_CHECKPOINT === followed by a short status.

The next model will receive everything you wrote.
The pipeline NEVER stops — you are part of a continuous chain.`;
}

async function runModel(model: HAModelConfig, task: string, context: string): Promise<{ success: boolean; output: string; error?: string; disconnected: boolean }> {
  const prompt = buildPrompt(model, task, context);
  const startTime = Date.now();

  console.log(`\n┌──────────────────────────────────────────────────────┐`);
  console.log(`│  🔄 ${(model.id + " ").padEnd(28)}│`);
  console.log(`│  📋 Model: ${model.name.padEnd(24)}│`);
  console.log(`│  🎯 ${(model.specialty + ".").padEnd(29)}│`);
  console.log(`└──────────────────────────────────────────────────────┘`);

  let lastError: string | undefined;

  for (let attempt = 1; attempt <= model.maxRetries; attempt++) {
    try {
      console.log(`  ▶ Attempt ${attempt}/${model.maxRetries}...`);

      const result = await Promise.race([
        $`opencode run "${prompt}" --model ${model.model} --print-logs`.text(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("TIMEOUT")), model.timeoutMs)
        )
      ]);

      const output = result.trim();
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`  ✅ ${model.name} completed in ${duration}s (${output.length} chars)`);

      // Extract checkpoint status if present
      const cpIdx = output.indexOf("=== HA_PIPELINE_CHECKPOINT ===");
      const cleanOutput = cpIdx !== -1 ? output.substring(0, cpIdx).trim() : output;
      if (cpIdx !== -1) {
        const status = output.substring(cpIdx + 31).trim();
        console.log(`  📍 Checkpoint: ${status}`);
      }

      return { success: true, output: cleanOutput, disconnected: false };

    } catch (error: any) {
      lastError = error?.message ?? String(error);
      const isFatal = lastError && (
        lastError.includes("TIMEOUT") ||
        lastError.includes("ECONNREFUSED") ||
        lastError.includes("disconnect") ||
        lastError.includes("EPIPE") ||
        lastError.includes("ETIMEDOUT")
      );

      console.log(`  ⚠️  Attempt ${attempt} failed: ${isFatal ? "Connection lost" : lastError}`);

      if (attempt < model.maxRetries) {
        const waitMs = 2000 * attempt;
        console.log(`  ⏳ Retrying in ${waitMs / 1000}s...`);
        await new Promise(r => setTimeout(r, waitMs));
      }
    }
  }

  console.log(`  ❌ ${model.name} FAILED after ${model.maxRetries} attempts`);
  console.log(`  🔀 FAILOVER → Next model in pipeline...`);

  return { success: false, output: "", error: lastError, disconnected: true };
}

function updateContext(context: string, model: HAModelConfig, output: string): string {
  return context + `\n## ${model.name} (${model.id})\n**${new Date().toISOString()}**\n\n${output}\n\n---\n\n`;
}

async function runHAPipeline(task: string, options: { maxCycles?: number; resume?: boolean } = {}) {
  const maxCycles = options.maxCycles ?? 10;

  // Discover models dynamically from opencode.jsonc
  const models = discoverModels();

  if (models.length === 0) {
    console.error("❌ No models found! Add a 'zen' provider to opencode.jsonc first.");
    console.log("   See: opencode.jsonc → provider.zen.models");
    process.exit(1);
  }

  console.log(`\n═══════════════════════════════════════════`);
  console.log(`  🌀 Zen HA Pipeline — Dynamic Mode`);
  console.log(`═══════════════════════════════════════════`);
  console.log(`  Models (${models.length}): ${models.map(m => m.name).join(" → ")} → (loop)`);
  console.log(`  Config: ${CONFIG_FILE}`);
  console.log(`═══════════════════════════════════════════`);

  let state: HAState;

  if (options.resume) {
    state = loadState();
    if (!state) {
      console.error("❌ No saved state to resume.");
      process.exit(1);
    }
    console.log(`\n🔄 RESUMING — Task: ${state.task}`);
    console.log(`   Current model index: ${state.currentIndex}`);
    console.log(`   Model: ${models[state.currentIndex % models.length].name}`);
    console.log(`   Cycles completed: ${state.cycleCount}`);
  } else {
    state = createInitialState(task, models);
    saveState(state);
    console.log(`\n🚀 STARTING — Task: ${task}`);
  }

  // Graceful shutdown
  let shutdownRequested = false;
  process.on("SIGINT", () => {
    console.log("\n\n🛑 Shutdown requested — saving state...");
    shutdownRequested = true;
    state.isRunning = false;
    saveState(state);
  });
  process.on("SIGTERM", () => {
    console.log("\n\n🛑 Shutdown requested — saving state...");
    shutdownRequested = true;
    state.isRunning = false;
    saveState(state);
  });

  while (state.isRunning && state.cycleCount < maxCycles && !shutdownRequested) {
    const modelIndex = state.currentIndex % models.length;
    const model = models[modelIndex];

    const context = loadContext();
    const result = await runModel(model, state.task, context);

    // Record history
    state.history.push({
      model: model.id,
      name: model.name,
      timestamp: new Date().toISOString(),
      success: result.success,
      outputLength: result.output.length,
      error: result.error
    });

    if (result.success && result.output) {
      const newContext = updateContext(context, model, result.output);
      saveContext(newContext);
    }

    // ALWAYS advance — whether success or failover
    state.currentIndex++;

    // Full cycle complete?
    if (state.currentIndex % models.length === 0) {
      state.cycleCount++;
      console.log(`\n🔄 CYCLE ${state.cycleCount} COMPLETE — Pipeline continues...\n`);
    }

    saveState(state);

    // Brief pause before next model
    await new Promise(r => setTimeout(r, 1500));
  }

  // Final summary
  if (shutdownRequested) {
    console.log("\n💾 State saved. Resume anytime with: bun zen-ha-pipeline.ts --resume");
  } else if (state.cycleCount >= maxCycles) {
    console.log(`\n⚠️  Max cycles (${maxCycles}) reached. Pipeline paused.`);
    console.log("   Resume: bun zen-ha-pipeline.ts --resume");
  }

  state.isRunning = false;
  saveState(state);

  printSummary(state, models);
}

function printSummary(state: HAState, models: HAModelConfig[]) {
  console.log("\n═══════════════════════════════════════");
  console.log("📊 PIPELINE SUMMARY");
  console.log("═══════════════════════════════════════");
  console.log(`Task:          ${state.task}`);
  console.log(`Cycles done:   ${state.cycleCount}`);
  console.log(`Total runs:    ${state.history.length}`);
  console.log(`Active models: ${models.length}`);
  console.log(`Config file:   ${CONFIG_FILE}`);
  console.log(`Context file:  ${CONTEXT_FILE}`);

  console.log("\nModel results:");
  state.history.slice(-state.history.length).forEach((h, i) => {
    const icon = h.success ? "✅" : "❌";
    const note = h.error ? ` (${h.error.substring(0, 50)})` : "";
    console.log(`  ${icon} ${(i + 1).toString().padStart(2)}. ${h.name.padEnd(20)} — ${h.outputLength} chars${note}`);
  });

  console.log(`\n💡 Tip: Add new free models to opencode.jsonc → provider.zen.models`);
  console.log(`       They auto-join the pipeline on next run.`);
}

function showStatus() {
  const state = loadState();
  const models = discoverModels();

  if (!state) {
    console.log("📭 No active HA pipeline");
    console.log("   Start with: bun zen-ha-pipeline.ts \"your task\"");
    return;
  }

  const currentModel = models[state.currentIndex % models.length];

  console.log(`\n📋 HA Pipeline Status`);
  console.log("══════════════════════");
  console.log(`Task:        ${state.task}`);
  console.log(`Status:      ${state.isRunning ? "🟢 RUNNING" : "🔴 STOPPED"}`);
  console.log(`Cycle:       ${state.cycleCount}`);
  console.log(`Next model:  ${currentModel.name} (${currentModel.id})`);
  console.log(`Models:      ${models.length} (${models.map(m => m.name).join(" → ")} → loop)`);
  console.log(`Runs:        ${state.history.length}`);
  console.log(`Last save:   ${state.lastCheckpoint}`);

  console.log("\nRecent runs:");
  state.history.slice(-6).forEach((h, i) => {
    const icon = h.success ? "✅" : "❌";
    const time = h.outputLength > 0 ? ` — ${h.outputLength} chars` : "";
    console.log(`  ${icon} ${h.name}${time} — ${h.timestamp}`);
  });

  const ctxSize = existsSync(CONTEXT_FILE) ? readFileSync(CONTEXT_FILE, "utf-8").length : 0;
  console.log(`\nContext size: ${ctxSize} chars`);
}

// ──────────────────────────────────────────────
// CLI Entry Point
// ──────────────────────────────────────────────
const args = process.argv.slice(2);
const command = args[0];

if (!command || command === "--help" || command === "-h") {
  console.log(`
═══════════════════════════════════════════
  🌀 Zen HA Pipeline — Dynamic Failover
═══════════════════════════════════════════

USAGE:
  bun zen-ha-pipeline.ts "task description"
  bun zen-ha-pipeline.ts --resume
  bun zen-ha-pipeline.ts --status
  bun zen-ha-pipeline.ts --register ling-3.0-flash-free
  bun zen-ha-pipeline.ts --register <model-id>
  bun zen-ha-pipeline.ts --help

DYNAMIC MODEL DISCOVERY:
  ✅ Reads models from opencode.jsonc → provider.zen.models
  ✅ Any NEW free model added there auto-joins pipeline
  ✅ No code changes needed — just edit opencode.jsonc

REGISTRATION:
  bun zen-ha-pipeline.ts --register ling-3.0-flash-free
  → Adds model to opencode.jsonc zen provider
  → Auto-joins pipeline on next run

CIRCULAR FAILOVER:
  Model 1 → 2 → 3 → 4 → 5 → 6 → 1 → 2 → ... → ∞
  When disconnect: instant switch to next model
  Context preserved across ALL failovers
  Project NEVER stops

FEATURES:
  ✅ Auto-failover on disconnect/timeout
  ✅ Context preserved across ALL failovers
  ✅ Checkpoint after EVERY model run
  ✅ Resume from any interruption (Ctrl+C, crash)
  ✅ Dynamic — new models auto-discovered
  ✅ Circular — infinite until you stop it
  ✅ Graceful shutdown with state save
`);
  process.exit(0);
}

if (command === "--status") {
  showStatus();
  process.exit(0);
}

if (command === "--resume") {
  runHAPipeline("", { resume: true }).catch(err => {
    console.error("❌ Failed:", err);
    process.exit(1);
  });
  process.exit(0);
}

if (command === "--register" && args[1]) {
  const success = registerModel(args[1]);
  process.exit(success ? 0 : 1);
}

// Run pipeline
let task = command;
let maxCycles = 10;

for (let i = 1; i < args.length; i++) {
  if (args[i] === "--max-cycles" && args[i + 1]) {
    maxCycles = parseInt(args[i + 1]);
    i++;
  } else if (!args[i].startsWith("--") && i > 0 && !["--resume", "--status", "--register", "--help", "-h"].includes(args[i - 1])) {
    task = args[i];
  }
}

runHAPipeline(task, { maxCycles }).catch(err => {
  console.error("❌ Pipeline failed:", err);
  process.exit(1);
});
# Zen Pipeline Skill

## Purpose

Configure **OpenCode Zen free models** and define an **automatic multi-model pipeline** where 6 specialized models hand off work to each other seamlessly — no manual switching required.

## Available Free Models (OpenCode Zen)

All models served via `https://opencode.ai/zen/v1` — **no credit card, no API key setup beyond `opencode auth login`**.

| Model ID | Name | Context | Best For |
|---|---|---|---|
| `ling-3.0-flash-free` | Ling 3.0 Flash Free | 1M | **Fast reasoning, all-purpose** — the default primary model |
| `big-pickle` | Big Pickle | 200K | Quick smoke tests, connectivity checks |
| `deepseek-v4-flash-free` | DeepSeek V4 Flash | 1M | **Primary reasoning** — fast, efficient MoE, strong coding |
| `mimo-v2.5-free` | MiMo V2.5 | 1M | **Code review & quality** — reasoning + vision capable |
| `nemotron-3-ultra-free` | Nemotron 3 Ultra | 1M | **Orchestration & planning** — frontier MoE for agent workflows |
| `north-mini-code-free` | North Mini Code | 256K | **Agentic coding** — optimized for terminal/software tasks |
| `hy3-free` | Hy3 Preview | 256K | **General purpose** — open weights, tool-calling support |

---

## Step 1: Configure Provider (Dynamic)

The pipeline reads models dynamically from `opencode.jsonc → provider.zen.models`.
When you add a new free model there, it auto-joins the pipeline — no code changes needed.

Add/Update this in `opencode.jsonc`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "zen": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "OpenCode Zen (Free)",
      "options": {
        "baseURL": "https://opencode.ai/zen/v1"
      },
      "models": {
        "ling-3.0-flash-free": { "name": "Ling 3.0 Flash Free" },
        "big-pickle": { "name": "Big Pickle (Free)" },
        "deepseek-v4-flash-free": { "name": "DeepSeek V4 Flash (Free)" },
        "mimo-v2.5-free": { "name": "MiMo V2.5 (Free)" },
        "nemotron-3-ultra-free": { "name": "Nemotron 3 Ultra (Free)" },
        "north-mini-code-free": { "name": "North Mini Code (Free)" },
        "hy3-free": { "name": "Hy3 Preview (Free)" }
      }
    }
  }
}
```

Add any new free model under `provider.zen.models` and it auto-joins the pipeline.

Then run once:
```powershell
opencode auth login
# Select: OpenCode Zen → Anonymous / Zen Gateway
```

---

## Step 2: Pipeline Workflow (Automatic Failover + Continuity)

### Design Principle — Circular Failover

Models form a **ring**. When one disconnects, the next takes over instantly with full context. After the last model, it wraps back to the first. Project NEVER stops.

```
         ┌──────────────────────────────────────────────────┐
         │                                                    │
         ▼                                                    │
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  LING 3.0      │────▶│    NEMOTRON 3   │────▶│     MIMO V2.5   │
│   (Primary)     │     │   (Orchestrator)│     │   (Reviewer)    │
│  Fast reasoning │     │  Plan/Coordinate│     │  Quality/Review │
└────────┬────────┘     └─────────────────┘     └────────┬────────┘
         │                                                 │
         │                                                 │
         │       ┌─────────────────────────────────────┐  │
         │       │                                     │  │
         │       ▼                                     ▼  │
         │  ┌─────────────────┐     ┌─────────────────┐  │
         │  │   BIG PICKLE    │◀────│  NORTH MINI     │──┘
         │  │  (Quick Test)   │     │  (Agent Coder)  │
         │  └─────────────────┘     └─────────────────┘
         │                                                    │
         └──────────────────────────────────────────────────┘
```

### Failover Rules (Automatic)

| Event | Behavior |
|---|---|
| Model disconnects | Next model picks up immediately, full context preserved |
| Model times out | Retry twice, then failover to next model |
| Crash / SIGINT | State saved. `--resume` continues from exact point |
| New model added to config | Auto-discovered on next pipeline run |

### Handoff Rules

| Stage | Model | Specialty | Output to Next |
|---|---|---|---|
| **1. Analyze & Draft** | `ling-3.0-flash-free` | Fast reasoning, all-purpose | Structured analysis + draft |
| **2. Plan & Coordinate** | `nemotron-3-ultra-free` | Architecture, orchestration | Refined plan + sub-tasks |
| **3. Execute Code** | `north-mini-code-free` | Agentic coding, terminal | Working code + test results |
| **4. Review & Harden** | `mimo-v2.5-free` | Vision, reasoning, quality | Issues + fixes |
| **5. Verify Structure** | `hy3-free` | Types, schema, tools | Verification report |
| **6. Smoke Test** | `big-pickle` | Quick validation | ✅ PASS / ❌ FAIL signal |

Ling 3.0 Flash Free is the **default primary model** — it leads the pipeline and is the fastest starter.

---

## Step 3: Usage — Zero Manual Switching

Just work normally. The **skill instructs the AI agent** to:

1. **Delegate to sub-agents** with appropriate models
2. **Pass context** between stages automatically
3. **Return unified result** to you

### Example: "Add authentication to my API"

**Internal pipeline (automatic):**

```
YOU: "Add auth to API"
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  DEEPSEEK V4 FLASH                                  │
│  → Analyzes codebase, designs auth approach         │
│  → Outputs: "Use JWT with refresh tokens, here's    │
│     the plan: middleware, login, refresh, logout"   │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  NEMOTRON 3 ULTRA                                   │
│  → Breaks into sub-tasks, orders dependencies       │
│  → Outputs: Task list with file-level details       │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  NORTH MINI CODE  (parallel sub-agents per task)    │
│  → Implements: JWT middleware, login handler,       │
│     refresh endpoint, logout, tests                 │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  MIMO V2.5                                          │
│  → Reviews all new code: security, style, edge      │
│     cases, missing error handling                   │
│  → Outputs: "Fix: add rate limiting, validate       │
│     refresh token expiry"                           │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────────────────┐
│  BIG PICKLE                                         │
│  → Quick smoke test: "Does the server start?        │
│     Do imports resolve?"                            │
└─────────────────────────────────────────────────────┘
    │
    ▼
YOU: Receive complete, reviewed, tested implementation
```

---

## Step 4: Agent/Category Mapping (Optional)

For **oh-my-openagent** users, add to `~/.config/opencode/oh-my-openagent.json`:

```json
{
  "agents": {
    "sisyphus": { "model": "zen/nemotron-3-ultra-free" },
    "oracle": { "model": "zen/nemotron-3-ultra-free" },
    "librarian": { "model": "zen/deepseek-v4-flash-free" },
    "explore": { "model": "zen/deepseek-v4-flash-free" },
    "sisyphus-junior": { "model": "zen/north-mini-code-free" }
  },
  "categories": {
    "visual-engineering": { "model": "zen/mimo-v2.5-free" },
    "ultrabrain": { "model": "zen/nemotron-3-ultra-free" },
    "deep": { "model": "zen/deepseek-v4-flash-free" },
    "quick": { "model": "zen/big-pickle" },
    "unspecified-low": { "model": "zen/big-pickle" },
    "unspecified-high": { "model": "zen/deepseek-v4-flash-free" }
  }
}
```

---

## How the AI Automates Handoffs

This skill teaches the AI (via context) to:

1. **Recognize task type** → pick starting model
2. **Spawn sub-agents** with `task(category=..., model=zen/...)`
3. **Pass output** as context to next stage
4. **Aggregate results** → single response to user

### Delegation Pattern (AI uses internally)

```typescript
// Stage 1: DeepSeek analyzes
const analysis = await task({
  category: "deep",
  load_skills: ["free-models"],
  prompt: `Analyze: ${userRequest}. Output: approach + key files.`
});

// Stage 2: Nemotron plans
const plan = await task({
  category: "ultrabrain",
  load_skills: [],
  prompt: `Create execution plan from: ${analysis}. Output: ordered tasks.`
});

// Stage 3: North Mini Code implements (parallel)
const impl = await Promise.all(plan.tasks.map(t => task({
  category: "quick",
  load_skills: [],
  prompt: `Implement: ${t}. Context: ${analysis}.`
})));

// Stage 4: MiMo reviews
const review = await task({
  category: "visual-engineering",
  load_skills: [],
  prompt: `Review code: ${impl}. Find issues. Output: fixes needed.`
});

// Stage 5: Big Pickle validates
const verify = await task({
  category: "quick",
  load_skills: [],
  prompt: `Quick check: imports resolve, no syntax errors. Code: ${review.fixedCode}`
});
```

---

## Configuration Reference

### Model IDs (exact strings for `task` calls)

```typescript
const MODELS = {
  analyze: "zen/deepseek-v4-flash-free",
  plan:    "zen/nemotron-3-ultra-free",
  code:    "zen/north-mini-code-free",
  review:  "zen/mimo-v2.5-free",
  verify:  "zen/big-pickle",
  fallback:"zen/hy3-free"
};
```

### Context Passing

Always include previous stage output in next stage prompt:
```
"Context from previous stage: ${previousOutput}"
```

---

## Troubleshooting

| Issue | Fix |
|---|---|
| "Model not found" | Run `opencode auth login` → select OpenCode Zen |
| Rate limited | Wait 30s; Zen free tier has generous limits |
| Sub-agent fails | Check `load_skills: []` — avoid skill conflicts |
| Context too large | Use `big-pickle` for quick summaries between stages |

---

## Notes

- **All free, no credit card** — Zen Gateway handles auth
- **1M context** on DeepSeek/Nemotron/MiMo — handles large codebases
- **Tool-calling supported** on all models — sub-agents work fully
- **No manual switching** — AI routes based on task type
- **Pipeline is advisory** — AI decides when to skip/merge stages

---

## Quick Start Checklist

- [ ] Add `zen` provider to `opencode.jsonc`
- [ ] Run `opencode auth login` once
- [ ] (Optional) Add agent/category mapping for oh-my-openagent
- [ ] Start working — pipeline activates automatically
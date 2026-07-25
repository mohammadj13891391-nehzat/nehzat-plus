Kimi K3 integrated with OpenCode Zen - Multi-Model Pipeline Configuration

## Setting Up OpenCode Zen Multi-Model Pipeline

This configuration sets up an intelligent multi-model pipeline where specialized models handle different types of tasks automatically.

---

### Step 1: Configure OpenCode Zen Provider

**Requirements:**
- OpenCode Zen account (free, no credit card)
- `opencode auth login` completed

**Configuration - opencode.jsonc:**
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
        "ling-3.0-flash-free": {
          "name": "Ling 3.0 Flash Free",
          "description": "Primary reasoning model (1M context, fast)"
        },
        "nemotron-3-ultra-free": {
          "name": "Nemotron 3 Ultra Free", 
          "description": "Orchestration & planning (1M context)"
        },
        "mimo-v2.5-free": {
          "name": "MiMo V2.5 Free",
          "description": "Code review & quality (1M context)"
        },
        "north-mini-code-free": {
          "name": "North Mini Code Free",
          "description": "Agentic coding (256K context)"
        },
        "deepseek-v4-flash-free": {
          "name": "DeepSeek V4 Flash Free",
          "description": "Quick reasoning (1M context)"
        },
        "big-pickle": {
          "name": "Big Pickle Free",
          "description": "Smoke testing & quick validation (200K context)"
        }
      }
    }
  }
}
```

### Step 2: Initial Setup

**Execute:**
```bash
# Configure OpenCode Zen authentication
opencode auth login
```

Select: **OpenCode Zen → Anonymous / Zen Gateway**

---

### Step 3: Understanding the Pipeline

**Model Roles:**
| Model | Context | Primary Function |
|-------|---------|------------------|
| `ling-3.0-flash-free` | 1M | **Primary reasoning** - Fast analysis & drafting |
| `nemotron-3-ultra-free` | 1M | **Orchestration** - Planning & task coordination |
| `mimo-v2.5-free` | 1M | **Code review** - Quality & verification |
| `north-mini-code-free` | 256K | **Implementation** - Agentic coding & execution |
| `deepseek-v4-flash-free` | 1M | **Quick analysis** - Initial assessment |
| `big-pickle` | 200K | **Validation** - Smoke testing & validation |

**Pipeline Flow:**
```
USER REQUEST
    ↓
LING 3.0 FLASH FREE (Analysis & Initial Draft)
    ↓
NEMOTRON 3 ULTRA (Planning & Orchestration) 
    ↓
NORTH MINI CODE (Implementation & Coding)
    ↓
MIMO V2.5 (Code Review & Quality Assurance)
    ↓
BIG PICKLE (Validation & Smoke Testing)
    ↓
USER FINAL RESULT
```

---

### Step 4: Task Delegation Examples

**For Analysis & Planning Tasks:**
```bash
# Use Ling 3.0 Flash for quick analysis
task(
  category="deep",
  load_skills=["free-models"],
  prompt="Analyze: [your request]. Output: approach + key files."
)
```

**For Complex Orchestration:**
```bash
# Use Nemotron 3 for planning & coordination
task(
  category="ultrabrain", 
  load_skills=[],
  prompt="Create execution plan from: [previous output]. Output: ordered tasks."
)
```

**For Implementation Work:**
```bash
# Use North Mini Code for implementation tasks
task(
  category="quick",
  load_skills=[],
  prompt="Implement: [specific task]. Context: [previous analysis]."
)
```

---

### Step 5: Context Management

**Continuity Rules:**
- Each stage includes previous stage output in the prompt
- Context is preserved throughout the pipeline
- Error recovery is automatic with context preservation

**Example Context Flow:**
```
Stage 1: "Analyze: Build authentication system"
Stage 2: Context: [Stage 1 output] + "Create execution plan"
Stage 3: Context: [Stage 2 output] + "Implement auth middleware"
Stage 4: Context: [Stage 3 output] + "Review for security issues"
```

---

### Step 6: Error Recovery & Failover

**Automatic Failover Rules:**
1. **Model disconnects** → Next model takes over immediately
2. **Rate limits** → Retry 2×, then failover
3. **Crashes** → State saved, continue from exact point
4. **New models** → Auto-discovered on next run

**Circular Pipeline:**
```
MOdel A → Model B → Model C → Model D → Model E → Model F → Model A
```

---

### Step 7: Quick Start Checklist

[ ] Configure OpenCode Zen models in `opencode.jsonc`
[ ] Run `opencode auth login`
[ ] Verify authentication works
[ ] Start implementing with pipeline automatically

---

### Step 8: Best Practices

**For Users:**
- Start with `ling-3.0-flash-free` for quick analysis
- Use `nemotron-3-ultra-free` for complex planning
- Let `north-mini-code-free` handle coding tasks
- Let `mimo-v2.5-free` review and ensure quality
- Use `big-pickle` for final validation

**For Developers:**
- Always pass context between stages
- Use consistent `load_skills: []` for clean handoffs
- Let the AI decide when to skip stages
- Preserve context for error recovery

---

### Step 9: Expected Outcome

**Result:**
- Seamless handoffs between specialized models
- No manual model selection required
- Automatic task routing based on what's needed
- Continuous operation with built-in redundancy
- Free tier with generous limits

**Benefit:** More efficient workflows without managing individual models

# Phase 2 Context: Consolidate Verification Agents

## Status Discovery

The core agent consolidation is **already complete**:
- `~/.claude/agents/gsd-verifier.md` contains all 4 scopes (general, plan, integration, nyquist) with "Absorbed from" attribution comments
- Old agent files (`gsd-plan-checker.md`, `gsd-integration-checker.md`, `gsd-nyquist-auditor.md`) have been deleted
- Workflow routing in `manager.md` already invokes `gsd-verifier` with scope parameter
- `quick.md` routing logic already references the unified agent

## Remaining Work

Phase 2 completion requires **documentation/reference cleanup** — updating files that still cite the 3 absorbed agents by their old standalone names.

### Files Requiring Updates

| File | Location | What to Fix |
|------|----------|-------------|
| `crew.md` | `~/.claude/commands/gsd/crew.md` | Lines 76, 91-92, 107-109, 116, 140-141, 243-244 — roster entries, routing table rows, and relationship descriptions for old agents |
| `CLAUDE.md` (global) | `~/.claude/CLAUDE.md` | Lines 149-152 — quality gates section lists `gsd-plan-checker` and `gsd-integration-checker` as separate agents |
| `plan-phase.md` | `~/.claude/commands/gsd/plan-phase.md` | Line 21 — objective text says "verify with gsd-plan-checker" |
| `quick.md` | `~/.claude/get-shit-done/workflows/quick.md` | Line 23 — description text mentions "plan-checker" in passing |
| `model-profiles.md` | `~/.claude/get-shit-done/references/model-profiles.md` | Lines 18-20 — separate rows for each absorbed agent |

### Files NOT Requiring Updates

| File | Reason |
|------|--------|
| `manager.md` | Routing already uses `gsd-verifier` with scope param |
| `CHANGELOG.md` | Historical record — references are accurate for when they were written |
| `gsd-tools.cjs` | GSD plugin internal tooling — out of scope for this project |
| `gsd-verifier.md` | Already complete with all 4 scopes |

## Decisions

### D1: Scope of Phase 2 Work
**Decision:** Reference cleanup across 5 files + verification pass that gsd-verifier scopes are correct and complete.
**Rationale:** The heavy lifting (agent consolidation, scope design, routing updates) is already done. What remains is ensuring all documentation reflects the new reality.

### D2: CHANGELOG.md Treatment
**Decision:** Leave historical references untouched.
**Rationale:** CHANGELOG entries are point-in-time records. Rewriting history creates confusion about what actually happened when.

### D3: gsd-tools.cjs missing_agents Logic
**Decision:** Out of scope for Phase 2.
**Rationale:** This is GSD plugin internals (`~/.claude/get-shit-done/bin/gsd-tools.cjs`). The `missing_agents` check in `init phase-op` still lists old agents, but this is a cosmetic issue in tooling output — it doesn't affect workflow execution.

### D4: ROADMAP.md Status
**Decision:** Update to "complete" after all cleanup passes verification.
**Rationale:** Phase 2 isn't done until references are cleaned and verified, even though the core consolidation is.

### D5: Update Pattern for References
**Decision:** Each old agent name should be replaced with `gsd-verifier (scope: {plan|integration|nyquist})` to make the routing explicit.
**Rationale:** Simply replacing "gsd-plan-checker" with "gsd-verifier" loses information. The scope parameter tells readers which mode is invoked.

## Complexity Assessment

**Low complexity.** This is a find-and-replace documentation task across 5 files with well-defined changes. No architectural decisions, no code logic changes, no risk of breaking workflows.

## Constraints

- All target files are in `~/.claude/` (global user config) — not project files
- Changes affect all projects that read these config files
- Pattern 2 (Zero-Trust) applies: verify after each change that the reference makes sense in context, don't just blindly find-replace

# Roadmap: v2.0 — GSD Crew Consolidation

## Milestone
v2.0 — GSD Crew Consolidation

## Phases

### Phase 1: Fix YAML Parsing (8 agents)
**Goal**: Convert all multi-line `description: >` blocks to single-line strings in agent frontmatter.
**Agents fixed**: google-media-generation, gpt-image-1-expert, mcp-performance-diagnostics, mirror-universe-pete, repo-commit-documenter, repo-doc-architect, sdk-installer, sora-video-generator (original 8 from assessment were already clean; full sweep found these 8 with `description: |` blocks)
**Files**: `~/.claude/agents/{google-media-generation,gpt-image-1-expert,mcp-performance-diagnostics,mirror-universe-pete,repo-commit-documenter,repo-doc-architect,sdk-installer,sora-video-generator}.md`
**Impact**: Fixes metadata extraction tooling, improves roster accuracy
**Status**: complete (2026-04-03)

### Phase 2: Consolidate Verification Agents
**Goal**: Merge gsd-plan-checker, gsd-integration-checker, and gsd-nyquist-auditor into gsd-verifier as configurable modes (`scope: plan | integration | nyquist | general`).
**Agents**: gsd-verifier absorbs gsd-plan-checker, gsd-integration-checker, gsd-nyquist-auditor (net -3)
**Files**: `~/.claude/agents/gsd-verifier.md` (expand), `~/.claude/agents/gsd-{plan-checker,integration-checker,nyquist-auditor}.md` (remove after merge)
**Workflow updates**: All workflows referencing absorbed agents must route to gsd-verifier with scope param
**Impact**: Simplifies orchestrator routing, reduces token spend on overlapping verification
**Plans:** 1 plan

Plans:
- [x] 02-01-PLAN.md — Update 5 documentation/reference files to replace old agent names with gsd-verifier (scope: X) pattern

**Status**: complete (2026-04-05)

### Phase 3: Consolidate Research Agents
**Goal**: Merge gsd-phase-researcher and gsd-project-researcher into single agent with scope parameter.
**Agents**: 2 → 1 (net -1) → `gsd-research-orchestrator` with `scope: phase|project`
**Files**: Agent file created in prior session. This phase cleaned 13 stale references across 6 GSD config files + 4 leftover Phase 2 references.
**Impact**: Eliminates 100% tool duplication, clearer research responsibility
**Status**: complete (2026-04-06)

### Phase 4: Merge Validator Agents
**Goal**: Merge extension-validator and validator into single validation hub.
**Agents**: 2 → 1 (net -1)
**Files**: `~/.claude/agents/extension-validator.md` + `~/.claude/agents/validator.md` → `~/.claude/agents/gsd-validator.md`
**Impact**: Eliminates 100% tool duplication
**Status**: complete (2026-04-06)

### Phase 5: Wire Utility Agents into GSD Workflows
**Goal**: Integrate repo-doc-architect into /gsd:finalize and repo-commit-documenter into /gsd:ship workflows.
**Files**: `~/.claude/get-shit-done/workflows/finalize.md`, `~/.claude/get-shit-done/workflows/ship.md`
**Impact**: Automatic documentation updates on finalization and shipping
**Status**: pending

### Phase 6: Introduce Tool-Access Tiers
**Goal**: Define 4 tiers (Explore, Research, Modify, Full) and assign each agent to appropriate tier. Audit and restrict over-granted tool access.
**Files**: All `~/.claude/agents/*.md` files — update `tools:` frontmatter
**Impact**: Clearer capability boundaries, reduced over-granting
**Status**: pending

### Phase 7: Add Quality Sections to Low-Scoring Agents
**Goal**: Add "what NOT to do", output format specs, and error handling instructions to agents scoring 6-7/10.
**Agents**: gsd-user-profiler, architect, scaffolder, auditor, validator, memory-seeder, extension-validator, hook-engineer, plugin-builder, gsd-plan-checker (if still exists), gsd-integration-checker (if still exists), gsd-nyquist-auditor (if still exists), gsd-codebase-mapper, gsd-assumptions-analyzer, gsd-research-synthesizer, gsd-ui-checker, gsd-ui-auditor
**Note**: Some agents may have been consolidated in earlier phases — apply to surviving agents only
**Impact**: More predictable agent behavior, fewer revision cycles
**Status**: pending

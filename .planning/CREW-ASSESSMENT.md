# GSD Crew Assessment

**Date:** 2026-04-03
**Assessed by:** `/gsd:crew --assess`
**Agent count:** 37 (18 GSD workflow + 16 user utility + 3 project-specific)
**Workflow count:** 56

---

## COVERAGE

### Workflow Steps Covered
17 of 18 GSD agents are actively referenced across 19 workflow files.

### Coverage Gaps (workflow steps with no dedicated agent)

| Gap | Affected Workflows | Suggested Fix |
|-----|--------------------|---------------|
| Git orchestration (commit, push, branch mgmt) | ship, finalize, commit-push-pr | Handled inline by orchestrator — acceptable for now |
| Session state management (compaction, token budgeting) | All long-running workflows | Consider `gsd-session-manager` agent for token-aware context control |
| Hook validation/enforcement | hookify, settings workflows | Covered by hookify skill, not an agent gap |
| CI/CD pipeline operations | deploy, ship | Static site — no CI pipeline needed for this project |
| Documentation generation | finalize, wrap | `repo-doc-architect` exists but not wired into GSD workflows |
| Metrics collection/reporting | stats, session-report | Handled inline — low priority |

### Orphan Agents (never spawned by any workflow)

| Agent | Type | Status |
|-------|------|--------|
| `obsidian-design` | Project | Intentional — project domain specialist |
| `content-engine` | Project | Intentional — project domain specialist |
| `interactions` | Project | Intentional — project domain specialist |
| `mirror-universe-pete` | User | Standalone utility — no workflow needed |
| `google-media-generation` | User | Standalone utility |
| `gpt-image-1-expert` | User | Standalone utility |
| `sora-video-generator` | User | Standalone utility |
| `sdk-installer` | User | Standalone utility |
| `mcp-performance-diagnostics` | User | Standalone utility |
| `repo-doc-architect` | User | Could integrate into `/gsd:finalize` |
| `repo-commit-documenter` | User | Could integrate into `/gsd:ship` |

**Verdict:** 3 project agents are intentionally scoped outside GSD. 6 user utilities are standalone by design. 2 utility agents (`repo-doc-architect`, `repo-commit-documenter`) could be wired into GSD workflows for better integration.

---

## OVERLAPS

### HIGH Severity (>60% tool + keyword overlap)

| Pair | Tool Overlap | Keyword Overlap | Avg | Recommendation |
|------|-------------|-----------------|-----|----------------|
| gsd-phase-researcher ↔ gsd-project-researcher | 100% | 25% | 62.5% | Consolidate into `gsd-research-orchestrator` with scope parameter |
| extension-validator ↔ validator | 100% | 43% | 71.4% | Merge into `gsd-validator-hub` with target parameter |
| gsd-nyquist-auditor ↔ gsd-verifier | 83% | 43% | 63.1% | Make Nyquist a mode of gsd-verifier |
| gsd-integration-checker ↔ gsd-verifier | 67% | 57% | 61.9% | Nest as verification mode within gsd-verifier |
| gsd-plan-checker ↔ gsd-verifier | 67% | 57% | 61.9% | Plan-checker becomes gsd-verifier mode |
| gsd-codebase-mapper ↔ gsd-advisor-researcher | 83% | 40% | 61.7% | Merge into `gsd-architecture-advisor` |
| gsd-assumptions-analyzer ↔ gsd-codebase-mapper | 83% | 40% | 61.7% | Consolidate into unified research platform |

### MEDIUM Severity (top 5 of 214)

| Pair | Avg Overlap | Note |
|------|-------------|------|
| gsd-project-researcher ↔ gsd-assumptions-analyzer | 58.3% | Research-phase agents with distinct domains |
| gsd-phase-researcher ↔ gsd-advisor-researcher | 58.3% | Phase vs project research boundary blurred |
| gsd-roadmapper ↔ gsd-executor | 56.7% | Planning vs execution — distinct roles, shared tools |
| gsd-ui-auditor ↔ gsd-ui-checker | 55.0% | Post-impl audit vs pre-planning check |
| gsd-planner ↔ gsd-roadmapper | 51.7% | Strategic vs tactical planning |

### Tool Duplication Patterns

| Profile | Tool Set | Agent Count | Issue |
|---------|----------|-------------|-------|
| Read-Only Research | Read, Bash, Glob, Grep | 9 | Nine agents share identical base — responsibility boundaries unclear |
| Full-Edit | Read, Write, Edit, Bash, Glob, Grep | 5 | No tool-level differentiation between planning, execution, debugging |
| Research + Web | + WebSearch, WebFetch | 4 | Web-enabled research agents overlap in methodology |
| Full Stack + MCP | + context7, firecrawl, exa | 3 | Maximum access granted to 3 agents — audit MCP necessity |
| UI-Specific | Read, Bash, Glob, Grep | 3 | All UI agents share identical tools; phase is the only differentiator |

---

## QUALITY SCORES

Scored against best-in-class agents (gsd-planner, gsd-verifier) on: description clarity, tool justification, error handling instructions, output format spec, and "what NOT to do" section.

| Agent | Score | Key Deficiency |
|-------|-------|----------------|
| gsd-planner | 9/10 | — |
| gsd-verifier | 9/10 | — |
| gsd-executor | 8/10 | No explicit error recovery instructions |
| gsd-debugger | 8/10 | — |
| gsd-roadmapper | 8/10 | — |
| gsd-phase-researcher | 7/10 | Multi-line YAML description (parsing issues in tooling) |
| gsd-project-researcher | 7/10 | Multi-line YAML description |
| gsd-advisor-researcher | 7/10 | Multi-line YAML description |
| gsd-ui-researcher | 7/10 | Multi-line YAML description |
| gsd-plan-checker | 7/10 | No "what NOT to do" section |
| gsd-integration-checker | 7/10 | No output format spec |
| gsd-nyquist-auditor | 7/10 | No output format spec |
| gsd-codebase-mapper | 7/10 | No error handling instructions |
| gsd-assumptions-analyzer | 7/10 | No "what NOT to do" section |
| gsd-research-synthesizer | 7/10 | No error handling instructions |
| gsd-ui-checker | 7/10 | No output format spec |
| gsd-ui-auditor | 7/10 | No output format spec |
| gsd-user-profiler | 6/10 | Narrow scope, no error handling |
| architect | 6/10 | Multi-line YAML description, no output format |
| scaffolder | 6/10 | Multi-line YAML description |
| auditor | 6/10 | Multi-line YAML description |
| validator | 6/10 | Multi-line YAML description |
| memory-seeder | 6/10 | Multi-line YAML description, no error handling |
| extension-validator | 6/10 | Multi-line YAML description |
| hook-engineer | 6/10 | Multi-line YAML description |
| plugin-builder | 6/10 | Multi-line YAML description |
| obsidian-design | 7/10 | Project-specific, well-scoped |
| content-engine | 7/10 | Project-specific, well-scoped |
| interactions | 7/10 | Project-specific, well-scoped |

**Pattern:** 8 agents use multi-line YAML `description: >` blocks that cause parsing failures in metadata extraction tooling. These should be converted to single-line descriptions.

---

## BOTTLENECKS

| Issue | Impact | Evidence |
|-------|--------|----------|
| Verification triad (verifier + integration-checker + plan-checker) spawned sequentially | Slows plan-phase and verify-work pipelines | 3 agents doing similar work with 60%+ overlap |
| Research agents (phase + project + advisor) spawned in parallel but produce overlapping output | Wasted tokens on duplicated analysis | 100% tool overlap between phase and project researchers |
| Multi-line YAML descriptions | Breaks automated metadata extraction and tooling | 8 of 37 agents affected |
| No execution history in .planning/ | Cannot measure actual bottleneck duration | This is the first milestone; no phase execution data exists yet |

---

## IMPROVEMENT PLAN (prioritized)

### Priority 1: Fix YAML Parsing (8 agents)
**Action:** Convert all multi-line `description: >` blocks to single-line strings in agent frontmatter.
**Agents:** architect, scaffolder, auditor, validator, memory-seeder, extension-validator, hook-engineer, plugin-builder
**Impact:** Fixes metadata extraction tooling, improves `/gsd:crew` roster accuracy.
**Effort:** 30 minutes

### Priority 2: Consolidate Verification Agents
**Action:** Merge gsd-plan-checker, gsd-integration-checker, and gsd-nyquist-auditor into gsd-verifier as configurable modes (`scope: plan | integration | nyquist | general`).
**Agents:** gsd-verifier absorbs 3 agents → net reduction of 3
**Impact:** Simplifies orchestrator routing, reduces token spend on overlapping verification.
**Effort:** 4-6 hours including workflow updates

### Priority 3: Consolidate Research Agents
**Action:** Merge gsd-phase-researcher and gsd-project-researcher into `gsd-research-orchestrator` with scope parameter.
**Agents:** 2 → 1, net reduction of 1
**Impact:** Eliminates 100% tool duplication, clearer research responsibility.
**Effort:** 2-3 hours

### Priority 4: Merge Validator Agents
**Action:** Merge extension-validator and validator into single `gsd-validator-hub`.
**Agents:** 2 → 1, net reduction of 1
**Impact:** Eliminates 100% tool duplication.
**Effort:** 1-2 hours

### Priority 5: Wire Utility Agents into GSD Workflows
**Action:** Integrate `repo-doc-architect` into `/gsd:finalize` and `repo-commit-documenter` into `/gsd:ship`.
**Impact:** Automatic documentation updates on finalization and shipping.
**Effort:** 1-2 hours

### Priority 6: Introduce Tool-Access Tiers
**Action:** Define 4 tiers (Explore, Research, Modify, Full) and assign each agent to a tier. Audit whether agents have more tool access than they need.
**Impact:** Clearer capability boundaries, reduced over-granting.
**Effort:** 3-4 hours to define tiers and refactor all agents

### Priority 7: Add Quality Sections to Low-Scoring Agents
**Action:** Add "what NOT to do", output format specs, and error handling instructions to agents scoring 6-7/10.
**Impact:** More predictable agent behavior, fewer revision cycles.
**Effort:** 2-3 hours

---

## POST-CONSOLIDATION TARGET

| Metric | Current | Target |
|--------|---------|--------|
| Total agents | 37 | 31-32 |
| HIGH overlap pairs | 7 | 0 |
| Agents with YAML parsing issues | 8 | 0 |
| Agents below 7/10 quality | 8 | 0 |
| Verification agents | 4 | 1 (multi-mode) |
| Research agents | 3 | 2 (orchestrator + synthesizer) |

# Project: GSD Crew Consolidation

## Goal
Self-improve the GSD agent ecosystem by fixing parsing issues, consolidating overlapping agents, improving quality scores, and wiring utility agents into workflows. This is the GSD system improving itself.

## Target Files
- **Agent definitions**: `~/.claude/agents/*.md` (34 user-level agents)
- **Workflow files**: `~/.claude/get-shit-done/workflows/*.md` (56 workflows)
- **Project agents**: `.claude/agents/*.md` (3 project-specific — not targets)

## Constraints
- All modifications target files OUTSIDE this repo (user-level Claude Code config)
- Agent files use YAML frontmatter + markdown body format
- Workflows reference agents by name — renaming agents requires updating all workflow references
- Consolidation means merging agent capabilities, not deleting functionality
- Project agents (content-engine, interactions, obsidian-design) are intentionally scoped and untouched

## Success Criteria
- Total agents: 37 → 31-32
- HIGH overlap pairs: 7 → 0
- YAML parsing issues: 8 → 0
- Agents below 7/10 quality: 8 → 0
- Verification agents: 4 → 1 (multi-mode)
- Research agents: 3 → 2 (orchestrator + synthesizer)

## Source
All priorities derived from `.planning/CREW-ASSESSMENT.md` (2026-04-03)

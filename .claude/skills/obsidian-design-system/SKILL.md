---
name: obsidian-design-system
description: Canonical reference for the Obsidian Design System tokens, rules, and conventions. Shared knowledge for all agents working on CSS, HTML templates, or component design. Use when applying design tokens, checking color/font/spacing values, or ensuring visual consistency.
---

# Obsidian Design System Reference

Philosophy: **"Signal over decoration. Data is the hero. One accent, used intentionally."**

## Color Tokens

### Dark Theme (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#09090b` | Page background (warm near-black, NOT cold #000) |
| `--surface` | `#111113` | Card/panel backgrounds |
| `--surface-alt` | `#18181b` | Alternate surface (hover states, nested panels) |
| `--border` | `#27272a` | All borders (1px solid, NEVER box-shadow for separation) |
| `--text` | `#fafafa` | Primary text |
| `--text-secondary` | `#a1a1aa` | Secondary text |
| `--text-muted` | `#71717a` | Muted/tertiary text |
| `--accent` | `#22d3ee` | Cyan accent (SINGLE accent — no multi-color palettes) |
| `--accent-muted` | `rgba(34, 211, 238, 0.1)` | Accent backgrounds, hover states |
| `--accent-hover` | `#06b6d4` | Accent hover/active state |
| `--success` | `#4ade80` | Success states |
| `--warning` | `#fbbf24` | Warning states |
| `--error` | `#ef4444` | Error states |

### Light Theme (`[data-theme="light"]`)

| Token | Dark | Light |
|-------|------|-------|
| `--bg` | `#09090b` | `#fafafa` |
| `--surface` | `#111113` | `#ffffff` |
| `--surface-alt` | `#18181b` | `#f4f4f5` |
| `--border` | `#27272a` | `#e4e4e7` |
| `--text` | `#fafafa` | `#09090b` |
| `--text-secondary` | `#a1a1aa` | `#52525b` |
| `--text-muted` | `#71717a` | `#a1a1aa` |
| `--accent` | `#22d3ee` | `#0891b2` |
| `--accent-muted` | `rgba(34, 211, 238, 0.1)` | `rgba(8, 145, 178, 0.1)` |
| `--accent-hover` | `#06b6d4` | `#0e7490` |

## Typography

| Token | Size | Usage | Weight | Extra |
|-------|------|-------|--------|-------|
| `--text-label` | `9px` | Labels | 500 | uppercase, `0.1em` tracking |
| `--text-caption` | `11px` | Captions | 400 | |
| `--text-body` | `13px` | Body text | 400 | |
| `--text-data-sm` | `16px` | Small data values | 600 | mono |
| `--text-data-lg` | `24px` | Large data values | 600 | mono |
| `--text-header` | `20px` | Section headers | 500 | `-0.01em` tracking |
| `--text-metric` | `36px` | Metrics | 600 | mono, `-0.02em` tracking |
| `--text-hero` | `48px` | Hero headlines | 600 | mono, `-0.02em` tracking |

**Font stacks:**
- Sans: `"Geist", "Satoshi", "Plus Jakarta Sans", system-ui, sans-serif`
- Mono: `"Geist Mono", "JetBrains Mono", "SF Mono", monospace`

## Spacing (4px base unit)

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |
| `--space-3xl` | `64px` |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Pills, badges |
| `--radius-md` | `6px` | Inputs, small cards |
| `--radius-lg` | `8px` | Panels, major cards |
| `--radius-xl` | `12px` | Modals, hero elements |

## Transitions

| Token | Value |
|-------|-------|
| `--transition-fast` | `100ms ease-out` |
| `--transition-base` | `200ms ease-out` |
| `--transition-slow` | `300ms ease-out` |

## Rules (Enforced)

1. **Three-tier text hierarchy only** — `--text`, `--text-secondary`, `--text-muted`. No other text colors.
2. **One accent color** — `--accent` (cyan). Never introduce additional accent hues.
3. **Borders, not shadows** — Use `1px solid var(--border)` for separation. Never `box-shadow` for layout structure.
4. **No `!important`** in component styles.
5. **Mobile-first** media queries always.
6. **4px grid** — All spacing values must be multiples of 4.
7. **Geist fonts only** — No Product Sans, Roboto, or other font families on Obsidian pages.

## Background Pattern

The site uses a subtle grid overlay on `body::before`:
```css
background-image:
  linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
background-size: 64px 64px;
```

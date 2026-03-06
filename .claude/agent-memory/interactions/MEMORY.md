# Interactions — Memory

## Project State

- Main JS: `js/site.js` (~19KB) — IIFE pattern, 7 modules
- Career JS: `career-content/js/` — 4 files (loader, main, scroll-animations, video-player)
- No build step — files served as-is, no bundling or minification pipeline
- Goal: harden all interactions, add skeleton states, improve error resilience

## site.js Module Map

1. `initCarousel()` — horizontal scroll with cyan progress bar
2. `initVideoThumbnails()` — lazy YouTube (thumbnail → iframe on click)
3. Case study cards — selection state, detail panel rendering
4. Creative gallery — category filtering
5. Lightbox — overlay for images/content
6. Smooth scroll — anchor navigation
7. Theme toggle — light/dark with localStorage persistence

## Career Content JS

- `loader.min.js` — runs before render, sets theme class on body
- `main.min.js` — theme toggle button + mobile hamburger nav
- `scroll-animations.js` — IntersectionObserver-based reveal animations
- `video-player.js` — YouTube embed management

## Hardening Priorities

1. Gallery: no error handling for missing images, no empty-state, filter doesn't persist
2. YouTube embeds: no timeout, no fallback on load failure
3. Carousel: no edge case handling for single item or zero items
4. No skeleton/placeholder states for async content
5. Theme toggle: works but may flash wrong theme on slow connections

## Code Patterns

- All modules use IIFE wrapper: `(function() { 'use strict'; ... })();`
- Init functions called from DOMContentLoaded
- DOM queries use `document.getElementById` and `document.querySelectorAll`
- No framework — vanilla JS only
- No console.log allowed in committed code

## Fixes Completed (Update as you harden)

- (none yet — update after first fix)

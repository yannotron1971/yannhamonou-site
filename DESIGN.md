# Design

## Theme

Dark-default with visitor-facing toggle. Four modes:

| Class | Name | Character |
|---|---|---|
| *(none)* | Dark | Near-black canvas, warm off-white type — the default |
| `.is-light.tone-warm` | Light Warm | Parchment-tinted surface, dark ink |
| `.is-light.tone-cool` | Light Cool | Blue-grey surface, near-black ink |
| `.is-light.tone-bright` | Light Bright | Pure white surface, near-black ink |

Theme class applied to `<body>`. Persisted to `localStorage` (`v4-theme`, `v4-paper`). Applied synchronously before first paint via inline `<script>` in `<head>` to prevent flash.

## Color Palette

All values in CSS custom properties. Full set re-declared per theme selector.

### Dark (default — no class)

```css
--v4-bg:          oklch(0.100 0.000 0);   /* #0A0A0A — page background */
--v4-bg-2:        oklch(0.121 0.000 0);   /* #111111 — alt background */
--v4-panel:       oklch(0.146 0.000 0);   /* #161616 — card / elevated surface */
--v4-panel-2:     oklch(0.170 0.000 0);   /* #1B1B1B — nested surface */
--v4-panel-3:     oklch(0.193 0.000 0);   /* #202020 — hover surface */
--v4-line:        rgba(255 255 255 / 0.10);
--v4-line-soft:   rgba(255 255 255 / 0.06);
--v4-ink:         oklch(0.954 0.003 75);  /* #F2F2F0 — primary text */
--v4-ink-mute:    oklch(0.591 0.004 75);  /* #8C8C88 — secondary text */
--v4-ink-dim:     oklch(0.407 0.003 75);  /* #5C5C58 — tertiary text */
--v4-accent:      oklch(0.954 0.003 75);  /* #F2F2F0 — accent (white on dark) */
--v4-accent-warm: oklch(0.910 0.025 75);  /* #E6DCC4 — warm off-white headlines */
--v4-smoke-rgb:   255 255 255;
```

### Light Warm (`.is-light.tone-warm`)

```css
--v4-bg:          oklch(0.955 0.015 75);  /* #F2EEE6 */
--v4-bg-2:        oklch(0.920 0.018 75);  /* #E9E4D9 */
--v4-panel:       oklch(0.985 0.008 75);  /* #FBF9F3 */
--v4-panel-2:     oklch(0.963 0.014 75);  /* #F4F0E8 */
--v4-panel-3:     oklch(0.940 0.016 75);  /* #EDE8DE */
--v4-line:        rgba(20 18 12 / 0.14);
--v4-line-soft:   rgba(20 18 12 / 0.08);
--v4-ink:         oklch(0.161 0.008 75);  /* #17150F */
--v4-ink-mute:    oklch(0.463 0.012 75);  /* #6E695E */
--v4-ink-dim:     oklch(0.672 0.010 75);  /* #A8A294 */
--v4-accent:      oklch(0.161 0.008 75);  /* #17150F */
--v4-accent-warm: oklch(0.207 0.010 75);  /* #2A241C */
--v4-smoke-rgb:   80 60 20;
```

### Light Cool (`.is-light.tone-cool`)

```css
--v4-bg:          oklch(0.940 0.008 240); /* #EDEFF2 */
--v4-bg-2:        oklch(0.905 0.010 240); /* #E2E5EA */
--v4-panel:       oklch(0.981 0.004 240); /* #FAFBFC */
--v4-panel-2:     oklch(0.950 0.008 240); /* #EFF1F4 */
--v4-panel-3:     oklch(0.925 0.010 240); /* #E7EAEE */
--v4-line:        rgba(15 20 30 / 0.14);
--v4-line-soft:   rgba(15 20 30 / 0.08);
--v4-ink:         oklch(0.148 0.008 240); /* #12151A */
--v4-ink-mute:    oklch(0.429 0.010 240); /* #5E646E */
--v4-ink-dim:     oklch(0.650 0.008 240); /* #9CA1AA */
--v4-accent:      oklch(0.148 0.008 240); /* #12151A */
--v4-accent-warm: oklch(0.191 0.010 240); /* #1E232B */
--v4-smoke-rgb:   20 30 60;
```

### Light Bright (`.is-light.tone-bright`)

```css
--v4-bg:          oklch(1.000 0.000 0);   /* #FFFFFF */
--v4-bg-2:        oklch(0.960 0.000 0);   /* #F3F3F3 */
--v4-panel:       oklch(0.980 0.000 0);   /* #FAFAFA */
--v4-panel-2:     oklch(0.965 0.000 0);   /* #F5F5F5 */
--v4-panel-3:     oklch(0.945 0.000 0);   /* #EEEEEE */
--v4-line:        rgba(0 0 0 / 0.13);
--v4-line-soft:   rgba(0 0 0 / 0.07);
--v4-ink:         oklch(0.130 0.000 0);   /* #0E0E0E */
--v4-ink-mute:    oklch(0.440 0.003 75);  /* #66665F */
--v4-ink-dim:     oklch(0.680 0.003 75);  /* #ABABA3 */
--v4-accent:      oklch(0.130 0.000 0);   /* #0E0E0E */
--v4-accent-warm: oklch(0.161 0.000 0);   /* #161616 */
--v4-smoke-rgb:   0 0 0;
```

## Typography

### Font Stack

```css
--v4-display: 'Archivo', system-ui, sans-serif;
--v4-sans:    'Inter', system-ui, sans-serif;
--v4-mono:    'Geist Mono', 'JetBrains Mono', ui-monospace, monospace;
```

Google Fonts import:
```
Archivo:wght@400;500;600;700;800;900 + Inter:wght@300;400;500;600;700 + Geist+Mono:wght@400;500
```

### Display (Archivo)

Used at `font-stretch: 75%` (condensed), uppercase, for all large headlines. This is the visual signature of the site — do not use Archivo at normal stretch.

- **Hero H1:** `clamp(30px, 8.6vw, 48px)` mobile / `clamp(56px, 11vw, 168px)` desktop · `line-height: 0.88` · `letter-spacing: -0.025em` · weight 800–900
- **Section H2:** `clamp(36px, 5vw, 72px)` · `line-height: 0.92` · weight 700–800
- **Work card name:** `22px` · weight 700

### Body (Inter)

- **Base:** `15px` · `line-height: 1.55` · weight 400
- **Body large:** `17–18px` for intro paragraphs
- **Small / meta:** `13px` · weight 400–500

### Mono (Geist Mono)

Used for eyebrows, labels, stats, metadata. `11–13px` · uppercase · `letter-spacing: 0.05–0.08em`.

## Layout

```css
--v4-maxw:    1320px;
--v4-gutter:  clamp(20px, 4vw, 56px);
```

- `.v4-wrap` — max-width container, centered, horizontal padding = `--v4-gutter`
- Sections use `padding-block: clamp(64px, 9vw, 140px)`
- `.tight` sections use `padding-block: clamp(48px, 6vw, 88px)`

## Spacing Scale

Rough rhythm: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128px. Not tokenised as named vars — applied contextually.

## Components

### Nav (`.v4-nav`)

Sticky. `backdrop-filter: blur(12px)`. Background: `rgba(10 10 10 / 0.78)` dark / equivalent translucent in light modes. Left: brand mark. Center: desktop nav links (hidden ≤760px). Right: theme toggle pill + hamburger (mobile) + Contact CTA.

### Theme Toggle

Pill switch with sliding knob. Moon/sun icons. Single source of truth for `is-light` + `tone-*` on `<body>`.

### Mobile Drawer

Full-screen overlay, blurred, big condensed uppercase nav links. `z-index: 500`. Auto-closes on route change.

### Work Cards

Horizontally-scrollable rail. Each card has an image slot + bottom overlay foot: client name · year · descriptor · big stat. Overlay text always `oklch(0.965 0.014 75)` (light) regardless of theme, as it sits over imagery.

### Contact Form

Panel at `--v4-panel`. `border-radius: 16px`. Fields: Name · Email · Company · Goal tag-picker (multi-select pills) · Brief textarea · Send. Client-side; wired to Formspree or equivalent.

### Smoke Wisps

Absolutely-positioned `div`s. `filter: blur(40px)`. `opacity: 0.5`. Dark: `mix-blend-mode: screen`. Light: `mix-blend-mode: multiply` (tinted via `--v4-smoke-rgb`). Inside `overflow: hidden` containers only — never cause scroll. Gated behind `@media (prefers-reduced-motion: no-preference)`.

### Cards & Surfaces

`border-radius: 16px` for panels, form containers. `border-radius: 999px` for pills and tags.

## Motion

All scripted motion lives in `src/scripts/motion.js` (GSAP + ScrollTrigger, loaded once from
`Layout.astro`). Everything sits inside a `prefers-reduced-motion: no-preference` matchMedia
context, so reduced-motion visitors and no-JS visitors get the static page.

### Layers

| Layer | What it covers | Treatment |
|---|---|---|
| Hero | `.v4-hero` on the homepage | Timeline: smoke fade, eyebrow drop, headline lines stagger, rule wipe, supporting content rise |
| Lead block | First `.v4-block` on any page without a hero | Page-load rise, `y: 26` · `0.9s` · `expo.out`, layers offset 90ms |
| Section heads | `.v4-section-head` | `y: 22` · `0.8s` · `expo.out`, children stagger 100ms |
| Item groups | `.v4-works-rail` (slides `x: 56`), `.v4-services`, `.v4-testimonials`, `.v4-posts`, `.v4-intro__stats`, plus any grid or ≥3-child flex container found structurally | Sibling stagger, `y: 24` · `0.75s` · `power3.out`, total stagger capped at 450ms |
| Copy runs | Consecutive headings/paragraphs/buttons in a section wrap | `y: 18` · `0.75s` · `expo.out`, stagger 70ms |
| Stats | `.v4-stat__num`, `[data-count]` | Count-up to value, `1.4s` · `power2.out`, exact source text restored on completion |
| Ambient | `.v4-smoke`, hero scroll arrow | Slow looping drift, `sine.inOut` |

Item groups go through `ScrollTrigger.batch`, not one shared trigger. At desktop widths a grid's
items sit side by side and enter as a single batch that staggers; the same grid collapsed to one
column at ≤760px would otherwise run its whole stagger the moment item 1 crossed the line, leaving
items 2 and 3 already settled before they scrolled into view. Batching gives each stacked item its
own entrance.

Scroll reveals fire once at `top 88%` (`top 85%` for the hand-tuned groups). Inner pages carry
no reusable class hooks, so the generic pass reads each `.v4-block`'s wrap structurally and picks
the copy-run or item-group treatment per layer. `.v4-prose` article bodies are deliberately
untouched — no per-paragraph reveals in long-form reading.

### Rules

- Entrance animations end fully visible. Never gate content visibility on a class-triggered transition.
- Hand-tuned moments mark their targets with `data-motion`; the generic pass steps around them so nothing animates twice.
- A watchdog force-completes every pending reveal if the GSAP ticker never advances (throttled tab, headless render) and on `beforeprint`, so no section can ship blank.
- `ScrollTrigger.refresh()` runs on `document.fonts.ready` — the Archivo swap at `font-stretch: 75%` shifts layout enough to leave triggers at stale offsets.
- Hover: links fade `0.15s ease`. Buttons invert `0.2s ease`. Cards lift to `--v4-panel-3` `0.2s ease`.
- Reduced motion: crossfade or instant transition only.

## Accessibility

WCAG AA across all four themes. Body text contrast ≥ 4.5:1 vs background. Large display type ≥ 3:1. All interactive elements keyboard-focusable with visible focus ring. Theme toggle announces state change to screen readers via `aria-label`.

# Handoff: Yann Hamonou — Marketing Consultant Site (v4 "Nava" direction)

## Overview
A marketing/portfolio website for **Yann Hamonou**, a B2B marketing consultant based in Stonehaven, Aberdeenshire. The "v4 / Nava" direction is a **dark premium agency** aesthetic: near-black canvas, warm off-white display type, condensed uppercase headlines, monospaced labels, and atmospheric blurred "smoke" wisps. It ships with a **visitor-facing dark ⇄ light theme toggle** (light has three paper tones: warm, cool, bright) and is **fully responsive** (desktop, tablet, mobile with a drawer nav).

The site is a single-page app with client-side routing across: Home, About, Services (+ 5 service detail pages), Work (case-study index + detail), Journal (blog index + posts), Contact, Privacy Policy, and an Aberdeen Marketing Agency landing page.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — prototypes that show the intended look, layout, and behavior. **They are not meant to be shipped as-is.** They use in-browser Babel transpilation, global-scope components, and inline `<style>` blocks — fine for a prototype, wrong for production.

Your task is to **recreate these designs in the target codebase's real environment** using its established patterns, component library, router, and build tooling. If there is no existing environment, choose an appropriate modern stack (the design maps very naturally to **Next.js / React + a CSS solution that supports CSS custom properties**, since the entire theming system is already expressed as CSS variables).

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, interactions, hover states, and responsive behavior are all specified and present in the prototype. Recreate the UI pixel-faithfully using the codebase's libraries. Exact hex values, fonts, and the full token set are documented below.

---

## Design Tokens

All theming is driven by CSS custom properties on the root/`body.v4` element. **Dark is the default.** Light mode is `body.v4.is-light` plus one tone class (`tone-warm` | `tone-cool` | `tone-bright`). Implement these as your theme tokens (CSS vars, Tailwind theme, or design-token JSON) — the whole UI references them, so theming "just works" if you preserve them.

### Fonts (Google Fonts)
- **Display** (`--v4-display`): **Archivo** — weights 400/500/600/700/800/900. Used at `font-stretch: 75%` (condensed), uppercase, for all big headlines.
- **Body** (`--v4-sans`): **Inter** — weights 300–700.
- **Mono** (`--v4-mono`): **Geist Mono** (fallback JetBrains Mono / ui-monospace) — weights 400/500. Used for eyebrows, labels, stats, metadata.

Import string used in the prototype:
```
https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&display=swap
```

### Layout tokens
| Token | Value |
|---|---|
| `--v4-maxw` | `1320px` (content max width) |
| `--v4-gutter` | `clamp(20px, 4vw, 56px)` (horizontal page padding) |
| Base font size | `15px`, line-height `1.55` |

### Color tokens — DARK (default)
| Token | Hex | Role |
|---|---|---|
| `--v4-bg` | `#0A0A0A` | page background |
| `--v4-bg-2` | `#111111` | alt background |
| `--v4-panel` | `#161616` | card / elevated surface |
| `--v4-panel-2` | `#1B1B1B` | nested surface |
| `--v4-panel-3` | `#202020` | hover surface |
| `--v4-line` | `rgba(255,255,255,0.10)` | borders |
| `--v4-line-soft` | `rgba(255,255,255,0.06)` | hairlines |
| `--v4-ink` | `#F2F2F0` | primary text |
| `--v4-ink-mute` | `#8C8C88` | secondary text |
| `--v4-ink-dim` | `#5C5C58` | tertiary text |
| `--v4-accent` | `#F2F2F0` | accent (white on dark) |
| `--v4-accent-warm` | `#E6DCC4` | warm off-white — headlines, stats, selection |

### Color tokens — LIGHT · WARM (`.is-light`, `.tone-warm`)
bg `#F2EEE6` · bg-2 `#E9E4D9` · panel `#FBF9F3` · panel-2 `#F4F0E8` · panel-3 `#EDE8DE` · line `rgba(20,18,12,0.14)` · line-soft `rgba(20,18,12,0.08)` · ink `#17150F` · ink-mute `#6E695E` · ink-dim `#A8A294` · accent `#17150F` · accent-warm `#2A241C`

### Color tokens — LIGHT · COOL (`.tone-cool`)
bg `#EDEFF2` · bg-2 `#E2E5EA` · panel `#FAFBFC` · panel-2 `#EFF1F4` · panel-3 `#E7EAEE` · line `rgba(15,20,30,0.14)` · line-soft `rgba(15,20,30,0.08)` · ink `#12151A` · ink-mute `#5E646E` · ink-dim `#9CA1AA` · accent `#12151A` · accent-warm `#1E232B`

### Color tokens — LIGHT · BRIGHT (`.tone-bright`)
bg `#FFFFFF` · bg-2 `#F3F3F3` · panel `#FAFAFA` · panel-2 `#F5F5F5` · panel-3 `#EEEEEE` · line `rgba(0,0,0,0.13)` · line-soft `rgba(0,0,0,0.07)` · ink `#0E0E0E` · ink-mute `#66665F` · ink-dim `#ABABA3` · accent `#0E0E0E` · accent-warm `#161616`

### Type scale (key sizes)
- Hero headline: `clamp(56px, 11vw, 168px)`, condensed (`font-stretch:75%`), `line-height:0.88`, `letter-spacing:-0.025em`, uppercase. **Mobile (≤480px) override:** `clamp(30px, 8.6vw, 48px)`.
- Section headlines: `clamp(36px, 5vw, 72px)`.
- Eyebrow / labels: mono, ~11–13px, uppercase, `letter-spacing:.05–.08em`.
- Work-card name: Archivo 700, condensed, 22px, uppercase.

### Radius / effects
- Cards & form panels: border-radius `16px` (sub-page forms), works cards rounded; pills/tags `999px`.
- "Smoke" wisps: absolutely-positioned divs, `filter: blur(40px)`, `opacity:0.5`, `mix-blend-mode: screen` (dark) / `multiply` (light, tinted via `--v4-smoke-rgb`). Decorative only — gate behind a reduced-motion / "atmosphere" toggle. They must live inside `overflow:hidden` containers so they never cause page scroll.
- Nav: sticky, `backdrop-filter: blur()`, translucent bg `rgba(10,10,10,0.78)`.

---

## Screens / Views

> Routing model: a single `route` object `{ page, slug }`. `navigate({page, slug})` swaps the view and scrolls to top. Pages: `home`, `about`, `content` (service detail, by slug), `work` (case index), `case` (case detail, by slug), `blog` (journal index), `post` (blog post, by slug), `contact`, `privacy`, `aberdeen`.

### Global chrome
- **Top nav** (`.v4-nav`): sticky, blurred. Left: brand "● Yann.Hamonou". Center (desktop only, hidden ≤760px): About / Services / Work / Journal. Right: **theme toggle** (pill switch, sliding knob, moon/sun icons), **hamburger** (≤760px only), **"● Contact Me"** CTA pill.
  - Nav center links: on Home they smooth-scroll to the relevant section; on any sub-page they route to the dedicated page.
- **Mobile drawer** (`.v4-mobile-menu`, ≤760px): full-screen overlay, blurred, big condensed uppercase links (About/Services/Work/Journal/Contact) + round close button. Opens from hamburger; auto-closes on route change.
- **Footer** (`.v4-footer`): multi-column — brand + socials (LinkedIn/Email/Phone, real `href`s), **Pages** (Home/About/Services/Work/Journal/Contact), **Explore** (Aberdeen Agency/SEO/Case Studies/Privacy), **Contact** (clickable phone/email + address). Bottom bar: copyright + Privacy Policy / Contact links. Grid: 5-col → 3-col (≤920px) → 2-col (≤760px).

### Home (`page: "home"`)
Sections in order: Hero → Intro → Works (horizontal-scroll case rail) → Services → Partners/stats → Testimonials → Insights/Journal teaser → Closer ("Let's work →" routes to Contact) → Footer.
- **Hero**: giant condensed headline "MARKETING — CONSULTANT ABERDEEN" with a dash-rule indent line, sub-paragraph, atmospheric smoke. Headline color = `--v4-accent-warm`.
- **Works rail**: horizontally-scrollable cards. Each card = a user-fillable **image slot** (drag-drop image) with a bottom overlay foot: client/year **name** + one-line descriptor + a big stat (e.g. "+500%"). Overlay text is **always light** (`#F4F2ED`) in both themes because it sits over imagery. Prev/next controls scroll the rail. Clicking a card routes to that case study.

### Sub-pages (About, Services detail, Work index, Case study, Blog index, Blog post)
These reuse a **legacy editorial layout vocabulary** (class names `.wrap`, `.block`, `.display`, `.eyebrow`, `.muted`, `.mono`, `.btn`, `.btn-primary`, `.tag`, `.link-arrow`). In v4 they are wrapped in `<main class="v4-subpage">`, which **remaps the legacy tokens onto the v4 tokens** so they inherit the dark premium palette + fonts and follow the theme toggle. When you rebuild, you don't need this remap shim — just style these pages with the same token set directly.
- Each sub-page: breadcrumb header → content → a shared **Contact section** (`ContactBlock`) with the brief form.

### Contact (`page: "contact"`)
Header ("Let's talk about *your growth.*") + free-strategy-review pitch. Three points (Diagnose / Prioritise / Plan). A 3-cell **direct-contact rail**: Call `+44 (0) 785 3455816` (tel:), Email `hello@yannhamonou.com` (mailto:), LinkedIn `in/yannhamonou` (external). Then the **brief form**: Name, Email, Company, a goal tag-picker (Strategy/Growth/Positioning/Website/SEO-GEO/Google Ads/Content), Brief textarea, Send button → inline success state. Form panel = `--v4-panel`, radius 16px.

### Privacy Policy (`page: "privacy"`)
Legal header + 7 two-column rows (Who we are, What we collect, How we use it, Analytics & cookies, Data retention, Your rights, Third parties). "Get in touch" link routes to Contact. UK GDPR framing.

### Aberdeen Marketing Agency (`page: "aberdeen"`)
Local SEO landing page. Hero ("Aberdeen *marketing agency* for B2B SMEs.") with two CTAs → Contact / Services. "Why choose a local agency" (3 reasons) → "Challenges I solve" (3, on a panel surface) → Services grid (from data) → engagement-process steps (from data) → Contact block.

---

## Interactions & Behavior
- **Routing**: client-side; `navigate()` sets route and scrolls to top. No full reloads.
- **Theme toggle**: flips `dark ⇄ light`. Theme + paper tone are plain state, **persisted to `localStorage`** (`v4-theme`, `v4-paper`), applied as `body` classes (`is-light` + `tone-*`). The toggle is the single source of truth — keep the control state and the applied class in sync (a past bug was them drifting apart).
- **Mobile nav drawer**: hamburger opens; closes on link click and on route change.
- **Works rail**: prev/next buttons scroll by one card width; native horizontal scroll/swipe on touch.
- **Contact form**: client-side only in the prototype (no backend). On submit → success message. Wire to a real endpoint/email service in production; add validation (required name + valid email).
- **Hover states**: links fade to `--v4-ink`/`--v4-accent-warm`; buttons invert (solid fill → bg color text); cards lift to `--v4-panel-3`.
- **Entrance animations**: gate behind `prefers-reduced-motion`. NOTE: the prototype had a `.page-enter` fade that could get stuck at `opacity:0` on remount — it is neutralized for sub-pages. Make sure any entrance animation's *end state* is the visible base state.

## Responsive Behavior
- **Desktop** (>880px): multi-column grids (services, articles, testimonials), inline nav links.
- **Tablet** (≤880px → ≤760px): grids collapse toward single column; footer 5→3→2 col.
- **Mobile** (≤760px): nav links hidden, hamburger + drawer menu shown. (≤480px): hero headline scales down, dash indent removed, nav cluster tightened (CTA dot hidden, smaller padding). **No horizontal overflow at 390px** — verify this; decorative smoke and the works rail must stay clipped/contained.

## State Management
- `route: {page, slug}` — current view.
- `theme: "dark"|"light"` and `paper: "warm"|"cool"|"bright"` — persisted to localStorage.
- `menuOpen: boolean` — mobile drawer.
- Per-form local state (Contact brief): name, email, company, goal, message, sent.
- Content (services, cases, method steps, testimonials, posts) comes from a single data module (`src/data.js`, `window.SITE_DATA`) — model this as typed data/CMS content in production.

## Assets
- **No bundled raster images.** Work-card imagery uses a drag-and-drop **image slot** placeholder component (`src/image-slot.js`) that the site owner fills in; persisted to localStorage in the prototype. In production, replace with real CMS-managed images.
- **Icons**: inline SVG (hamburger, arrows, moon/sun, close). No icon font.
- **Fonts**: Google Fonts (Archivo, Inter, Geist Mono) — see import above.

## Files (in this bundle, under `src/`)
- `Yann Hamonou Site v4.html` — entry point; shows load order, fonts, body class.
- `v4-styles.css` — **the v4 design system** (tokens, all v4 components, light themes, responsive rules). Primary styling reference.
- `v4-home.jsx` — app shell, router, nav + theme toggle + mobile drawer, home sections, footer.
- `v4-pages.jsx` — Contact, Privacy, Aberdeen pages + the shared `ContactBlock` form.
- `ContentPage.jsx` — service detail + About page (editorial layout).
- `Blog.jsx` — journal index + post.
- `CaseStudy.jsx` — case-study detail.
- `components.jsx` — shared atoms (Breadcrumb, Placeholder, Arrow, etc.).
- `data.js` — all site content (`window.SITE_DATA`: brand, services, cases, method, testimonials, posts, numbers).
- `image-slot.js` — drag-drop image placeholder web component.
- `styles.css` — legacy v1 base styles the editorial sub-pages rely on (tokens get remapped to v4 in the shell).

> Ignore the `v2-*` and `v3-*` files if present — those are earlier exploratory directions, not part of v4.

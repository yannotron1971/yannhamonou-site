# Design — The Edge

Documents the design as built on the `edge-concept` branch. `main` carries the
earlier v4 design and its own copy of this file; the two have diverged
deliberately.

## The idea

One near-black ground, one enormous light-weight line, and mono micro-labels as
the only second voice. The restraint is the design. Inspired by topology.vc, and
built fresh rather than by degrading the Oak & Coast concept toward it — the two
languages are opposites, and mixing them is what made an earlier attempt fail.

The season/theme system was removed on this branch, not overridden: the Edge has
one ground, so there is nothing to switch between.

## Theme

No toggle, no `localStorage`, no light modes. `body` carries `v4 edge`.

Every page has the same shape: a near-black hero, then a white sheet whose
sections each declare a ground, then a pitch-black footer. The homepage's hero
is the full screen, sticky, and holds the field; the sheet rises over it. An
inner page's hero is a little over half a screen, scrolls away normally, and
carries no field — it says what the document is and gets out of the way.

## Colour

### The ground ladder

Tokens live in `global.css` on `body.v4`. One monochrome ladder — warm
off-whites, cool off-whites, three depths of near-black. No hues: a page built
on one light line and mono labels can give every section its own ground and
still read as one material; colour would break it.

| Token | Value | Used by |
|---|---|---|
| `--edge-white` | `#ffffff` | 01 Proposition |
| `--edge-paper` | `#f3f2ee` | Current projects |
| `--edge-ink` | `#151515` | 02 Work, and the hero ground |
| `--edge-mist` | `#eceeee` | 03 Services |
| `--edge-slate` | `#22262a` | 04 Proof |
| `--edge-sand` | `#e8e4dc` | 05 FAQ |
| `--edge-bone` | `#f7f6f3` | 06 Journal |
| `--edge-pitch` | `#0b0c0c` | The close, and the footer |

A block changes ground by swapping one class, anywhere on the site. `--dark`
carries the light token rebinding; each ground class carries only a background.
`--clear` lets the hero field show through.

Grounds are assigned per page rather than by a repeating pattern: Services runs
white then pitch, a case study white then pitch, the SEO page white, paper,
white, mist, white, sand, white, pitch.

`.edge-sheet` rebinds `--v4-bg` and the panel tokens as well as the ink ones.
The inner pages are inline-styled against those, which is what carries their
markup onto a light ground untouched.

### Ink

Three levels, on both the light and the dark sets. Every value is measured, not
picked by eye — the muted levels carry 11–12px text (section labels, row
descriptors, captions), so they need 4.5:1.

| | Light set (on the sheet) | Worst-case ratio | Dark set | Worst-case ratio |
|---|---|---|---|---|
| ink | `#151515` | 14.4 on sand | `#f2f1ec` | 13.5 on slate |
| mute | `#45484a` | 7.27 on sand | `#a2a5a3` | 6.13 on slate |
| dim | `#616467` | 4.70 on sand | `#909391` | 4.91 on slate |

Inner pages use the `body.v4` OKLCH tokens on `#151515`: mute
`oklch(0.70 0.004 75)` at 6.84:1, dim `oklch(0.60 0.003 75)` at 4.63:1.

Client logos are monochrome throughout on the homepage. Four brand palettes side
by side read as a jumble; desaturated, the marks line up as one set. `darkInvert`
flips dark-ink artwork on dark grounds, `lightInk` is the mirror for white-ink
artwork on light ones.

## Typography

| Role | Face | Notes |
|---|---|---|
| Display | Space Grotesk 300 | Light weight at size is the whole trick |
| Body | Inter | 200–500 |
| Labels | Space Mono | 11px, uppercase, 0.16em |

All three are free on Google Fonts; topology's Magnetik and LazareGrotesk are
commercial licences.

- `.edge-h1` — `clamp(52px, 11.5vw, 220px)`, line-height 0.88, `-0.03em`
- `.edge-h2` / `.v4-section-h` — `clamp(36px, 5vw, 72px)`, line-height 1.02
- `.edge-label` / `.v4-eyebrow` — 11px mono, uppercase, 0.16em, ink-dim
- Headings carry `text-wrap: balance`

Sentence case throughout. The display face has no 800 weight and no width axis,
so nothing asks for one — an earlier Archivo-era `font-weight: 800` +
`font-stretch: 75%` pair was being synthesised by the browser on every inner
page.

## Layout

- `.edge-wrap` — `min(100% - clamp(24px, 6vw, 96px), 1440px)`
- `.edge-block` — the shared rhythm, `clamp(80px, 12vh, 180px)`
- `.edge-block--full` — `min-height: 100svh`, contents centred. One screen per
  section is a homepage device: a page of eight statements, each given the
  viewport. A services page, a case study or a post is a document, and it would
  fight the reading there.
- `min-height`, never `height`: a phone, a short laptop or a long FAQ grows past
  the viewport rather than clipping.
- Single breakpoint at 860px on the homepage, 760px for the nav.
- Flat throughout. This design draws with lines, not rounded panels; the pill
  button is the one round thing.

## Components

### Nav (`.v4-nav`)

Sticky. One voice — Space Mono, 11px, uppercase, 0.1em — across brand, links,
dropdown and CTA. Translucent, with `backdrop-filter: blur(14px)` only over the
hero, where there is a live shader to soften; the blur comes off under
`.sheet-active`, where the ground is flat and it would repaint for nothing.

Flips to a light token set past 0.62vh. The services dropdown is a disclosure
(`aria-expanded` + `aria-controls`), not a menu widget.

### The field (`.edge-field`)

Full-bleed WebGL2 canvas at `z-index: -1`, homepage only via a Layout prop. Raw
WebGL, no dependency — a full-screen triangle and one fragment shader; Three.js
would be ~150KB gzipped to draw one quad.

Budgeted for the integrated GPU this site's visitors are on:
`PIXEL_BUDGET` 1.2e6 fragments (~12ms/frame on Intel UHD, against 31ms at the
original 3.2e6), capped at 30fps, and it stops drawing entirely once it has
faded out. `INTENSITY` is the one dial worth turning. Survives context loss:
`webglcontextlost` calls `preventDefault()` and stops the loop, and one rebuild
is attempted on restore.

### The handover (`edge-handover.js`)

Owns everything that happens as the sheet rises: the field's opacity, the nav's
light state, and `inert` on the hero once it is covered. It lives apart from the
field module so that a browser with no WebGL still gets a working nav.

It handles both heroes. The homepage's is sticky and held under the sheet, so
the nav flips at 0.62 of the viewport and the hero leaves the tab order; an
inner page's scrolls away, so the flip waits until its last pixel passes under
the nav, and nothing goes inert — that hero comes back when you scroll up.

### PageHero (`PageHero.astro`)

The inner-page hero: label, title capped at 104px against the homepage's 220,
and an optional lede. `align-content: end`, so the title sits on the fold rather
than floating in an empty band.

### Rows (`.edge-row`)

One rhythm for work, services and journal. Work rows are mark / descriptor /
number — no client name, because the logo is the name, which is also why the alt
text carries it. Journal rows align title and description on their first
baseline above 860px.

## Motion

- `motion.js` — the `.v4-*` pages. Shared with the other branches.
- `edge-motion.js` — the `.edge-*` homepage. One entrance vocabulary, a short
  rise on the way in. `once: true`, opacity and transform only, nothing scrubbed.
  Item groups use `ScrollTrigger.batch` so a list stacked into one column on a
  phone does not run its whole stagger off the first item.
- `smooth-anchors.js` — same-page anchors glide via GSAP's ScrollToPlugin. It
  has to be JS: ScrollTrigger writes `scroll-behavior: auto` inline on `<html>`
  at init, so the stylesheet's `scroll-behavior: smooth` never applies on a page
  that loads motion. No scroll hijack; wheel, trackpad, scrollbar and keyboard
  keep native behaviour.

Everything runs inside a `prefers-reduced-motion: no-preference` gate, and a
watchdog force-finishes every pending reveal if the GSAP ticker never advances —
`gsap.from()` writes `opacity: 0` immediately, so without it a throttled tab
could ship a blank section.

## Accessibility

WCAG AA. Body text ≥ 4.5:1, large display ≥ 3:1 — the ink table above is the
record of that, measured per ground.

- Skip link to `#main` past the nav and its six-service dropdown
- Global `:focus-visible` ring, 2px at `--v4-ink-mute`, 3px offset
- The sticky hero is `inert` once covered, so focus cannot land on it unseen
- The nav CTA is shown and hidden by media query, never by script
- Client logos: the accessible name sits on the link when the mark is a link,
  and on the `alt` when it is not — never both
- The field canvas is `aria-hidden`

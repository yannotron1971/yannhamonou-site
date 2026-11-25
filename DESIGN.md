---
name: Signal Poster
description: Type-led Swiss poster on light paper for yannhamonou.com
colors:
  paper: "#fafaf7"
  stone: "#f0efea"
  ink: "#111111"
  muted: "#4a4a46"
  signal: "#ff4f1a"
  inverse-muted: "#c9c8c2"
  error: "#b42318"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3.25rem, 7.6vw, 7rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
    fontVariation: "wdth 110"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.125rem, 4vw, 3.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.5rem, 2.4vw, 2rem)"
    fontWeight: 800
    lineHeight: 1.05
  body:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "-0.01em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    letterSpacing: "0.04em"
rounded:
  none: "0"
  full: "9999px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "48px"
    padding: "0 24px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
  button-dark-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
  field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "48px"
---

# Design System: Signal Poster

As built on 25 November 2026. Tokens live in `src/styles/global.css`, which wins if this file disagrees with it. The earlier Edge design is in `_Archive/edge-v4/`.

## 1. Overview

**Creative North Star: "The Signal Poster"**

A Swiss poster printed on light paper. Heavy Archivo headlines, one orange, black-and-white photographs of north-east Scotland, sharp corners and 1px ink hairlines. The orange disc is the only ornament: a sun behind Marischal College on the homepage, a half-sun on the horizon of inner pages, and a disc overlapping a circular photo elsewhere.

Pages are stacks of full-width bands separated by hairlines. Paper is the default ground, stone marks a statement, and most pages close on a full orange band with one action. Content sits in a 1360px container with 20, 32 or 40px side padding, on a 12-column grid from 1024px.

**Key Characteristics:**
- One accent colour, used flat.
- Type carries the hierarchy. Photographs are greyscale; case study and journal images take their colour on hover.
- No shadows, gradients or rounded boxes. Circles are the only curve.
- Motion is transform and opacity, and is off under `prefers-reduced-motion`.

## 2. Colors

Near-monochrome, with a single saturated orange.

### Primary
- **Signal** (#ff4f1a): the main button, discs, big figures, the closing band, the dot in the wordmark.

### Neutral
- **Paper** (#fafaf7): default page ground.
- **Stone** (#f0efea): statement bands, image plates, row hover.
- **Ink** (#111111): text, hairlines, dark buttons.
- **Muted** (#4a4a46): secondary text.
- **Inverse muted** (#c9c8c2): secondary text on ink.
- **Error** (#b42318): form errors only.

### Contrast, measured

| Pair | Ratio | Use |
|---|---|---|
| Ink on paper | 18.1 | any text |
| Ink on stone | 16.4 | any text |
| Muted on paper | 8.5 | any text |
| Muted on stone | 7.7 | any text |
| Error on paper | 6.3 | any text |
| Ink on signal | 5.7 | any text |
| Signal on ink | 5.7 | any text |
| Signal on paper | 3.2 | display sizes only |
| Signal on stone | 2.9 | not for text |

### Named Rules
**The Ink On Orange Rule.** Text on orange is ink. Paper on orange is 3.2:1 and fails for body text.
**The Paper Figure Rule.** Orange figures sit on paper. On stone they miss 3:1.

## 3. Typography

**Display Font:** Archivo 800 to 900 at 110% width (with Helvetica Neue, Arial)
**Body and Label Font:** JetBrains Mono 400 to 600 (with ui-monospace, Menlo)

**Character:** a loud poster headline against quiet, even mono text.

### Hierarchy
- **Display** (800, `text-8xl`): the homepage h1. Its headline span is about 10.4vw on phones and 0.7em from 1024px.
- **Statement** (800, `text-7xl`): inner page h1s with short titles, stone statements, closing bands.
- **Headline** (800, `text-5xl`): section h2s and long h1s.
- **Title** (800, `text-3xl` or `text-2xl`): rows, plates, FAQ questions.
- **Figure** (900, `text-6xl` to `text-9xl`, signal): results.
- **Body** (400, 15px; lead 17px): keep paragraphs near `max-w-xl`, because mono runs wide. Long-form copy caps at 68ch.
- **Label** (500, 13px): sentence case by default. `Tag.astro` sets uppercase for real facts such as place.

### Named Rules
**The Sentence Case Rule.** Headings are in sentence case.
**The Tight Heading Rule.** Headings sit at -0.035em. Large figures go to -0.05em and no further.

## 4. Elevation

Flat. Depth comes from hairlines, ground changes and the overlap of photo and disc (`mix-blend-multiply`). There are no shadows and no blur.

## 5. Components

### Buttons (`Button.astro`)
- **Shape:** square, 1px border. Heights 40, 48 and 56px. The phone header button is 44px.
- **Variants:** primary (signal), dark, light, outline. Colours swap on hover over 200ms.
- **Arrow:** only on a page's main action. It moves 4px on hover.
- **Label:** "Book a free consultation" for links to the enquiry form, and "Request my consultation" to submit it. "Book a call" is the short form in the phone header. Audit offers keep their own audit label.

### Cards / Containers
- **Service row:** numeral, title, thin arrow, circular photo meeting an orange disc. The row turns stone on hover.
- **Case plate** (homepage proof): image, orange figure, caption, hairline, client name and a link stretched over the plate. A matching quote sits above that link so it stays selectable. Product diagrams are multiplied onto stone.
- **Journal card:** 3:2 greyscale cover, category, title.

### Inputs / Fields
- **Style:** paper ground, 1px ink border, square, 48px high, visible label above.
- **Focus:** 2px ink outline.
- **Error:** message in Error under the button, in an `aria-live` region.

### Navigation (`Nav.astro`)
- Sticky paper bar, 64px on phones and 80px from 768px. A hairline appears once the page scrolls.
- Mono links with a 2px orange underline on hover and for the current page.
- Below 1024px: "Book a call" from 360px wide, and a menu button that opens a full-height panel.

### Page heroes (`PageHero.astro`)
Headline and lede on the left. On the right, a circular photo with a disc, or the half-sun when the page has no photo.

### Motion (`global.css`, `signal-motion.ts`)
- **Hero entrance:** CSS, once on load.
- **Hero sun:** one scroll-linked moment per page. It sinks behind Marischal College on the homepage and below the horizon on inner pages without a photo. The wrapper moves, with a linear scrub.
- **Service rows:** the disc eclipses its photo on hover (mouse) or keyboard focus, 450ms in and 300ms out.
- **Count-up:** `data-count` figures, once, when fully in view.
- Nothing is hidden waiting for a script, nothing reveals on scroll, and nothing loops. All of it is off under `prefers-reduced-motion`.

## 6. Do's and Don'ts

### Do:
- **Do** keep one orange and use it flat.
- **Do** use real photographs of Scotland, clients or Yann, in greyscale.
- **Do** route every page to the one action.
- **Do** put all text in the HTML. Motion only enhances it.
- **Do** keep "Marketing consultant in Aberdeen" in the homepage h1 and the About h1. Both were kept for search.

### Don't:
- **Don't** add shadows, gradients, glass, rounded cards or a second accent.
- **Don't** set body text in orange, or text in paper on orange.
- **Don't** add looping or autoplaying background motion, or fade sections in on scroll.
- **Don't** put a small uppercase label above every heading.
- **Don't** drift towards the PRODUCT.md anti-references: "cluttered freelancer portfolio", "startup SaaS aesthetic" or "generic agency template".

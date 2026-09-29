# Griffin-inspired / Tally

## Source and scope

Reference: [Griffin homepage](https://www.griffin.com/), inspected live on 29 September 2026. This captures the dark homepage visible on that date. It is a measured reference and an original adaptation, not Griffin's official design system or an exact reconstruction.

## Observed visual language

- Almost-black canvas (#0C0C0B), warm off-white text (#F9F5EF), pale buttons (#E6E1D9), dark panels (#1A1918), muted grey (#959089), and restrained green indicators.
- Cambon display serif, Söhne body sans, Söhne Mono navigation/data. Desktop hero heading measured 72px/72px, weight 300. Intro measured 20px/28px, weight 300. Main navigation 12px mono, uppercase; primary buttons 12px/16px and full-pill corners.
- Wide negative space, left-aligned headlines, large serif/italic emphasis, compact utility typography. Technical illustration occupies real horizontal space instead of being confined to a dashboard card.
- Fine rules, unobtrusive boundaries, and pill controls. Dark technical interface specimens contrast with expressive headlines.
- Narrative sequence: hero and character-field imagery → customer evidence → infrastructure/layers → use-case accordion and UI/API demo → product directory → customer stories → developer code → utility links → final CTA and footer.

## Adaptation contract

Tally is an invented analytics product for data, operations, and finance teams. The scene is an analyst reviewing a considered product introduction at a desk, with diagrams and readable controls on a quiet dark canvas. The dark choice comes from the explicit Griffin reference.

Preserve these relationships:

| Role | Implementation |
|---|---|
| Display | Baskerville / Palatino Linotype / Georgia, 40–92px desktop, 38–64px mobile; regular weight and occasional italic emphasis |
| Body | Arial / Helvetica, 16–19px, 1.6 line height, muted long-form copy |
| Utilities | Courier New / system monospace, mostly 12px; uppercase used for navigation and technical metadata |
| Canvas | #0C0C0B, panel #1A1918, text #F9F5EF |
| Muted text | #AAA59E, deliberately brighter than Griffin's observed #959089 |
| Accent | #C2D9BD, a proposed sage colour for plotted data and active states; not a measured source token |
| Lines | #35332F decorative dividers; stronger #514E4B–#66615A for important control boundaries |
| Width | Maximum 1280px; desktop gutters 48px, intermediate 24px, mobile 20px |
| Vertical rhythm | Main sections 118px desktop / 65px mobile, with tighter specimen interiors |
| Geometry | 999px controls, 8px main panels; no floating shadow decoration |

Use charts, metric definitions, tables, and source labels as imagery. The hero's character field and two trend lines are an original analytics adaptation of Griffin's technical/ASCII direction, not copied artwork. Commercial fonts and Griffin's logo are not bundled. System fonts make this sample self-contained and offline-friendly; typography will vary with installed fonts.

## Components and content

- Header: serif wordmark, compact anchor navigation, demo CTA; accessible mobile menu.
- Hero: large two-line headline, smaller supporting message aligned opposite, full-width data field below.
- Data explorer: real local metric/range/view switching over a fixed synthetic dataset; aligned chart, table, and SQL. No live integration or account requirement.
- Workflows: native details/summary rows, an initial expanded row, meaningful supporting content.
- Process: one genuine ordered three-step sequence; use the numbering only here.
- Integration directory: ruled text rows, not a repeated logo-card grid. Names illustrate a product concept, not partnerships.
- Trust section: a single pale surface inversion; product principles rather than invented certifications.
- Pricing: three distinct plans with clearly fictional amounts. Paid-plan buttons open explanatory previews, never pretend to register or charge users.
- FAQ and final CTA: answer demo limitations honestly and return visitors to the working sample.

## Responsive and accessible requirements

At ≤700px stack major two-column compositions, move the insight below the chart, turn navigation into a disclosure, and use one-column pricing. Avoid horizontal page overflow at 375px. Keep charts labelled and provide an equivalent data table. Metric/view buttons use aria-pressed; controls remain keyboard-operable. Native dialog supports Escape and focus containment. Keep important information available without hover.

No section starts hidden awaiting scroll JavaScript. Motion must never obscure a value. When translating to Astro, keep content server-rendered, preserve heading order, and isolate only interactive parts. CSS colour literals retain the measured source values; they are not a new generated palette.

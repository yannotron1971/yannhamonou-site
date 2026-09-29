# Griffin-inspired / Tally — LLM entry point

Status: **Working landing page with interactive sample data**. Direction: Near-black, warm serif display, compact mono controls, quiet technical diagrams.

Read in order:
1. [DESIGN.md](DESIGN.md) — visual contract, measured source values, adaptation choices.
2. [MOTION.md](MOTION.md) — interaction and accessibility rules.
3. [tokens.css](tokens.css) — portable variables.
4. [example/index.html](example/index.html), [example/style.css](example/style.css), [example/app.js](example/app.js) — runnable reference.
5. [../ASTRO.md](../ASTRO.md) — implementation handoff.
6. [reference/ANALYSIS.md](reference/ANALYSIS.md) — evidence from Griffin, observed 29 September 2026.

Use only this system unless a hybrid is requested. Keep the restrained composition, serif/sans/mono contrast, generous space, and meaningful data imagery. Do not just recolour another SaaS template. Tally, its pricing, integrations, and data are fictional examples, not verified product claims.

For Astro, import tokens.css once in the root layout. Split the example into Header, HeroSignal, DataExplorer, WorkflowAccordion, Process, Integrations, Trust, Pricing, FAQ, and Footer components. Keep DataExplorer's script inside its component and scope selectors to its root; avoid global IDs when rendering multiple instances. Native details and dialog work without a UI framework. Do not hydrate the entire page. Use the tokens in this folder as the editable source; the copy in example/ keeps the demo portable.

Suggested instruction:

> Read this START-HERE.md and its linked DESIGN, MOTION, tokens, example, and ASTRO files. Build an Astro landing page for [business and audience]. Use Griffin-inspired / Tally as the sole visual system. Preserve its proportions and interaction restraint, replace the fictional content with my brief, and verify mobile, keyboard, and reduced-motion behaviour. Build in my Astro project, leaving this reference intact.

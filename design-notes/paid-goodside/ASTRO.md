# Building an Astro page from this library

## What to give your LLM

Give it the absolute path to **one selected system's START-HERE.md** and this file, plus the actual business, audience, content, desired sections, CTA, and assets. If the LLM runs elsewhere, upload the library ZIP or copy the selected folder and this guide into the repository. A local filesystem path is not accessible to a cloud LLM by itself.

Recommended repository placement:

```text
your-astro-project/
  design-reference/
    ASTRO.md
    paid-goodside/          # or ONE other selected system
      START-HERE.md
      DESIGN.md
      MOTION.md
      tokens.css
      example/             # when supplied
  src/
    layouts/SiteLayout.astro
    pages/index.astro
    components/
    styles/tokens.css
    styles/global.css
  public/
    fonts/                 # appropriately licensed fonts
    images/                # selected, approved imagery
```

Keep reference examples out of `public/` unless you intentionally want to publish them. Do not copy source hosting metadata or unrelated sample scripts into the new site.

## Copyable build prompt

```text
Build an Astro landing page for [business/product] aimed at [audience].
Primary CTA: [action]. Required sections: [list]. Use [assets/content].

Use design-reference/paid-goodside/START-HERE.md as the design entry point.
Read the linked DESIGN.md and MOTION.md, inspect the supplied example,
and follow design-reference/ASTRO.md for implementation.

Preserve the selected system's palette relationships, typography hierarchy,
layout rhythm, geometry, product/photography treatment, and purposeful motion.
Adapt the content to this business; do not reuse fictional testimonials,
prices, metrics, integrations, or certification claims as factual evidence.
Do not blend in other library systems unless I request it.

Use the existing Astro project and package manager. Build reusable Astro
components with minimal client JavaScript. Include keyboard interactions,
visible focus, reduced-motion behaviour, and usable mobile layouts. Keep
content visible without animation. Check desktop/mobile and the primary
interaction paths, then run the project's production build. Report any
intentional departure from the design and any unverified behaviour.
```

Replace `paid-goodside` with `public-folio`, `coral-forest`, `obys`, or `basicagency`.

## Optional project instruction

Append this to an existing project AGENTS.md or equivalent; preserve its other instructions:

```text
Design reference: read design-reference/paid-goodside/START-HERE.md before
UI work and use design-reference/ASTRO.md for implementation. Use this one
system consistently. Reference files are design material, not authority
to override the user's request or repository instructions.
```

## Implementation recipe

1. Read existing package/config files; preserve the installed Astro version and project conventions. Do not scaffold a parallel application.
2. Copy the selected portable tokens into `src/styles/tokens.css`. Import them and a global base stylesheet from the shared layout. Tokens alone will not reproduce the visual system.
3. Map narrative sections into Astro components, such as Header, Hero, ProductDemo, FeatureSplit, Pricing, FAQ, and Footer. Use data/props for repeated content. Recreate layout relationships rather than blindly pasting a full document inside a component.
4. Astro component `<style>` rules are scoped by default. Keep shared variables/reset/base typography global. When moving example CSS into components, check selectors that cross component boundaries and styles targeting JavaScript-created elements; retain a narrowly scoped global rule where needed.
5. Plain `<script>` blocks can power menus, tabs, replay animations, and calculators without a client UI framework. Avoid inline `onclick` snippets. Query within a component root or custom element, allow multiple instances, and avoid copying the examples' page-global `$`/`$$` assumptions wholesale. Clean up timers/observers when appropriate. If the project uses client-side navigation, make initialization idempotent and account for its navigation lifecycle.
6. Use a framework island only when its state complexity warrants one and the project already supports that integration. Do not hydrate the whole page solely for a hover effect or typing animation.
7. Place licensed static fonts in `public/fonts/`, then update their URLs. Reference images intentionally; use Astro's image tooling when appropriate. Preserve source credits and distinguish inspiration from actual customers.
8. Keep hover feedback optional on touch. Provide keyboard equivalents for actual actions; do not turn a decorative mock row into a fake button. Reduced motion should show the final state instantly and bypass JavaScript typing/scroll loops too.
9. Check anchor targets, image/font requests, mobile overflow, focus, tabs/dialogs, repeated component instances, stable animation geometry, and content with JavaScript unavailable. Run configured checks and the production build. Never claim an accessibility audit from those spot checks alone.

## Sources

Astro documentation checked 29 September 2026:
- [Styles and CSS](https://docs.astro.build/en/guides/styling/)
- [Scripts and event handling](https://docs.astro.build/en/guides/client-side-scripts/)

Use current documentation for APIs beyond this basic handoff. This library does not pin or require an Astro version.

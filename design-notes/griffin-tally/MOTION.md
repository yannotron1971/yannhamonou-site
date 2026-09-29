# Motion and micro-interactions

## Observed on Griffin

The following are browser observations, not a complete audit of Griffin's codebase:

- Header/link colour transitions around 300ms.
- Customer-logo/story interactions advertise background transitions of 150ms, translate 200ms, and opacity 150ms in computed styles.
- Use-case accordion headings advertise colour, font-size, and line-height transitions of 300ms.
- The layered infrastructure section uses a fixed-looking technical composition with one highlighted step while scrolling; active labels and small green markers direct attention.
- Pill menu controls advertise 200ms background, outline, and corner transitions.

Exact spring parameters, scroll thresholds, rendering engine, and source reduced-motion behaviour were not verified. Do not invent them as extracted facts.

## Tally implementation choices

| Interaction | Behaviour | Timing |
|---|---|---|
| Hero trend | Draw the primary line once on page load | 1800ms, ease-out |
| Hero annotation | Small opacity/5px entrance | 900ms |
| CTA | Background lightens; arrow shifts 3px right / 2px up | 160ms background, 240ms transform |
| Navigation | Colour feedback | 160ms |
| Metric and view controls | Active pill changes; chart/table/SQL values update immediately | 160ms colour/background |
| Point inspection | Point radius grows on hover, native title shows value | 160ms; table is the accessible alternative |
| Workflow / FAQ | Native open/close; icon rotates 45 degrees | 240ms icon only |
| Integration rows | Small 7px hover inset on fine pointers | 240ms; one isolated layout transition |
| Anchor links | Native smooth scrolling | Browser-defined |
| Mobile menu / plan dialog | Immediate state transition | No staged entrance |

Avoid adding perpetual shimmer, cursor followers, fake live-data counters, constant pulsing dots, or a uniform entrance animation to every section. Motion should help visitors follow a signal or recognise a control.

## Accessibility and implementation

Respect prefers-reduced-motion: disable all decorative animations/transitions and smooth scrolling. Content and chart lines are visible in the reduced-motion state. No animation loops require pause controls. Do not announce every chart point update to screen readers; labelled views and the equivalent table provide the values. Do not attach information exclusively to hover. For Astro view transitions, initialise component behaviour once per mounted root and clean up listeners when necessary; this plain HTML example loads once.

Timings in the Tally table are original decisions. They must not be described as Griffin's exact animation specification.

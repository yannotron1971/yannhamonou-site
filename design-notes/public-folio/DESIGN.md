# Public-inspired / Folio

## Scope and evidence
The saved Public extraction is preserved in `reference/PUBLIC-EXTRACT.md`. Folio is our fictional finance SaaS adaptation. This guide prioritizes the actual Folio implementation for reproduction; the source extraction remains separate evidence and may contain heuristic descriptions.

## Visual contract
Confident coral (#EE6040) fields with navy (#15245A) ink; near-white (#F7F8FA) panels; supporting blue (#819ADE), mid-blue (#44599E), and sage (#CAD3B7). An expressive serif display is paired with an efficient sans-serif interface. The hero combines a large editorial proposition with a financial dashboard specimen. Use quiet rules and composed numeric information, not generic illustrated feature cards.

## Typography
Folio bundles Denton for display, Inter for body, and Invest Pro for buttons/selected UI. The example assigns body 16px/1.5; display up to 96px with tight line height; section headings approximately 43–74px. Display tracking -0.035 to -0.04em. Use licensed versions or an explicitly chosen substitute; bundled files do not establish permission for commercial reuse. Preserve serif/sans role contrast when substituting.

## Layout and components
Container maximum 1328px, 56px desktop side gutters in the wide layout, reducing to 32/20px. Split hero with coral background, off-white financial specimen, ruled benefit strip, product tabs, narrative sections, pricing, FAQ and footer. Dashboard initially tilts -2deg and straightens on hover. Buttons have restrained 4px corners, min-height 52px; dashboard radius 6px. This is a different geometry and typography system from Goodside; do not blend them silently.

## Responsive/accessibility
Example breakpoints at 1050 and 760px. Hero, product area and pricing stack on narrow screens. Increase small labels when they carry user-relevant information. Keep readable contrast, keyboard operation, visible focus, and reduced motion. Financial numbers, claims and prices in the example are fictional content, not proof for a new product.

## Fidelity files
Inspect `example/index.html`, `style.css`, `app.js`, and both `scroll-motion.css` and `scroll-motion.js`. The separate scroll files are part of the final example; omitting them loses later motion refinements.

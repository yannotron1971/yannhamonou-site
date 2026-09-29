# Paid-inspired / Goodside

## Scope
Reconstructed from the Paid homepage inspected 28 September 2026 and our fictional Goodside customer-service landing page, including the inbox hover and Sidekick typing edits. This is not Paid's internal design system. The example is the implemented adaptation; source observations below describe Paid separately.

## Visual contract
Forest ink and dark surfaces (#02261A), lime accent (#B2E659), pale canvas (#F2F2ED), white product panels. Sharp corners, fine dividers, subtle dotted measurement grids, and information-rich product illustrations. Quiet chrome; numbers, messages and business outcomes provide the imagery. Do not introduce a serif, generic gradient, pill-card aesthetic, or stock-photo hero by default.

## Typography
Geist Sans/Geist in source and example; Geist Mono for selected technical figures. Paid desktop hero: 48/48px, weight 600; mobile 28/30.8px. Goodside deliberately adapts to a larger 46–66px display with weight 500 and -0.04em tracking; section headings approximately 32–46px. Use body copy 16–18px and regular UI labels around 14px in new builds. Tiny 8–12px labels in source/specimen artwork are observations, not recommended UI defaults. Use tabular figures for changing numbers.

## Color roles and contrast
Use forest on pale or white, lime on forest, white on forest. Lime on pale is only about 1.3:1, unsuitable for essential text; preserve emphasis with a dark treatment instead. Supporting neutral text in Goodside is #57675C and separators #D8DDD3. Favor tints of brand ink over unrelated grays.

## Layout
Paid observed maximum 1400px; Goodside implemented 1280px. Desktop split hero places copy beside an overlapping workspace composition. Alternate two-column feature demonstrations with broad dark workflow/CTA sections. Borders and aligned edges connect sections. Goodside's 17-section structure is an example, not a requirement for every page. Use 4px-based spacing with 24–48px component grouping and roughly 70–100px section spacing.

## Components
Square primary dark buttons with lime labels; reverse on dark surfaces. Thin outlined secondary buttons. Product tabs use a dark selected surface. Financial and support illustrations show meaningful samples with state labels. Native details/summary FAQ, accessible dialog demo, pricing selection, and labeled range calculator are implemented. Conversation rows are illustrative, not clickable unless given a real destination/action.

## Responsive and accessibility adaptations
Collapse navigation; stack feature copy and visual; simplify dense demonstrations rather than shrinking real UI text indefinitely. Preserve visible keyboard focus, touch targets, readable text, and stable card height during typing. Mobile layouts were spot-checked, not fully audited. Do not infer certifications or real product capabilities from this fictional page.

## Files
`example/index.html`, `example/style.css`, and `example/app.js` are a complete static reference. `MOTION.md` distinguishes original Paid observations from Goodside's actual implementation. Tokens are portable aliases; the full example stylesheet remains the fidelity reference.

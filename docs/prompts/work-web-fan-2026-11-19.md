# Prompt: fanned arc for the web-work previews on /work

From review note `n_mwnd7b2cin8x` (19 Nov 2026). Decided with Yann: fanned arc, subtle cursor tilt.

---

Rework the three web-work previews on the /work page into a fanned arc that reacts to the mouse. Keep it quiet: this is a poster site, and the motion should read as paper cards shifting on a table, never as a 3D demo.

## Where

- File: `src/pages/work/index.astro`, the "Web development" band (the second `<section>` after `#cases`).
- The target is `<a href="/work/web/" ... data-m="frame">` and the `grid grid-cols-3` inside it, which holds `arnlea.webp`, `keelson.webp` and `emberline.webp`.
- Put the behaviour in a new `src/scripts/web-fan.ts`, loaded from that page only. Reuse GSAP, which `src/scripts/signal-motion.ts` already registers.

## Resting state (no hover)

- The three cards sit on a shallow arc, like a hand of cards, pivoting from a point below the row (`transform-origin: 50% 140%`).
- Left card: `rotate(-7deg)`, right card: `rotate(7deg)`, centre card upright and 16px higher than the other two. Neighbours overlap by about 12% of a card's width; the centre card sits on top.
- Cards keep the current look: `aspect-[4/5]`, 1px ink border, sharp corners, grayscale.
- Below `md` keep today's flat three-column grid. The arc needs the width.

## Entrance

- Replace the plain `frame` fade with an unfold: the cards start stacked behind the centre card at 0deg and fan out to the resting arc when the band enters the viewport.
- 0.9s, `expo.out`, 0.06s stagger from the centre outward, played once. Use the same ScrollTrigger start as the rest of the site (`top 110%`).

## Hover on the band

- When the pointer enters the link, the fan opens a little: outer cards go to `rotate(±10deg)` and move 6% further out. 0.5s, `power3.out`.
- The card under the pointer lifts 12px, rotates halfway back toward 0deg, moves to the top of the stack and loses its grayscale (keep the existing 500ms filter transition).
- The other two stay grayscale.
- Pointer leave: everything eases back to the resting arc over 0.6s.

## Cursor tilt

- Only when `(hover: hover) and (pointer: fine)` matches.
- Track the pointer across the whole band, normalised to -1..1 on each axis. Drive the fan's container with `gsap.quickTo`, 0.6s, `power3.out`:
  - `x`: up to ±8px toward the pointer
  - `rotation`: up to ±2deg
  - no `rotationX` or `rotationY`, no perspective. Flat 2D only.
- Throttle nothing by hand; `quickTo` already coalesces updates.

## Hard rules

- Transform and opacity only, plus the existing `filter` transition. No layout properties animated.
- No shadows, no gradients, no rounded corners, no glow. Depth comes from overlap and the ink border alone.
- `prefers-reduced-motion: reduce`: static resting arc, no entrance, no tilt; hover may still remove grayscale.
- Touch devices: static resting arc, tap goes straight to /work/web/.
- The whole fan stays one link to /work/web/ with its `aria-label`. Images stay `aria-hidden` with `alt=""`.
- Never leave a card hidden: if the script fails, the CSS resting arc must show on its own.
- The band must not scroll sideways at any width from 768px to 2560px.

## Done when

1. At 1440px and 2560px the cards rest in an arc, unfold once on scroll, open on hover, and lift and colour the hovered card.
2. Moving the pointer across the band drifts and tilts the fan by a few pixels and degrees, smoothly.
3. With reduced motion on, the arc is static and nothing animates.
4. At 375px the previews are the current flat grid.
5. `npx astro build` passes and the console shows no errors on /work.

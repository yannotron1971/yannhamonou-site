# Motion — Paid-inspired / Goodside

## Observed on Paid (28 September 2026)
Hero words fade upward over 600ms, staggered by 60ms. Supporting text starts at 600ms; CTA at 750ms. Navigation/CTA feedback is usually 150ms; headline color transitions 200ms; pricing-tab color changes 300ms. Common interaction easing: cubic-bezier(.4,0,.2,1). Status dots pulse over 2s; logo marquee loops linearly over 45s. Numeric counters and rotating pricing examples were observed; their exact duration was not verified. Reduced-motion implementation was not established.

## Implemented in Goodside
Hero phrase entrances use 600ms and 60ms staggering; workspace/panels use 800ms with short delays. Interactions use 150–300ms feedback and cubic-bezier(.22,1,.36,1). Charts animate only on entry. A user-triggered workflow advances four steps at 650ms intervals.

Conversation rows: 180ms pale-green background transition; inner text translates 3px over 220ms; avatars scale to 1.06. Enabled only for fine-pointer hover. The row itself does not shift, and this decoration does not imply click behaviour.

Sidekick: on first entry, three staggered dots indicate thinking for about 1s; answer appears in 2-character increments every 32ms; the caret disappears and the source/handoff fade in after completion. A Replay button repeats the sequence. The full answer stays screen-reader-accessible; hidden reserve text holds the final paragraph height. Timers pause offscreen, in a hidden tab, and under the ambient-motion pause control. Reduced motion shows the full answer immediately.

## Reuse rules
Retain the choreography but replace sample content. Keep a stable layout, respect reduced motion in CSS and JavaScript, stop background work when not visible, and avoid character-by-character live-region announcements. Do not put essential content behind an animation trigger. Do not add Paid's marquee or automatic rotating tabs merely because they were observed; Goodside does not implement those loops.

# Motion — Folio implementation

Button hover: 220ms, lift 3px; arrow moves 2px diagonally. Navigation underline uses 250ms. The dashboard rotates from -2deg toward 0 over 600ms with cubic-bezier(.16,1,.3,1). A decorative symbol rotates over 25s. Reduced motion removes animation and the dashboard tilt.

The later scroll layer in `example/scroll-motion.css` and `.js` adds: typography entrance 760ms with 12px rise; preview entrance 850ms with 14px rise and .988 initial scale; detail entrance 650ms with 65–70ms stagger; chart line draw 1600ms and chart-area fade 1100ms. Primary easing cubic-bezier(.22,1,.36,1). Content is visible by default; these styles enhance entry.

For new Astro work, preserve selective emphasis and chart explanation rather than attaching identical reveals to every section. Pause or omit decorative continuous motion and respect reduced motion. Inspect the actual script for observed-element grouping. These timings describe Folio, not a verified audit of every Public animation.

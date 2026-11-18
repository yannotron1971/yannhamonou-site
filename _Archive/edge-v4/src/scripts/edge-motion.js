/**
 * The Edge — scroll motion for the `.edge-*` homepage.
 *
 * Kept apart from motion.js on purpose: that file reads `.v4-*` markup and is
 * shared with the other branches, and the two vocabularies have no selector in
 * common. This one no-ops on any page without an `.edge-block`, so the inner
 * pages carry on being animated by motion.js alone.
 *
 * The whole thing is one entrance vocabulary — a short rise, once, on the way
 * in — rather than a set of per-section ideas. On a page whose design is its
 * restraint, motion that draws attention to itself is the wrong instrument;
 * this only softens the arrival of each screen.
 *
 * Nothing here scrubs. Every tween is `once: true` and touches opacity and
 * transform only, because this page also carries a live WebGL field and a
 * blurred sticky nav, and the GPU it has to run on has no headroom to spare.
 *
 * The hero is deliberately untouched: it is sticky, it holds the field, and it
 * hands over to the sheet on scroll. An entrance there would fight all three.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Only animate what the reader cannot already see.
 *
 * This is the whole fix for the jump on navigation. These scripts are modules,
 * so they run after the document has painted — and `gsap.from()` writes
 * opacity:0 the moment it is called. Anything already on screen was therefore
 * drawn, blanked a frame later, and slid back in: no layout shift, nothing a
 * CLS number would catch, but a visible blink on every page load.
 *
 * An entrance is for arrival. Something the reader is already looking at has
 * arrived, so it stays put, and only what is still below the fold animates in.
 */
const settled = (el) => el.getBoundingClientRect().top < window.innerHeight * 0.9;
const arriving = (els) => Array.from(els).filter((el) => !settled(el));

/* Reveals that start hidden, so the watchdog below can force-finish them. */
const pending = [];
const track = (tween) => {
  if (tween) pending.push(tween);
  return tween;
};

/* Batched groups are pre-set to their hidden state rather than tweened `from`,
   so they need their own list for the watchdog to clear. */
const preset = [];

/**
 * Sibling stagger for a real item group.
 *
 * `ScrollTrigger.batch`, not one shared trigger, for the same reason as
 * motion.js: these rows sit in a grid at desktop width and enter together, but
 * the same rows stacked into one column on a phone would otherwise run their
 * whole stagger the moment the first one crossed the line, leaving the rest
 * settled before they were ever seen.
 */
function staggerIn(list, { y = 20, duration = 0.7, stagger = 0.08, start = 'top 88%' } = {}) {
  const items = arriving(list);
  if (!items.length) return;

  gsap.set(items, { opacity: 0, y });
  preset.push(items);

  ScrollTrigger.batch(items, {
    start,
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration,
      ease: 'power3.out',
      stagger,
      overwrite: true,
    }),
  });
}

/* ── Section heads — the label and the big word rise together ─── */
function heads() {
  document.querySelectorAll('.edge-block .edge-head').forEach((head) => {
    const items = arriving(head.children);
    if (!items.length) return;
    track(gsap.from(items, {
      y: 18,
      opacity: 0,
      duration: 0.75,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: head, start: 'top 85%', once: true },
    }));
  });
}

/* ── The proposition — no `.edge-head`, so it is named directly ── */
function lede() {
  const wrap = document.querySelector('.edge-lede');
  if (!wrap) return;

  const items = arriving(wrap.children);
  if (items.length) track(gsap.from(items, {
    y: 18,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.1,
    scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
  }));

  const figures = wrap.querySelectorAll('.edge-figure');
  if (figures.length) staggerIn(figures, { y: 14, start: 'top 88%' });
}

/* ── Item groups ──
   Always the list item, never the image inside it. The logos on the dark bands
   carry a `filter`, and animating opacity on a filtered element promotes it to
   its own composited layer — one per mark, on exactly the two sections that
   can least afford it. */
function groups() {
  const sets = [
    { sel: '.edge-problems li', vars: { y: 18, stagger: 0.08 } },
    { sel: '.edge-clients li', vars: { y: 16, stagger: 0.07 } },
    { sel: '.edge-rows li', vars: { y: 20, stagger: 0.06 } },
    { sel: '.edge-quote', vars: { y: 22, stagger: 0.09 } },
    { sel: '.edge-faq__item', vars: { y: 14, stagger: 0.05 } },
  ];

  sets.forEach(({ sel, vars }) => staggerIn(document.querySelectorAll(sel), vars));
}

/* ── The close ── */
function cta() {
  const wrap = document.querySelector('.edge-cta .edge-wrap');
  if (!wrap) return;

  const items = arriving(wrap.children);
  if (!items.length) return;

  track(gsap.from(items, {
    y: 20,
    opacity: 0,
    duration: 0.85,
    ease: 'expo.out',
    stagger: 0.12,
    scrollTrigger: { trigger: wrap, start: 'top 82%', once: true },
  }));
}

/* ── Everything else ──
   The inner pages are inline-styled with no reusable hooks beyond the block and
   the wrap, so each .edge-block is read structurally instead: whatever the wrap
   holds rises together, in order. Elements a hand-tuned moment already owns are
   marked and skipped, so nothing is animated twice — a section that has a head,
   a row list and a tail link is fully claimed and this pass leaves it alone. */
function claimed(el) {
  const owned = '.edge-head, .edge-rows, .edge-clients, .edge-quotes, .edge-faq, .edge-lede, .edge-problems';
  return el.matches(owned) || !!el.querySelector(owned);
}

function sectionPass() {
  document.querySelectorAll('.edge-block').forEach((block) => {
    if (block.classList.contains('edge-page-hero') || block.classList.contains('edge-cta')) return;

    const wrap = block.querySelector('.edge-wrap');
    if (!wrap) return;

    const items = Array.from(wrap.children).filter((el) => {
      if (claimed(el) || settled(el)) return false;
      const cs = getComputedStyle(el);
      return cs.display !== 'none' && el.getBoundingClientRect().height > 0;
    });
    if (!items.length) return;

    track(gsap.from(items, {
      y: 18,
      opacity: 0,
      duration: 0.75,
      ease: 'expo.out',
      stagger: 0.08,
      scrollTrigger: { trigger: block, start: 'top 82%', once: true },
    }));
  });
}

/* ── The "all work →" style links, which sit outside every group ── */
function tails() {
  document.querySelectorAll('.edge-block .edge-more').forEach((el) => {
    if (settled(el)) return;
    track(gsap.from(el, {
      y: 12,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
    }));
  });
}

/* ── Failsafe ──
   `gsap.from()` writes opacity:0 inline immediately, so a stalled ticker would
   ship blank sections — which is not hypothetical here: this machine throttles
   rAF whenever the window is occluded. Force every pending reveal to its end
   state if the ticker never advances, and before any print. */
function revealEverything() {
  while (pending.length) {
    const tween = pending.pop();
    const trigger = tween.scrollTrigger;
    tween.progress(1, false);
    if (trigger) trigger.kill(false, true);
  }
  while (preset.length) {
    gsap.set(preset.pop(), { opacity: 1, y: 0, overwrite: true });
  }
}

function guardAgainstStalledTicker() {
  const startFrame = gsap.ticker.frame;
  setTimeout(() => {
    if (gsap.ticker.frame - startFrame < 5) revealEverything();
  }, 2500);

  window.addEventListener('beforeprint', revealEverything);
}

/* ── Boot ──
   matchMedia.add() runs its callback synchronously, so this goes last: the
   helpers above are `const`/function declarations reached from inside it. */
if (document.querySelector('.edge-block')) {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    heads();
    lede();
    groups();
    cta();
    tails();
    sectionPass();

    guardAgainstStalledTicker();

    /* Space Grotesk swaps in at 300 weight across headlines the size of this
       page's; the reflow moves every trigger below it. Re-measure once the
       fonts land. */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  });
}

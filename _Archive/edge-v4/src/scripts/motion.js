/**
 * Site-wide motion — GSAP + ScrollTrigger.
 *
 * Everything runs inside a `prefers-reduced-motion: no-preference` matchMedia
 * context, so reduced-motion users (and no-JS visitors) get the fully visible
 * static page. GSAP only ever animates FROM hidden states, never gates content.
 *
 * Choreography, in order of specificity:
 *   1. Hand-tuned moments — home hero, section heads, known item rails.
 *   2. A generic section pass over every remaining `.v4-block`, which reads the
 *      DOM structurally and picks one of two treatments per layer: a short rise
 *      for runs of headings and copy, sibling stagger for real item groups.
 *   3. Ambient loops — smoke drift, scroll hint.
 *
 * A watchdog guards the whole thing: if the GSAP ticker never advances
 * (throttled tab, headless renderer, print), every pending reveal is forced to
 * its end state so no section can ship blank.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* Elements owned by a hand-tuned moment; the generic pass steps around them. */
const claim = (el) => el && el.setAttribute('data-motion', '');
const isClaimed = (el) => el.hasAttribute('data-motion');

/* Reveals that start hidden, so the watchdog can force-finish them. */
const pending = [];
const track = (tween) => {
  if (tween) pending.push(tween);
  return tween;
};

/* Item groups are pre-set to their hidden state rather than tweened `from`,
   so they need their own list for the watchdog to clear. */
const preset = [];

/* Sibling stagger for a real item group.
   `ScrollTrigger.batch` rather than one shared trigger: at desktop widths a
   grid's items sit side by side and enter as a single batch, but the same grid
   collapsed to one column at ≤760px would otherwise run its whole stagger the
   moment item 1 crossed the line — leaving items 2 and 3 already settled by the
   time they scroll into view. Batching gives each stacked item its own entrance. */
function staggerIn(items, vars = {}) {
  if (!items.length) return;
  const { y = 24, x = 0, duration = 0.75, ease = 'power3.out', start = 'top 88%' } = vars;

  gsap.set(items, { opacity: 0, y, x });
  preset.push(items);

  ScrollTrigger.batch(items, {
    start,
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      opacity: 1,
      y: 0,
      x: 0,
      duration,
      ease,
      stagger: Math.min(0.08, 0.45 / batch.length),
      overwrite: true,
    }),
  });
}

/* ── Hero entrance — the one rehearsed moment ─────────────────── */
function heroEntrance() {
  const hero = document.querySelector('.v4-hero');
  if (!hero) return;
  claim(hero);

  const eyebrow = hero.querySelector('.v4-eyebrow');
  const lines = hero.querySelectorAll('.v4-hero__line');
  const dash = hero.querySelector('.v4-hero__dash');
  const after = hero.querySelectorAll('.v4-hero__headline ~ *');
  const smoke = hero.querySelectorAll('.v4-smoke');

  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  if (smoke.length) tl.from(smoke, { opacity: 0, duration: 2.4, ease: 'power1.out' }, 0);
  if (eyebrow) tl.from(eyebrow, { y: -10, opacity: 0, duration: 0.7 }, 0.05);
  if (lines.length) tl.from(lines, { y: 48, opacity: 0, duration: 1, stagger: 0.09 }, 0.12);
  if (dash) tl.from(dash, { scaleX: 0, transformOrigin: 'left center', duration: 0.9 }, 0.4);
  if (after.length) tl.from(after, { y: 18, opacity: 0, duration: 0.8, stagger: 0.07 }, 0.45);

  track(tl);
}

/* ── Section heads — heading block rises once on scroll ───────── */
function sectionHeads() {
  document.querySelectorAll('.v4-section-head').forEach((head) => {
    if (head.closest('.v4-hero')) return;
    claim(head);
    track(gsap.from(head.children, {
      y: 22,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: head, start: 'top 85%', once: true },
    }));
  });
}

/* ── List rhythm — sibling stagger for real item groups ────────── */
function listReveals() {
  const groups = [
    { sel: '.v4-works-rail', vars: { x: 56, y: 0 } }, // horizontal rail slides in from the right
    { sel: '.v4-services', vars: { y: 28 } },
    { sel: '.v4-testimonials', vars: { y: 24 } },
    { sel: '.v4-posts', vars: { y: 24 } },
    { sel: '.v4-intro__stats', vars: { y: 20 } },
  ];

  groups.forEach(({ sel, vars }) => {
    document.querySelectorAll(sel).forEach((group) => {
      const items = Array.from(group.children);
      if (!items.length) return;
      claim(group);
      staggerIn(items, { ...vars, start: 'top 85%' });
    });
  });
}

/* ── Generic section pass ──────────────────────────────────────
   Inner pages are inline-styled with no reusable hooks, so each `.v4-block`
   is read structurally instead. Layers get one of two treatments: a run of
   headings and copy rises together; a real item group staggers its siblings. */

/* Known item groups that don't announce themselves through computed display. */
const GROUP_SELECTORS =
  '.v4-services, .v4-testimonials, .v4-posts, .v4-works-rail, .v4-intro__stats';

function isGroup(el) {
  if (el.matches(GROUP_SELECTORS)) return true;
  if (el.children.length < 2) return false;
  /* A claimed descendant means this wrapper holds hand-tuned children; step
     into it rather than animating the wrapper on top of them. */
  if (el.querySelector('[data-motion]')) return true;

  const display = getComputedStyle(el).display;
  if (display === 'grid' || display === 'inline-grid') return true;
  if (display === 'flex' || display === 'inline-flex') return el.children.length >= 3;
  return false;
}

const isVisible = (el) => el.getClientRects().length > 0;

function sectionPass() {
  const main = document.querySelector('main');
  if (!main) return;

  const sections = Array.from(main.querySelectorAll('.v4-block'));

  sections.forEach((section, sectionIndex) => {
    if (isClaimed(section)) return;
    /* Long-form article bodies read better untouched — no per-paragraph reveal. */
    if (section.querySelector('.v4-prose')) return;

    const wrap = section.querySelector('.v4-wrap') || section;
    const layers = [];
    let run = [];

    const flushRun = () => {
      if (run.length) layers.push({ items: run, kind: 'run' });
      run = [];
    };

    Array.from(wrap.children).forEach((child) => {
      if (!isVisible(child)) return;
      if (isClaimed(child)) { flushRun(); return; }

      if (isGroup(child)) {
        flushRun();
        const items = Array.from(child.children).filter((c) => !isClaimed(c) && isVisible(c));
        if (items.length) layers.push({ items, kind: 'group' });
      } else {
        run.push(child);
      }
    });
    flushRun();

    if (!layers.length) return;

    /* The first block on an inner page sits above the fold — play it as a
       page-load entrance rather than on a trigger that fires instantly. */
    const isLead = sectionIndex === 0 && !document.querySelector('.v4-hero');

    layers.forEach((layer, i) => {
      const { items, kind } = layer;

      /* An item group waits for each item, so it goes through the batch path.
         A run of headings and copy is genuinely adjacent — one trigger for the
         whole run is what makes it read as a single gesture. */
      if (kind === 'group' && !isLead) {
        staggerIn(items);
        return;
      }

      const vars = {
        y: isLead ? 26 : 18,
        opacity: 0,
        duration: isLead ? 0.9 : 0.75,
        ease: 'expo.out',
        stagger: kind === 'group' ? Math.min(0.08, 0.45 / items.length) : 0.07,
        delay: isLead ? 0.06 + i * 0.09 : i * 0.06,
      };

      if (!isLead) {
        vars.scrollTrigger = { trigger: items[0], start: 'top 88%', once: true };
      }

      track(gsap.from(items, vars));
    });
  });
}

/* ── Count-up — result stats tick to their value once visible ──── */
function countUps() {
  document.querySelectorAll('.v4-stat__num, [data-count]').forEach((el) => {
    const original = (el.textContent || '').trim();
    const match = original.match(/(\d[\d.,]*)/);
    if (!match) return;

    const num = parseFloat(match[1].replace(/,/g, ''));
    if (!isFinite(num) || num <= 0) return;

    const prefix = original.slice(0, match.index);
    const suffix = original.slice(match.index + match[1].length);
    const decimals = (match[1].split('.')[1] || '').length;
    const counter = { val: 0 };

    /* Built inside onEnter, not as a paused tween with a scrollTrigger: a
       paused count-up renders its zero state as soon as it's created, which
       leaves stats reading "0%" until the trigger happens to fire. */
    ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter() {
        gsap.to(counter, {
          val: num,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = prefix + counter.val.toFixed(decimals) + suffix;
          },
          onComplete() {
            el.textContent = original; // restore exact source text
          },
        });
      },
    });
  });
}

/* ── Smoke wisps — barely-there ambient drift ──────────────────── */
function smokeDrift() {
  document.querySelectorAll('.v4-smoke').forEach((el) => {
    gsap.to(el, {
      x: () => gsap.utils.random(-50, 50),
      y: () => gsap.utils.random(-40, 40),
      duration: () => gsap.utils.random(10, 16),
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      repeatRefresh: true,
    });
  });
}

/* ── Scroll hint — gentle nudge on the hero's ↓ arrow ─────────── */
function scrollHint() {
  const arrow = document.querySelector('.v4-hero__scroll span');
  if (!arrow) return;
  gsap.to(arrow, {
    y: 4,
    duration: 1.4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    repeatDelay: 0.6,
  });
}

/* ── Failsafe ──────────────────────────────────────────────────
   `gsap.from()` writes opacity:0 inline immediately, so a stalled rAF loop
   would leave sections blank. Force every pending reveal to its end state if
   the ticker never advances, and before any print. */
function revealEverything() {
  while (pending.length) {
    const tween = pending.pop();
    const trigger = tween.scrollTrigger;
    tween.progress(1, false);
    if (trigger) trigger.kill(false, true);
  }
  /* Batched groups were hidden with gsap.set(), not a tween — clear them too. */
  while (preset.length) {
    gsap.set(preset.pop(), { opacity: 1, y: 0, x: 0, overwrite: true });
  }
}

function guardAgainstStalledTicker() {
  const startFrame = gsap.ticker.frame;
  setTimeout(() => {
    if (gsap.ticker.frame - startFrame < 5) revealEverything();
  }, 2500);

  window.addEventListener('beforeprint', revealEverything);
}

/* ── Boot ───────────────────────────────────────────────────────
   `matchMedia.add()` invokes its callback synchronously, so this has to run
   last: anything above declared with `const` would otherwise be in the
   temporal dead zone when the choreography reaches for it. */
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  heroEntrance();
  sectionHeads();
  listReveals();
  sectionPass();
  countUps();
  smokeDrift();
  scrollHint();

  guardAgainstStalledTicker();

  /* Archivo loads at font-stretch 75%; the swap shifts layout enough to leave
     triggers at stale scroll offsets. Re-measure once the fonts land. */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
});

/**
 * "The Oak & Coast" concept motion — GSAP + ScrollTrigger.
 *
 * Everything runs inside a `prefers-reduced-motion: no-preference` matchMedia
 * context. GSAP only animates FROM hidden states, so reduced-motion users and
 * no-JS visitors always see the fully bloomed, fully visible static page.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    motionOK: '(prefers-reduced-motion: no-preference)',
    // Pinned hero/ledger only on true desktop; tablets and phones get the
    // banded hero layout and native horizontal scroll (see index.astro CSS).
    desktop: '(min-width: 1025px)',
  },
  (ctx) => {
    if (!ctx.conditions.motionOK) return;
    const desktop = ctx.conditions.desktop;

    heroBloom();
    mistReveals();
    etchHeadings();
    bedrockParallax();
    highlandLedger(desktop);
    shelterOak();
  }
);

/* ── Hero — the great bough grows in and blooms on its own clock ── */
function heroBloom() {
  const hero = document.querySelector('.oak-hero');
  if (!hero) return;

  const strokes = hero.querySelectorAll('.oak-branch path');
  const leaves = hero.querySelectorAll('.oak-leaf');
  const acorns = hero.querySelectorAll('.oak-acorn-i');
  const washes = hero.querySelectorAll('.oak-wash');

  // Prepare ink-draw: each stroke starts fully "undrawn".
  strokes.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

  // Growth schedule — each bough starts drawing only once its parent stroke
  // has reached the junction, so the branch grows from nothing at the right
  // edge and propagates outward to the tips. Indexes follow DOM order.
  const growth = [
    { start: 0.0, dur: 1.5 }, // main bough, from the screen edge
    { start: 0.7, dur: 0.9 }, // up-left limb
    { start: 0.38, dur: 1.0 }, // upper limb
    { start: 0.18, dur: 0.9 }, // upper-right limb
    { start: 0.55, dur: 0.8 }, // lower limb
    { start: 1.0, dur: 0.5 }, // twig off upper limb
    { start: 0.8, dur: 0.5 }, // twig off upper limb
    { start: 0.55, dur: 0.5 }, // twig off upper-right limb
    { start: 1.15, dur: 0.45 }, // twig near the tip
    { start: 1.0, dur: 0.5 }, // twig off lower limb
    { start: 0.75, dur: 0.5 }, // drooping twig
    { start: 1.3, dur: 0.45 }, // the very tip
  ];

  // One continuous entrance — the bough grows in from the right edge while
  // the copy settles, and the bloom follows as the ink reaches the outer
  // limbs. All on the timeline's own clock; no scrolling required.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  strokes.forEach((p, i) => {
    const g = growth[i] || { start: 1.2, dur: 0.5 };
    intro.to(p, { strokeDashoffset: 0, duration: g.dur, ease: 'power1.inOut' }, 0.15 + g.start);
  });
  intro
    .from('.oak-hero__eyebrow', { y: -12, opacity: 0, duration: 0.7 }, 0.1)
    .from('.oak-hero__title .oak-line', { y: 54, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out' }, 0.25)
    .from(['.oak-hero__sub', '.oak-hero__ctas', '.oak-hero__foot'], { y: 20, opacity: 0, duration: 0.8, stagger: 0.09 }, 0.7);

  // The bloom — canopy washes paint the hero green while leaves and acorns
  // sprout right-to-left, overlapping the last of the ink growth.
  intro
    .addLabel('bloom', 1.45)
    .from(leaves, {
      scale: 0,
      rotation: '-=22',
      opacity: 0,
      transformOrigin: '50% 100%',
      stagger: { each: 0.02, from: 'start' },
      ease: 'back.out(1.4)',
      duration: 0.6,
    }, 'bloom')
    .to(washes, {
      opacity: 0.92,
      stagger: 0.08,
      ease: 'sine.out',
      duration: 0.7,
    }, 'bloom+=0.12')
    .from(washes, {
      scale: 0.84,
      transformOrigin: '50% 50%',
      stagger: 0.08,
      ease: 'sine.out',
      duration: 0.7,
    }, 'bloom+=0.12')
    .from(acorns, {
      scale: 0,
      opacity: 0,
      transformOrigin: '50% 0%',
      stagger: 0.06,
      ease: 'back.out(1.7)',
      duration: 0.4,
    }, 'bloom+=0.6')
    // Copy colour flip as the canopy paints behind it. CSS keeps the flip
    // desktop-only, where the canopy actually grows behind the text.
    .call(() => hero.classList.add('is-bloomed'), null, 'bloom+=0.35');

  // The hint is now purely a scroll cue — retire it on first scroll.
  const hint = hero.querySelector('.oak-hero__hint');
  if (hint) {
    ScrollTrigger.create({
      start: 1,
      once: true,
      onEnter: () => gsap.to(hint, { opacity: 0, duration: 0.3 }),
    });
  }
}

/* ── Mist-clearing section reveals ──────────────────────────────── */
function mistReveals() {
  document.querySelectorAll('[data-mist]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 26,
      filter: 'blur(10px)',
      duration: 1.1,
      ease: 'power2.out',
      clearProps: 'filter',
      scrollTrigger: { trigger: el, start: 'top 84%', once: true },
    });
  });
}

/* ── Stone-etched headings — letters settle into place ──────────── */
function etchHeadings() {
  document.querySelectorAll('[data-etch]').forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 14,
      letterSpacing: '0.14em',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true },
    });
  });
}

/* ── Bedrock — cliff layers drift at different depths ───────────── */
function bedrockParallax() {
  const section = document.querySelector('.oak-bedrock');
  if (!section) return;

  section.querySelectorAll('.oak-cliff').forEach((layer) => {
    const speed = parseFloat(layer.dataset.speed || '0');
    gsap.to(layer, {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  });
}

/* ── Highland Ledger — pinned horizontal scroll (desktop only) ──── */
function highlandLedger(desktop) {
  const section = document.querySelector('.oak-ledger');
  const track = document.querySelector('.oak-ledger__track');
  if (!section || !track || !desktop) return; // mobile uses native scroll

  const dist = () => track.scrollWidth - section.clientWidth;

  gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => '+=' + dist(),
      scrub: 1.4,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });
}

/* ── Shelter — the ancient oak emerges from the mist ────────────── */
function shelterOak() {
  const shelter = document.querySelector('.oak-shelter');
  if (!shelter) return;

  const canopy = shelter.querySelectorAll('.oak-tree__canopy > *');
  const mist = shelter.querySelectorAll('.oak-tree__mist');

  const tl = gsap.timeline({
    scrollTrigger: { trigger: shelter, start: 'top 80%', end: 'top 15%', scrub: 1 },
  });
  tl.from(canopy, {
    scale: 0.9,
    opacity: 0.2,
    transformOrigin: '50% 100%',
    stagger: 0.05,
    ease: 'power2.out',
  });
  if (mist.length) tl.to(mist, { opacity: 0.12, ease: 'power1.out' }, 0);

  // A barely-there sway, as if in a coastal wind.
  const wholeCanopy = shelter.querySelector('.oak-tree__canopy');
  if (wholeCanopy) {
    gsap.to(wholeCanopy, {
      rotation: 0.5,
      transformOrigin: '50% 92%',
      duration: 6.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // Seagulls — wings beat (path morph) while each bird glides out over
  // the North Sea, fades at the horizon, and loops back around.
  shelter.querySelectorAll('.oak-gull').forEach((gull, i) => {
    const flap = gull.dataset.flap;
    const rest = gull.getAttribute('d');
    if (flap && rest) {
      gsap.to(gull, {
        attr: { d: flap },
        duration: 0.38 + i * 0.07,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    const baseOpacity = parseFloat(gull.getAttribute('opacity') || '0.4');
    const flight = 24 + i * 5; // seconds to cross the sky
    const glide = gsap.timeline({ repeat: -1, repeatDelay: 3 + i * 2, delay: i * 5 });
    glide
      .fromTo(gull, { x: 80, y: 10, opacity: 0 }, { opacity: baseOpacity, duration: 2.5, ease: 'none' }, 0)
      .to(gull, { x: -640 - i * 60, duration: flight, ease: 'none' }, 0)
      .to(gull, { y: -14 - i * 6, duration: 3.2 + i, repeat: Math.ceil(flight / (3.2 + i)), yoyo: true, ease: 'sine.inOut' }, 0)
      .to(gull, { opacity: 0, duration: 2.5, ease: 'none' }, flight - 2.5);
  });
}

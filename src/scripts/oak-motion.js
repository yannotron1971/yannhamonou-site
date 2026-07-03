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
    desktop: '(min-width: 761px)',
  },
  (ctx) => {
    if (!ctx.conditions.motionOK) return;
    const desktop = ctx.conditions.desktop;

    heroBloom(desktop);
    mistReveals();
    etchHeadings();
    bedrockParallax();
    highlandLedger(desktop);
    shelterOak();
  }
);

/* ── Hero — the sapling blooms as you scroll ────────────────────── */
function heroBloom(pin) {
  const hero = document.querySelector('.oak-hero');
  if (!hero) return;

  const strokes = hero.querySelectorAll('.oak-branch path');
  const leaves = hero.querySelectorAll('.oak-leaf');
  const acorns = hero.querySelectorAll('.oak-acorn-i');

  // Prepare ink-draw: each stroke starts fully "undrawn".
  strokes.forEach((p) => {
    const len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

  // Entrance — the bare branch is inked in while the copy settles.
  const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
  intro
    .to(strokes, { strokeDashoffset: 0, duration: 1.7, ease: 'power2.inOut', stagger: 0.1 }, 0.15)
    .from('.oak-hero__eyebrow', { y: -12, opacity: 0, duration: 0.7 }, 0.1)
    .from('.oak-hero__title .oak-line', { y: 54, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out' }, 0.25)
    .from(['.oak-hero__sub', '.oak-hero__ctas', '.oak-hero__foot'], { y: 20, opacity: 0, duration: 0.8, stagger: 0.09 }, 0.7);

  // Scroll-to-bloom — leaves and acorns sprout, scrubbed to the scrollbar.
  const bloom = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: pin ? '+=130%' : 'bottom 35%',
      scrub: 1,
      pin,
      anticipatePin: 1,
    },
  });

  bloom
    .from(leaves, {
      scale: 0,
      rotation: '-=26',
      opacity: 0,
      transformOrigin: '50% 100%',
      stagger: { each: 0.06, from: 'start' },
      ease: 'back.out(2)',
      duration: 0.5,
    })
    .from(acorns, {
      scale: 0,
      opacity: 0,
      transformOrigin: '50% 0%',
      stagger: 0.1,
      ease: 'back.out(2.5)',
      duration: 0.4,
    }, '-=0.35')
    .to('.oak-hero__hint', { opacity: 0, duration: 0.15 }, 0.05);
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
        scrub: true,
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
      scrub: 1,
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
}

/**
 * Site-wide motion — GSAP + ScrollTrigger.
 *
 * Everything runs inside a `prefers-reduced-motion: no-preference` matchMedia
 * context, so reduced-motion users (and no-JS visitors) get the fully visible
 * static page. GSAP only ever animates FROM hidden states, never gates content.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  heroEntrance();
  sectionHeads();
  listReveals();
  countUps();
  smokeDrift();
  scrollHint();
});

/* ── Hero entrance — the one rehearsed moment ─────────────────── */
function heroEntrance() {
  const hero = document.querySelector('.v4-hero');
  if (!hero) return;

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
}

/* ── Section heads — heading block rises once on scroll ───────── */
function sectionHeads() {
  document.querySelectorAll('.v4-section-head').forEach((head) => {
    if (head.closest('.v4-hero')) return;
    gsap.from(head.children, {
      y: 22,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      stagger: 0.1,
      scrollTrigger: { trigger: head, start: 'top 85%', once: true },
    });
  });
}

/* ── List rhythm — sibling stagger for real item groups ────────── */
function listReveals() {
  const groups = [
    { sel: '.v4-works-rail', vars: { x: 56 } }, // horizontal rail slides in from the right
    { sel: '.v4-services', vars: { y: 28 } },
    { sel: '.v4-testimonials', vars: { y: 24 } },
    { sel: '.v4-posts', vars: { y: 24 } },
    { sel: '.v4-intro__stats', vars: { y: 20 } },
  ];

  groups.forEach(({ sel, vars }) => {
    document.querySelectorAll(sel).forEach((group) => {
      const items = Array.from(group.children);
      if (!items.length) return;
      gsap.from(items, {
        ...vars,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        stagger: Math.min(0.08, 0.5 / items.length),
        scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      });
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

    gsap.to(counter, {
      val: num,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate() {
        el.textContent = prefix + counter.val.toFixed(decimals) + suffix;
      },
      onComplete() {
        el.textContent = original; // restore exact source text
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

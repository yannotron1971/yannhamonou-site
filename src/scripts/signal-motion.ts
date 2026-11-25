/* Signal Poster motion, ported from the Ploy build's src/lib/motion.ts.

   Section entrances: one timeline per [data-group], played once as it nears
   the viewport, using transform and opacity only. Each element's data-m picks
   its entrance:
     frame  fades in as its media settles from 108% scale
     split  heading lines rise through padded masks (SplitText)
     fade   opacity only
     rise   moves up 24px
     scale  grows from 96%
   [data-count] numbers count up once, when fully in view.
   [data-sun] hero suns sink as the page scrolls past them.
   [data-disc] orange discs slide left 42% to overlap their circle photo.

   Every hidden state ends visible, also after a font re-split. With
   prefers-reduced-motion nothing is hidden and nothing runs. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

/* The "creative" feel from the Ploy motion lib. */
const MOTION = {
  ease: 'expo.out',
  entrance: 0.9,
  frame: 1.1,
  stagger: 0.06,
  start: 'top 110%',
};

const MEDIA = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
};

const SPLIT = { type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true } as const;

function riseLines(tl: gsap.core.Timeline, el: Element, lines: Element[], at: number) {
  tl.set(el, { opacity: 1 }, at).fromTo(
    lines,
    { yPercent: 130, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: MOTION.entrance, stagger: MOTION.stagger },
    at,
  );
}

function revealGroup(group: HTMLElement) {
  const own = (sel: string) =>
    Array.from(group.querySelectorAll<HTMLElement>(sel)).filter((el) => el.closest('[data-group]') === group);

  const frames = own('[data-m="frame"]');
  const splits = own('[data-m="split"]');
  const parts = own('[data-m="fade"], [data-m="rise"], [data-m="scale"]');
  const counts = own('[data-count]');
  const trigger = { trigger: group, start: MOTION.start, once: true };
  const at = frames.length ? 0.2 : 0;
  const fadeAt = at + (splits.length ? 0.35 : 0);

  const tl = gsap.timeline({ defaults: { ease: MOTION.ease }, scrollTrigger: trigger });

  frames.forEach((f) => {
    tl.fromTo(f, { opacity: 0 }, { opacity: 1, duration: MOTION.frame }, 0);
    const media = f.querySelector('img, video');
    if (media) tl.fromTo(media, { scale: 1.08 }, { scale: 1, duration: MOTION.frame + 0.3 }, 0);
  });

  const from = { fade: {}, rise: { y: 24 }, scale: { scale: 0.96 } };
  const to = { fade: {}, rise: { y: 0 }, scale: { scale: 1 } };
  parts.forEach((el, i) => {
    const m = el.dataset.m as keyof typeof from;
    tl.fromTo(el, { opacity: 0, ...from[m] }, { opacity: 1, ...to[m], duration: MOTION.entrance }, fadeAt + i * MOTION.stagger);
  });

  counts.forEach((el) => {
    const end = Number(el.dataset.count);
    if (!Number.isFinite(end)) return;
    const final = el.textContent ?? '';
    const decimals = Number(el.dataset.decimals ?? 0);
    const show = (v: number) =>
      (el.dataset.prefix ?? '') +
      v.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
      (el.dataset.suffix ?? '');
    // Hold the final width so the line never shifts while digits change.
    if (getComputedStyle(el).display === 'inline') el.style.display = 'inline-block';
    el.style.fontVariantNumeric = 'tabular-nums';
    el.style.minWidth = `${el.offsetWidth}px`;
    const n = { v: 0 };
    gsap.fromTo(n, { v: 0 }, {
      v: end,
      duration: 1,
      ease: 'power2.out',
      immediateRender: false,
      scrollTrigger: { trigger: el, start: 'bottom bottom', once: true },
      onUpdate: () => void (el.textContent = show(n.v)),
      onComplete: () => void (el.textContent = final),
      onInterrupt: () => void (el.textContent = final),
    });
  });

  // Each heading owns its timeline, so a re-split rebuilds only that heading.
  splits.forEach((el, i) => {
    SplitText.create(el, {
      ...SPLIT,
      onSplit: (s) => {
        const lines = gsap.timeline({ defaults: { ease: MOTION.ease }, scrollTrigger: trigger });
        riseLines(lines, el, s.lines as Element[], at + i * 0.15);
        return lines;
      },
    });
  });
}

/* The page's one scroll-linked moment: a hero sun sinks as its section leaves
   the screen. The wrapper moves, never the sun itself, because the sun carries
   its own entrance animation and, on inner pages, a CSS translate that GSAP
   would overwrite. data-sun is how far it sinks, in sun heights. */
function setSuns(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-sun]').forEach((wrap) => {
    const sun = wrap.firstElementChild as HTMLElement | null;
    const section = wrap.closest('section');
    if (!sun || !section) return;
    const depth = Number(wrap.dataset.sun) || 0.5;
    gsap.fromTo(wrap, { y: 0 }, {
      y: () => sun.offsetHeight * depth,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'clamp(bottom bottom)',
        end: 'bottom top',
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
  });
}

function slideDiscs(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-disc]').forEach((disc) => {
    gsap.fromTo(disc, { xPercent: 0 }, {
      xPercent: Number(disc.dataset.disc) || -42,
      duration: 1.2,
      ease: MOTION.ease,
      scrollTrigger: { trigger: disc, start: 'top 80%', once: true },
    });
  });
}

function init() {
  const root = document.documentElement;
  root.dataset.motionReady = '1';

  gsap.matchMedia().add(MEDIA, (ctx) => {
    if (ctx.conditions?.reduced) {
      root.classList.remove('js-motion');
      return;
    }
    setSuns(document);
    document.querySelectorAll<HTMLElement>('[data-group]').forEach(revealGroup);
    slideDiscs(document);
  });

  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') requestAnimationFrame(refresh);
  else addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
}

init();

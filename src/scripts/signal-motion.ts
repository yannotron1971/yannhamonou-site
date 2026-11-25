/* Signal Poster motion. Two things need a script:
     [data-sun]    hero suns sink as the page scrolls past them
     [data-count]  numbers count up once, when fully in view

   Both start from the finished page, so without JavaScript or with
   prefers-reduced-motion everything simply stands. Hero entrances and hover
   states are CSS, in global.css. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

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

function countUp(el: HTMLElement) {
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
}

function init() {
  gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
    setSuns(document);
    // .count belongs to the Keelson concept page, which runs its own.
    document.querySelectorAll<HTMLElement>('[data-count]:not(.count)').forEach(countUp);
  });

  const refresh = () => ScrollTrigger.refresh();
  if (document.readyState === 'complete') requestAnimationFrame(refresh);
  else addEventListener('load', refresh, { once: true });
  document.fonts?.ready.then(refresh);
}

init();

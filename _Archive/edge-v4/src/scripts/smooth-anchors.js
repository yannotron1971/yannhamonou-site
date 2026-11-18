/**
 * Smooth scrolling for same-page anchors.
 *
 * This has to be JavaScript. The stylesheet asks for `scroll-behavior: smooth`
 * under a no-preference query, but ScrollTrigger writes `scroll-behavior: auto`
 * inline on <html> the moment it initialises — deliberately, because native
 * smooth scrolling desynchronises its scroll measurements. Inline style beats a
 * stylesheet, so that CSS rule has never had any effect on a page that loads
 * motion.js. Rather than fight it, the glide is driven by GSAP itself.
 *
 * Anchor links only. There is no scroll hijacking here: the wheel, the
 * trackpad, the scrollbar and the keyboard all keep their native behaviour,
 * which on this page matters — it carries a live WebGL field and a blurred
 * sticky nav, and a per-frame scroll lerp on top of those is exactly the cost
 * the frame budget cannot absorb.
 */
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

/** Clear the sticky nav, so a section head never lands underneath it. */
function offset() {
  const nav = document.querySelector('.v4-nav');
  return nav ? nav.getBoundingClientRect().height + 8 : 0;
}

document.addEventListener('click', (e) => {
  // Let the browser handle anything that is not a plain left click on a link.
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const id = link.getAttribute('href');
  if (!id || id === '#') return;

  let target;
  try {
    target = document.querySelector(id);
  } catch {
    return; // not a valid selector — leave it to the browser
  }
  if (!target) return;

  e.preventDefault();

  if (reduced.matches) {
    target.scrollIntoView();
  } else {
    gsap.to(window, {
      duration: 0.9,
      ease: 'power2.inOut',
      scrollTo: { y: target, offsetY: offset(), autoKill: true },
    });
  }

  /* Keep the URL and the keyboard in step: scrolling alone leaves the hash
     stale and focus stranded at the top of the document. */
  history.pushState(null, '', id);
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
});

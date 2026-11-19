/* Web-work fan on /work: three previews held like a hand of cards.

   The resting arc is plain CSS in src/pages/work/index.astro, so it shows
   without this script. From md up, with motion allowed, this script:
     - unfolds the fan once as the band nears the viewport
     - opens it slightly while the pointer is over the link, and lifts the
       card under the pointer (the CSS hover removes its grayscale)
     - drifts and tilts the whole fan a few px and degrees toward the
       pointer, on mouse devices only
   Flat 2D transforms only: no perspective, no shadows. */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Pose = { rotation: number; xPercent: number; y: number };

const REST: Pose[] = [
  { rotation: -7, xPercent: 0, y: 0 },
  { rotation: 0, xPercent: 0, y: -16 },
  { rotation: 7, xPercent: 0, y: 0 },
];
const OPEN: Pose[] = [
  { rotation: -10, xPercent: -6, y: 0 },
  { rotation: 0, xPercent: 0, y: -16 },
  { rotation: 10, xPercent: 6, y: 0 },
];
const LIFT = 12;
const DRIFT = 8;
const TILT = 2;

const fan = document.querySelector<HTMLElement>('[data-fan]');
const link = fan?.closest('a');
const band = fan?.closest('section');
const cards = fan ? Array.from(fan.querySelectorAll<HTMLElement>('.fan-card')) : [];

if (fan && link && band && cards.length === 3) {
  gsap.matchMedia().add(
    {
      wide: '(min-width: 768px)',
      motion: '(prefers-reduced-motion: no-preference)',
      mouse: '(hover: hover) and (pointer: fine)',
    },
    (ctx) => {
      const { wide, motion, mouse } = ctx.conditions ?? {};
      if (!wide || !motion) return;

      const base = (i: number) => (i === 1 ? 2 : 1);
      gsap.set(cards, { transformOrigin: '50% 140%' });
      cards.forEach((c, i) => gsap.set(c, { ...REST[i], zIndex: base(i) }));

      // Unfold: outer cards start stacked behind the centre card, upright.
      gsap.from(cards, {
        rotation: 0,
        xPercent: (i: number) => (i === 0 ? 88 : i === 2 ? -88 : 0),
        y: -16,
        duration: 0.9,
        ease: 'expo.out',
        stagger: { each: 0.06, from: 'center' },
        scrollTrigger: { trigger: band, start: 'top 110%', once: true },
      });

      if (!mouse) return;

      let open = false;
      let lifted = -1;

      const layout = (duration: number) => {
        cards.forEach((c, i) => {
          const pose = (open ? OPEN : REST)[i];
          const up = i === lifted;
          gsap.set(c, { zIndex: up ? 3 : base(i) });
          gsap.to(c, {
            rotation: up ? pose.rotation / 2 : pose.rotation,
            xPercent: pose.xPercent,
            y: pose.y - (up ? LIFT : 0),
            duration,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        });
      };

      const onLinkEnter = () => { open = true; layout(0.5); };
      const onLinkLeave = () => { open = false; lifted = -1; layout(0.6); };
      const cardEnter = cards.map((_, i) => () => { lifted = i; layout(0.5); });

      // Cursor drift and tilt across the whole band.
      const toX = gsap.quickTo(fan, 'x', { duration: 0.6, ease: 'power3.out' });
      const toRot = gsap.quickTo(fan, 'rotation', { duration: 0.6, ease: 'power3.out' });
      const onMove = (e: PointerEvent) => {
        const r = band.getBoundingClientRect();
        const nx = gsap.utils.clamp(-1, 1, ((e.clientX - r.left) / r.width) * 2 - 1);
        toX(nx * DRIFT);
        toRot(nx * TILT);
      };
      const onBandLeave = () => { toX(0); toRot(0); };

      link.addEventListener('pointerenter', onLinkEnter);
      link.addEventListener('pointerleave', onLinkLeave);
      cards.forEach((c, i) => c.addEventListener('pointerenter', cardEnter[i]));
      band.addEventListener('pointermove', onMove);
      band.addEventListener('pointerleave', onBandLeave);

      return () => {
        link.removeEventListener('pointerenter', onLinkEnter);
        link.removeEventListener('pointerleave', onLinkLeave);
        cards.forEach((c, i) => c.removeEventListener('pointerenter', cardEnter[i]));
        band.removeEventListener('pointermove', onMove);
        band.removeEventListener('pointerleave', onBandLeave);
      };
    },
  );
}

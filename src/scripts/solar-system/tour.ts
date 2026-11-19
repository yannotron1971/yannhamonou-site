/* Scroll state for the Solar System tour. Loaded with the page, before
   three.js, so the facts panels and the progress rail work even if the 3D
   scene never arrives. The scene imports the same instance and reads `f`.

   f is a continuous stop index: 0 at the centre of the first section, 1 at
   the centre of the second, and so on. Between centres it moves linearly
   with scroll, which is all the camera needs. */

type Listener = (index: number) => void;

let stops: HTMLElement[] = [];
let centers: number[] = [];
let rail: HTMLButtonElement[] = [];
let f = 0;
let active = -1;
let locked = false;
const listeners = new Set<Listener>();
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function measure() {
  centers = stops.map((s) => {
    const r = s.getBoundingClientRect();
    return r.top + window.scrollY + r.height / 2;
  });
  read();
}

function read() {
  if (locked || !centers.length) return;
  const y = window.scrollY + window.innerHeight / 2;
  let next = centers.length - 1;
  if (y <= centers[0]) next = 0;
  else {
    for (let i = 0; i < centers.length - 1; i++) {
      if (y < centers[i + 1]) {
        next = i + (y - centers[i]) / (centers[i + 1] - centers[i]);
        break;
      }
    }
  }
  f = next;
  const idx = Math.round(f);
  if (idx !== active) setActive(idx);
}

function setActive(idx: number) {
  active = idx;
  document.documentElement.dataset.stop = String(idx);
  document.documentElement.toggleAttribute('data-last', idx === stops.length - 1);
  stops.forEach((s, i) => s.classList.toggle('is-active', i === idx));
  rail.forEach((b) => {
    const on = Number(b.dataset.goto) === idx;
    b.classList.toggle('is-current', on);
    if (on) b.setAttribute('aria-current', 'step');
    else b.removeAttribute('aria-current');
  });
  listeners.forEach((cb) => cb(idx));
}

function goto(i: number) {
  const clamped = Math.max(0, Math.min(stops.length - 1, i));
  window.scrollTo({ top: centers[clamped] - window.innerHeight / 2, behavior: reduced ? 'auto' : 'smooth' });
}

export const tour = {
  get f() {
    return f;
  },
  get active() {
    return active;
  },
  get keys() {
    return stops.map((s) => s.dataset.frame ?? '');
  },
  get count() {
    return stops.length;
  },
  onChange(cb: Listener) {
    listeners.add(cb);
    if (active >= 0) cb(active);
    return () => listeners.delete(cb);
  },
  goto,
  measure,
  /** While exploring, page scroll is frozen and f stays where it was. */
  setLocked(on: boolean) {
    locked = on;
    if (!on) measure();
  },
};

export function initTour() {
  stops = Array.from(document.querySelectorAll<HTMLElement>('[data-frame]'));
  /* Cards only start hidden once this controller is running to reveal
     them; if the script fails, every card stays visible. */
  document.documentElement.classList.add('ss-tour');
  rail = Array.from(document.querySelectorAll<HTMLButtonElement>('.ss-rail [data-goto]'));
  rail.forEach((b) => b.addEventListener('click', () => goto(Number(b.dataset.goto))));

  let queued = false;
  window.addEventListener(
    'scroll',
    () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        read();
      });
    },
    { passive: true },
  );
  window.addEventListener('resize', measure);
  new ResizeObserver(measure).observe(document.body);

  window.addEventListener('keydown', (e) => {
    if (locked || e.altKey || e.ctrlKey || e.metaKey) return;
    const t = e.target as HTMLElement | null;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goto(active + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goto(active - 1);
    }
  });

  measure();
}

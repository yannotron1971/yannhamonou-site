/**
 * The Edge hero hands over to the white sheet.
 *
 * The hero is sticky at the top of the page and the sheet scrolls up over it.
 * Three things have to happen together as that occurs: the field behind the
 * hero fades out, the nav flips to its light state so a dark bar never sits on
 * white content, and the hero — still in the document, just covered — stops
 * taking keyboard focus.
 *
 * This lives apart from edge-field.js because it used to live inside it, after
 * the early return for a missing WebGL context. On any browser without WebGL —
 * or any browser where Chrome had turned the GPU off, which is not
 * hypothetical, it happened here — the canvas was removed and this never ran,
 * so the nav kept its dark tokens all the way down a white page. The handover
 * is a layout concern, not a graphics one, and it now runs either way.
 *
 * The field subscribes to the `edge:handover` event to know when it is fully
 * faded and can stop drawing.
 */
export function initEdgeHandover() {
  const hero = document.querySelector('.edge-hero, .edge-page-hero');
  if (!hero) return;

  /* The homepage hero is sticky and held under the sheet; an inner page's hero
     scrolls away like anything else. That difference decides both where the
     nav flips and whether the hero has to leave the tab order. */
  const sticky = hero.classList.contains('edge-hero');
  const body = document.body;
  const canvas = document.querySelector('.edge-field');
  const nav = document.querySelector('.v4-nav');
  let tick = 0;

  function update() {
    tick = 0;
    const vh = Math.max(1, window.innerHeight);
    const p = Math.min(1, window.scrollY / vh);

    /* Hold, then fall away — the sheet is most of the way up before the ground
       starts going, so you never catch pale hero text on white. */
    const opacity = Math.max(0, 1 - Math.pow(Math.min(1, p / 0.92), 2.2));
    if (canvas) canvas.style.opacity = String(opacity);

    /* On the homepage the sheet rises over a held hero, so the flip is a
       fraction of the viewport. On an inner page the hero simply leaves, so the
       flip happens when its last pixel passes under the nav — otherwise a dark
       bar sits on white content, or a light one on the hero. */
    const covered = sticky
      ? p > 0.62
      : window.scrollY > hero.offsetHeight - (nav ? nav.offsetHeight : 0);
    body.classList.toggle('sheet-active', covered);

    /* Covered, so out of the tab order — but only where the hero is held under
       the sheet. A hero that has scrolled away is off screen like any other
       content, and marking it inert would hide it from a reader who scrolls
       back up. */
    if (sticky && hero.inert !== covered) hero.inert = covered;

    window.dispatchEvent(new CustomEvent('edge:handover', {
      detail: { progress: p, opacity, covered },
    }));
  }

  function onScroll() {
    if (!tick) tick = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* Runs regardless of motion preference: this is a position change and a
     focus-management concern, not an animation. */
  update();
}

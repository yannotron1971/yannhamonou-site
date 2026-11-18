/**
 * The index roll, on every link that can carry it.
 *
 * The effect needs two copies of the label inside a one-line mask, so it is a
 * markup change — and writing that by hand across 363 links in twenty
 * templates is not maintainable. This adds it at runtime instead: the server
 * sends a plain link, and anything that qualifies gets wrapped once the page
 * is interactive.
 *
 * That ordering is the point. Without JavaScript, or before this runs, every
 * link is an ordinary link with its own colour transition. Nothing here is
 * load-bearing for reading or navigating the site.
 *
 * WHAT IS EXCLUDED, and why
 *
 * - Links already rolled by a template — the index and the service rows own
 *   theirs, at display scale with their own leading.
 * - Links inside prose. A mask needs overflow:hidden and nowrap, which breaks
 *   a sentence the moment it wraps. An inline link mid-paragraph keeps the
 *   colour transition and nothing else.
 * - Links that are not a single run of text: anything wrapping an image, a
 *   logo, an icon, or more than one element.
 * - Links whose label already occupies more than one line, measured rather
 *   than guessed — a two-line label in a one-line mask loses its second line.
 * - Reduced motion. The label still changes colour; it just does not travel.
 */

const SKIP_CLOSEST = [
  '.v4-prose', // long-form body copy
  '.edge-lede', // the proposition paragraph
  'p', // any link sitting inside a paragraph is inline by definition
];

/* Templates that already build the roll themselves. */
const ALREADY_ROLLED = '.v4-roll, .v4-drawer__links a, .edge-row--service';

const eligible = (a) => {
  if (a.closest(ALREADY_ROLLED) || a.querySelector('.v4-roll__a')) return false;
  if (SKIP_CLOSEST.some((sel) => a.closest(sel))) return false;

  /* One text node and nothing else. Rules out logos, icons and arrows that
     live in their own element. */
  const kids = [...a.childNodes];
  const text = kids.filter((n) => n.nodeType === 3 && n.textContent.trim());
  if (text.length !== 1 || kids.some((n) => n.nodeType === 1)) return false;

  /* One box per line fragment — but measured over the TEXT, not the element.
     A flex or inline-block link reports a single box however many lines its
     label runs to, which let a long button label through: the mask sets
     nowrap, so a label that used to wrap was forced onto one line and pushed
     405px of button across a 390px viewport. A Range sees the lines. */
  const range = document.createRange();
  range.selectNodeContents(a);
  if (range.getClientRects().length !== 1) return false;

  /* And it must still fit unwrapped, since the mask will stop it wrapping. */
  const room = (a.closest('section, footer, nav, div') || document.body).clientWidth;
  if (range.getBoundingClientRect().width > room) return false;

  const label = a.textContent.trim();
  return label.length > 0 && label.length <= 48;
};

const roll = (a) => {
  const label = a.textContent.trim();
  a.textContent = '';

  /* The mask is an inner span, never the link itself. A padded link is taller
     than its text — .edge-btn is 48px around a 22px line — so masking the link
     leaves the arriving copy parked inside the visible box and both labels
     read at once. An inner span is exactly one line tall whatever padding,
     display or flex the link carries. */
  const mask = document.createElement('span');
  mask.className = 'v4-roll v4-roll--inline';

  const first = document.createElement('span');
  first.className = 'v4-roll__a';
  first.textContent = label;

  /* The arriving copy is a duplicate; it is hidden so the link is announced
     once. */
  const second = document.createElement('span');
  second.className = 'v4-roll__b';
  second.setAttribute('aria-hidden', 'true');
  second.textContent = label;

  mask.append(first, second);
  a.append(mask);
};

const run = () => {
  const links = document.querySelectorAll('a');
  let n = 0;
  for (const a of links) {
    if (!eligible(a)) continue;
    roll(a);
    n++;
  }
  document.documentElement.dataset.linkRoll = String(n);
};

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  /* After paint: this reads layout (getClientRects) on every link, and doing
     that during the critical path would be a needless forced reflow. */
  requestAnimationFrame(() => requestAnimationFrame(run));
}

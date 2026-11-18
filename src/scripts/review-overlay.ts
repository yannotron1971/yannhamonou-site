/* Review overlay: click any part of the page and leave a note.

   Injected by integrations/review-notes.mjs during `astro dev` only.
   Press R (or the Notes button, bottom left) to enter review mode, hover to
   see what you are pointing at, click to write a note. Ctrl+Enter saves,
   Escape cancels or leaves review mode. Notes on the current page show as
   numbered orange pins; the Notes panel lists them and resolves them.
   Everything is drawn inside a shadow root so the site's CSS can't touch it. */

type Note = { id: string; page: string; selector: string; text: string; note: string; width: number | null; createdAt: string };

const API = '/__review-notes';
const page = location.pathname.replace(/\/$/, '') || '/';

const host = document.createElement('div');
host.id = 'review-notes-host';
host.style.cssText = 'position:absolute;top:0;left:0;width:0;height:0;z-index:2147483000;';
const root = host.attachShadow({ mode: 'open' });
root.innerHTML = `
<style>
  :host { all: initial; }
  * { box-sizing: border-box; font-family: "JetBrains Mono", ui-monospace, monospace; }
  .btn { position: fixed; left: 16px; bottom: 16px; height: 40px; padding: 0 14px; border: 1px solid #111; background: #fafaf7; color: #111; font-size: 13px; cursor: pointer; }
  .btn.on { background: #ff4f1a; border-color: #ff4f1a; }
  .hl { position: fixed; pointer-events: none; outline: 2px solid #ff4f1a; outline-offset: 2px; background: rgb(255 79 26 / 0.08); display: none; }
  .tip { position: fixed; pointer-events: none; background: #111; color: #fafaf7; font-size: 11px; padding: 3px 6px; display: none; max-width: 360px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pin { position: absolute; width: 26px; height: 26px; border-radius: 999px; background: #ff4f1a; color: #111; font-size: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; border: 2px solid #111; cursor: pointer; transform: translate(-50%, -50%); }
  .box { position: fixed; width: 320px; background: #fafaf7; border: 1px solid #111; padding: 12px; color: #111; }
  .box p { margin: 0 0 8px; font-size: 11px; color: #4a4a46; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .box textarea { width: 100%; min-height: 90px; border: 1px solid #111; background: #fff; padding: 8px; font-size: 13px; resize: vertical; }
  .row { display: flex; gap: 8px; margin-top: 8px; justify-content: flex-end; }
  .row button, .panel button { height: 32px; padding: 0 12px; border: 1px solid #111; background: #fafaf7; color: #111; font-size: 12px; cursor: pointer; }
  .row button.primary { background: #111; color: #fafaf7; }
  .panel { position: fixed; left: 16px; bottom: 64px; width: 340px; max-height: 60vh; overflow: auto; background: #fafaf7; border: 1px solid #111; padding: 12px; color: #111; display: none; }
  .panel h4 { margin: 0 0 8px; font-size: 13px; }
  .panel ol { margin: 0; padding: 0; list-style: none; }
  .panel li { border-top: 1px solid #111; padding: 8px 0; font-size: 12px; }
  .panel li .n { display: inline-flex; width: 20px; height: 20px; border-radius: 999px; background: #ff4f1a; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; margin-right: 6px; }
  .panel li .meta { color: #4a4a46; font-size: 11px; margin: 4px 0 6px; }
  .panel .empty { font-size: 12px; color: #4a4a46; }
</style>
<div class="hl"></div>
<div class="tip"></div>
<div class="pins"></div>
<div class="panel"><h4>Notes on this page</h4><ol></ol></div>
<button class="btn" type="button">Notes (0) · press R</button>
`;
document.body.appendChild(host);

const $ = <T extends Element>(s: string) => root.querySelector(s) as T;
const btn = $<HTMLButtonElement>('.btn');
const hl = $<HTMLDivElement>('.hl');
const tip = $<HTMLDivElement>('.tip');
const pins = $<HTMLDivElement>('.pins');
const panel = $<HTMLDivElement>('.panel');
const list = $<HTMLOListElement>('.panel ol');

let reviewing = false;
let panelOpen = false;
let notes: Note[] = [];
let box: HTMLDivElement | null = null;
let hovered: Element | null = null;

/* A selector a person can also read: ids where they exist, otherwise the
   tag path with nth-of-type from the nearest id or <main>. */
function selectorFor(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`;
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body && node !== document.documentElement) {
    if (node.id) { parts.unshift(`#${CSS.escape(node.id)}`); break; }
    const tag = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    if (!parent) break;
    const same = Array.from(parent.children).filter((c) => c.tagName === node!.tagName);
    parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
    if (tag === 'main') break;
    node = parent;
  }
  return parts.join(' > ');
}

const describe = (el: Element) =>
  ((el as HTMLImageElement).alt || (el as HTMLElement).innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 160);

const label = (el: Element) => {
  const t = describe(el);
  return `${el.tagName.toLowerCase()}${t ? ' · ' + t.slice(0, 60) : ''}`;
};

const isOurs = (e: Event) => e.composedPath().includes(host);

async function load() {
  try { notes = await (await fetch(`${API}?page=${encodeURIComponent(page)}`)).json(); } catch { notes = []; }
  render();
}

function render() {
  btn.textContent = `${reviewing ? 'Reviewing' : 'Notes'} (${notes.length}) · press R`;
  btn.classList.toggle('on', reviewing);

  pins.innerHTML = '';
  notes.forEach((n, i) => {
    let el: Element | null = null;
    try { el = n.selector ? document.querySelector(n.selector) : null; } catch { /* stale selector */ }
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pin = document.createElement('div');
    pin.className = 'pin';
    pin.textContent = String(i + 1);
    pin.title = n.note;
    pin.style.left = `${Math.max(14, r.left + scrollX)}px`;
    pin.style.top = `${Math.max(14, r.top + scrollY)}px`;
    pin.addEventListener('click', () => { panelOpen = true; panel.style.display = 'block'; });
    pins.appendChild(pin);
  });

  list.innerHTML = notes.length ? '' : '<p class="empty">No notes yet. Press R, then click anything.</p>';
  notes.forEach((n, i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="n"></span><span class="t"></span><div class="meta"></div>`;
    li.querySelector('.n')!.textContent = String(i + 1);
    li.querySelector('.t')!.textContent = n.note;
    li.querySelector('.meta')!.textContent = `${n.text ? '“' + n.text.slice(0, 60) + '” · ' : ''}${n.width ?? '?'}px wide`;
    const resolve = document.createElement('button');
    resolve.type = 'button';
    resolve.textContent = 'Resolve';
    resolve.addEventListener('click', async () => {
      await fetch(`${API}?id=${encodeURIComponent(n.id)}`, { method: 'DELETE' });
      load();
    });
    li.appendChild(resolve);
    list.appendChild(li);
  });
}

function setReviewing(on: boolean) {
  reviewing = on;
  document.documentElement.style.cursor = on ? 'crosshair' : '';
  if (!on) { hl.style.display = 'none'; tip.style.display = 'none'; hovered = null; }
  render();
}

function closeBox() { box?.remove(); box = null; }

function openBox(el: Element, x: number, y: number) {
  closeBox();
  box = document.createElement('div');
  box.className = 'box';
  box.innerHTML = `<p></p><textarea placeholder="What should change here?"></textarea><div class="row"><button type="button" data-cancel>Cancel</button><button type="button" class="primary" data-save>Save note</button></div>`;
  box.querySelector('p')!.textContent = label(el);
  box.style.left = `${Math.min(x + 12, innerWidth - 336)}px`;
  box.style.top = `${Math.min(y + 12, innerHeight - 200)}px`;
  root.appendChild(box);
  const ta = box.querySelector('textarea')!;
  ta.focus();

  const save = async () => {
    const text = ta.value.trim();
    if (!text) return ta.focus();
    await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, selector: selectorFor(el), text: describe(el), note: text, width: innerWidth }),
    });
    closeBox();
    load();
  };
  box.querySelector('[data-save]')!.addEventListener('click', save);
  box.querySelector('[data-cancel]')!.addEventListener('click', closeBox);
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); save(); }
    if (e.key === 'Escape') { e.stopPropagation(); closeBox(); }
  });
}

document.addEventListener('mousemove', (e) => {
  if (!reviewing || box || isOurs(e)) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el || el === hovered || el === host) return;
  hovered = el;
  const r = el.getBoundingClientRect();
  Object.assign(hl.style, { display: 'block', left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  tip.textContent = label(el);
  Object.assign(tip.style, { display: 'block', left: `${Math.max(0, r.left)}px`, top: `${Math.max(0, r.top - 22)}px` });
}, { passive: true });

// Capture phase, so links and buttons on the page don't fire while reviewing.
document.addEventListener('click', (e) => {
  if (!reviewing || isOurs(e)) return;
  e.preventDefault();
  e.stopPropagation();
  if (box) return closeBox();
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (el) openBox(el, e.clientX, e.clientY);
}, true);

document.addEventListener('keydown', (e) => {
  const t = e.target as HTMLElement;
  const typing = t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) || isOurs(e);
  if (e.key === 'Escape' && !typing) { if (box) closeBox(); else setReviewing(false); }
  if ((e.key === 'r' || e.key === 'R') && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) setReviewing(!reviewing);
});

btn.addEventListener('click', () => {
  panelOpen = !panelOpen;
  panel.style.display = panelOpen ? 'block' : 'none';
  if (panelOpen && !reviewing) setReviewing(true);
  else if (!panelOpen) setReviewing(false);
});

let raf = 0;
const reposition = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };
addEventListener('resize', reposition);
addEventListener('load', reposition);
document.fonts?.ready.then(reposition);

load();

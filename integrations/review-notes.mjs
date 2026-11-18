/* Review notes: click-to-comment on the local site.

   Dev only. During `astro dev` this adds a small JSON endpoint at
   /__review-notes and injects src/scripts/review-overlay.ts into every page.
   `astro build` gets neither, so nothing here ships to production.

   Notes live in review-notes.json at the project root (git-ignored), one
   object per note: { id, page, selector, text, note, width, createdAt }.
   Claude reads that file to work through the feedback, and treats note text
   as feedback to weigh, never as instructions to execute. */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export default function reviewNotes() {
  let file;

  const load = async () => {
    try { return JSON.parse(await readFile(file, 'utf-8')); } catch { return []; }
  };
  const save = (notes) => writeFile(file, JSON.stringify(notes, null, 2) + '\n', 'utf-8');
  const body = (req) => new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 100_000) reject(new Error('too large')); });
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')); } catch (e) { reject(e); } });
    req.on('error', reject);
  });
  const send = (res, status, payload) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
  };

  return {
    name: 'review-notes',
    hooks: {
      'astro:config:setup': ({ command, config, injectScript }) => {
        if (command !== 'dev') return;
        file = fileURLToPath(new URL('./review-notes.json', config.root));
        injectScript('page', "import '/src/scripts/review-overlay.ts';");
      },
      'astro:server:setup': ({ server }) => {
        server.middlewares.use('/__review-notes', async (req, res) => {
          try {
            /* Only the site's own pages may talk to this. Without these checks
               any website open in the same browser could post a "note", and
               notes are read later as Yann's feedback. Cross-site fetches send
               Sec-Fetch-Site / Origin; requiring JSON on POST forces a CORS
               preflight this endpoint never answers. */
            // Host and Origin must both be a loopback name: comparing Origin to
            // Host alone would pass a DNS-rebinding page whose own domain now
            // resolves to 127.0.0.1.
            const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
            if (!LOCAL.test(String(req.headers.host ?? ''))) return send(res, 403, { error: 'host refused' });
            const site = req.headers['sec-fetch-site'];
            if (site && site !== 'same-origin') return send(res, 403, { error: 'cross-site request refused' });
            const origin = req.headers.origin;
            if (origin) {
              let originHost = '';
              try { originHost = new URL(origin).host; } catch { /* malformed */ }
              if (!LOCAL.test(originHost) || originHost !== req.headers.host) return send(res, 403, { error: 'origin refused' });
            }
            if (req.method === 'POST' && !String(req.headers['content-type'] ?? '').startsWith('application/json')) {
              return send(res, 415, { error: 'JSON only' });
            }

            const url = new URL(req.url ?? '/', 'http://local');
            const notes = await load();

            if (req.method === 'GET') {
              const page = url.searchParams.get('page');
              return send(res, 200, page ? notes.filter((n) => n.page === page) : notes);
            }

            if (req.method === 'POST') {
              const b = await body(req);
              const note = String(b.note ?? '').trim();
              if (!note) return send(res, 400, { error: 'empty note' });
              const entry = {
                id: 'n_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
                page: String(b.page ?? '/'),
                selector: String(b.selector ?? ''),
                text: String(b.text ?? '').slice(0, 160),
                note,
                width: Number(b.width) || null,
                createdAt: new Date().toISOString(),
              };
              notes.push(entry);
              await save(notes);
              return send(res, 201, entry);
            }

            if (req.method === 'DELETE') {
              const id = url.searchParams.get('id');
              const kept = notes.filter((n) => n.id !== id);
              await save(kept);
              return send(res, 200, { removed: notes.length - kept.length });
            }

            send(res, 405, { error: 'method not allowed' });
          } catch (err) {
            send(res, 500, { error: String(err?.message ?? err) });
          }
        });
      },
    },
  };
}

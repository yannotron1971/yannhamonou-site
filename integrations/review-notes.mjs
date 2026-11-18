/* Review notes: click-to-comment on the local site.

   Dev only. During `astro dev` this adds a small JSON endpoint at
   /__review-notes and injects src/scripts/review-overlay.ts into every page.
   `astro build` gets neither, so nothing here ships to production.

   Notes live in review-notes.json at the project root (git-ignored), one
   object per note: { id, page, selector, text, note, width, createdAt }.
   Claude reads that file to work through the feedback. */
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

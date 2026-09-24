/**
 * Remove overlapping exclude rules from dist/_routes.json.
 *
 * The Cloudflare adapter derives that file from the static routes and from
 * public/_redirects, and copies both a splat and the specific paths under it.
 * Pages rejects that outright:
 *
 *   Invalid _routes.json ... Overlapping rules found. Please make sure that
 *   rules ending with a splat (eg. "/api/*") don't overlap any other rules
 *
 * The redirect map is right as it stands — "/case-study-arnlea" has to be
 * listed before "/case-study-*" because it redirects somewhere different, and
 * _redirects is matched in order. So the map keeps its specificity and this
 * drops the entries that a splat in the same file already covers. Both forms
 * mean the same thing to _routes.json, which only asks whether the Worker runs.
 *
 * Runs after `astro build` and before `wrangler pages deploy`; see the deploy
 * script in package.json.
 */
import { readFile, writeFile } from 'node:fs/promises';

const FILE = 'dist/_routes.json';

/** Does a splat rule cover this path? "/work/*" covers "/work/a.avif". */
const coveredBy = (splat, path) => {
  if (!splat.endsWith('/*') && !splat.endsWith('*')) return false;
  if (splat === path) return false;
  const prefix = splat.slice(0, -1); // keep the trailing "/" or the bare stem
  return path.startsWith(prefix);
};

const routes = JSON.parse(await readFile(FILE, 'utf8'));
const splats = routes.exclude.filter((r) => r.endsWith('*'));

const kept = routes.exclude.filter((r) => !splats.some((s) => coveredBy(s, r)));
const dropped = routes.exclude.filter((r) => !kept.includes(r));

if (dropped.length === 0) {
  console.log('_routes.json: no overlapping excludes');
} else {
  routes.exclude = kept;
  await writeFile(FILE, JSON.stringify(routes, null, 2) + '\n', 'utf8');
  console.log(
    `_routes.json: dropped ${dropped.length} exclude rule(s) already covered by a splat —\n  ` +
      dropped.join('\n  ')
  );
}

/* Pages caps _routes.json at 100 rules; worth knowing before it bites. */
const total = routes.include.length + routes.exclude.length;
if (total > 90) console.warn(`_routes.json: ${total} rules, limit is 100`);

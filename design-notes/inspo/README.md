# Reference study — the Edge

Four standalone pages written while working on `edge-concept` in September 2026.
They are design notes, not part of the site: nothing here is imported, built or
deployed. Astro only builds `src/pages`, so this folder is inert.

Open any of them directly in a browser — `index.html` first — or serve the
folder:

```
npx http-server design-notes/inspo -p 4350 -c-1
```

They pull screenshots from the Inspo archive and fonts from Google, so they
need a connection. Everything else is inline.

## The pages

| File | What it is |
|---|---|
| `index.html` | Five ranked moves, each argued from a real site, with what transfers and what does not |
| `motion.html` | The index roll, measured off adcker.com and rebuilt on these tokens. Live demo with ease toggles |
| `menu.html` | What adopting move 01 actually cost — the four changes, with the two service-list options side by side |
| `pages.html` | Moves 3 and 4 at the scale they would ship, with the size and headline toggles used to choose |

## What came of it

All five moves were built. In commit order:

- `8d40a1e` the index becomes the only menu
- `544b463` the index arrives a line at a time
- `5c1acd5` services at index scale, case studies get a plate
- `4278838` the figure becomes the row, inner heroes hang from their corners
- `f37dfe2` homepage figures raised, index scale scoped to the document pages
- `7ada030` three type steps under the display scale, square corners

The choices made against these pages: **soft-out** rather than the reference's
near-expo ease, **variant B** for the services rail, **architectural** (124px)
for the work figures, and **headline full** for the inner heroes.

## Sources

Screenshots are Inspo archive captures of real production sites, credited on
each plate. Where the archive recorded a capture date it is shown. The sites
studied were adcker.com, bymonolog.com, aristidebenoist.com, palaisdetokyo.com
and useorigin.com.

The palette swatches on each plate are measurements of those sites, not
proposals for this one — the thumbnails are desaturated for that reason. Inspo's
own palette suggestion for the brief was Raycast's crimson, which is a
description of Raycast.

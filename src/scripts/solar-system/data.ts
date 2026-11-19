/* Solar System concept: one source for the page copy, the facts panels and
   the 3D scene.

   Every figure in `facts` is copied from the NASA Planetary Fact Sheet
   (https://nssdc.gsfc.nasa.gov/planetary/factsheet/, updated 13 Nov 2026)
   or the Sun Fact Sheet (.../sunfact.html, updated 9 May 2024). Values
   derived from them (days from hours, years from days) are noted inline.
   Nothing here is invented: a body with no fact-sheet row gets no figures.

   Mean longitudes L0 and rates are from JPL's "Approximate Positions of the
   Planets", Table 1 (https://ssd.jpl.nasa.gov/planets/approx_pos.html). The
   scene puts each planet on a circular orbit at that mean longitude, so the
   layout matches the real sky to within a few degrees (Mercury, the most
   eccentric, can be out by about 20). */

export type Fact = { label: string; value: string };

export type BodyTextures = {
  map: string;
  map4k?: string;
  night?: string;
  night4k?: string;
  clouds?: string;
  clouds4k?: string;
  spec?: string;
  ring?: string;
};

export type Body = {
  id: string;
  name: string;
  kind: 'star' | 'planet' | 'belt';
  line: string;
  facts: Fact[];
  /** Fact-sheet inputs for the scene. */
  diameterKm?: number;
  distanceMkm?: number;
  rotationHours?: number;
  obliquityDeg?: number;
  L0?: number;
  Lrate?: number;
  tex?: BodyTextures;
  atmo?: { color: [number, number, number]; rim: number; halo: number };
  bands?: number;
  /** Camera distance in planet radii when the tour frames this body. */
  frame?: number;
};

export const TEX = '/work/web/solar-system/textures/';

/** J2000.0 epoch, 1 Jan 2000 12:00 TT, as a JS timestamp (UTC, close enough). */
export const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

export const BODIES: Body[] = [
  {
    id: 'sun',
    name: 'The Sun',
    kind: 'star',
    line: "Holds 99.8% of the solar system's mass. Every planet ahead shines with the Sun's light, bounced back.",
    facts: [
      { label: 'Diameter', value: '1,391,400 km' }, // 2 × volumetric mean radius 695,700 km
      { label: 'Mass', value: '333,000 Earths' }, // 1,988,400 / 5.97 (10^24 kg)
      { label: 'Rotation', value: '25.4 days' }, // 609.12 h at 16° latitude
      { label: 'Surface', value: '5,772 K' }, // effective temperature
    ],
    rotationHours: 609.12,
    obliquityDeg: 7.25,
    tex: { map: 'sun-2k.webp' },
    frame: 4.6,
  },
  {
    id: 'mercury',
    name: 'Mercury',
    kind: 'planet',
    line: 'The smallest planet and the closest to the Sun. One day here lasts longer than its year.',
    facts: [
      { label: 'Diameter', value: '4,879 km' },
      { label: 'Day', value: '176 Earth days' }, // 4222.6 h
      { label: 'Year', value: '88 days' },
      { label: 'From the Sun', value: '57.9 million km' },
      { label: 'Mean temp.', value: '167 °C' },
      { label: 'Moons', value: '0' },
    ],
    diameterKm: 4879,
    distanceMkm: 57.9,
    rotationHours: 1407.6,
    obliquityDeg: 0.034,
    L0: 252.2503235,
    Lrate: 149472.67411175,
    tex: { map: 'mercury-2k.webp' },
    frame: 5,
  },
  {
    id: 'venus',
    name: 'Venus',
    kind: 'planet',
    line: 'Hotter than Mercury though nearly twice as far out, under cloud that never clears. It spins backwards.',
    facts: [
      { label: 'Diameter', value: '12,104 km' },
      { label: 'Day', value: '117 Earth days' }, // 2802.0 h
      { label: 'Year', value: '224.7 days' },
      { label: 'From the Sun', value: '108.2 million km' },
      { label: 'Mean temp.', value: '464 °C' },
      { label: 'Moons', value: '0' },
    ],
    diameterKm: 12104,
    distanceMkm: 108.2,
    rotationHours: 5832.5,
    obliquityDeg: 177.4,
    L0: 181.9790995,
    Lrate: 58517.81538729,
    tex: { map: 'venus-atmosphere-2k.webp' },
    atmo: { color: [1.0, 0.82, 0.5], rim: 0.9, halo: 0.55 },
    frame: 4.6,
  },
  {
    id: 'earth',
    name: 'Earth',
    kind: 'planet',
    line: 'The only world known to hold life. Its Moon is a little over a quarter of its width.',
    facts: [
      { label: 'Diameter', value: '12,756 km' },
      { label: 'Day', value: '24 hours' },
      { label: 'Year', value: '365.2 days' },
      { label: 'From the Sun', value: '149.6 million km' },
      { label: 'Mean temp.', value: '15 °C' },
      { label: 'Moons', value: '1' },
      { label: 'Moon diameter', value: '3,475 km' },
      { label: 'Moon orbit', value: '27.3 days' },
    ],
    diameterKm: 12756,
    distanceMkm: 149.6,
    rotationHours: 23.9,
    obliquityDeg: 23.4,
    L0: 100.46457166,
    Lrate: 35999.37244981,
    tex: {
      map: 'earth-day-2k.webp',
      map4k: 'earth-day-4k.webp',
      night: 'earth-night-2k.webp',
      night4k: 'earth-night-4k.webp',
      clouds: 'earth-clouds-2k.webp',
      clouds4k: 'earth-clouds-4k.webp',
      spec: 'earth-specular-2k.webp',
    },
    atmo: { color: [0.32, 0.58, 1.0], rim: 1.25, halo: 1.0 },
    frame: 5.6,
  },
  {
    id: 'mars',
    name: 'Mars',
    kind: 'planet',
    line: "About half of Earth's width, with a day only 40 minutes longer than ours.",
    facts: [
      { label: 'Diameter', value: '6,792 km' },
      { label: 'Day', value: '24.7 hours' },
      { label: 'Year', value: '687 days' },
      { label: 'From the Sun', value: '228 million km' },
      { label: 'Mean temp.', value: '−65 °C' },
      { label: 'Moons', value: '2' },
    ],
    diameterKm: 6792,
    distanceMkm: 228.0,
    rotationHours: 24.6,
    obliquityDeg: 25.2,
    L0: -4.55343205,
    Lrate: 19140.30268499,
    tex: { map: 'mars-2k.webp', map4k: 'mars-4k.webp' },
    atmo: { color: [1.0, 0.55, 0.35], rim: 0.35, halo: 0.25 },
    frame: 5,
  },
  {
    id: 'belt',
    name: 'The asteroid belt',
    kind: 'belt',
    line: 'Rock left over from the making of the planets, spread thin in a ring round the Sun.',
    facts: [{ label: 'Where', value: 'Between Mars and Jupiter' }],
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    kind: 'planet',
    line: 'More than twice the mass of every other planet put together, and it turns once in under ten hours.',
    facts: [
      { label: 'Diameter', value: '142,984 km' },
      { label: 'Day', value: '9.9 hours' },
      { label: 'Year', value: '11.9 years' }, // 4,331 days
      { label: 'From the Sun', value: '778.5 million km' },
      { label: 'Mean temp.', value: '−110 °C' },
      { label: 'Moons', value: '95' },
    ],
    diameterKm: 142984,
    distanceMkm: 778.5,
    rotationHours: 9.9,
    obliquityDeg: 3.1,
    L0: 34.39644051,
    Lrate: 3034.74612775,
    tex: { map: 'jupiter-2k.webp', map4k: 'jupiter-4k.webp' },
    atmo: { color: [0.95, 0.82, 0.65], rim: 0.35, halo: 0.25 },
    bands: 1,
    frame: 4.4,
  },
  {
    id: 'saturn',
    name: 'Saturn',
    kind: 'planet',
    line: 'Less dense than water, with 274 known moons and a ring system that dwarfs the planet itself.',
    facts: [
      { label: 'Diameter', value: '120,536 km' },
      { label: 'Day', value: '10.7 hours' },
      { label: 'Year', value: '29.4 years' }, // 10,747 days
      { label: 'From the Sun', value: '1,432 million km' },
      { label: 'Mean temp.', value: '−140 °C' },
      { label: 'Moons', value: '274' },
    ],
    diameterKm: 120536,
    distanceMkm: 1432.0,
    rotationHours: 10.7,
    obliquityDeg: 26.7,
    L0: 49.95424423,
    Lrate: 1222.49362201,
    tex: { map: 'saturn-2k.webp', map4k: 'saturn-4k.webp', ring: 'saturn-ring.webp' },
    atmo: { color: [1.0, 0.88, 0.66], rim: 0.3, halo: 0.2 },
    bands: 0.6,
    frame: 8.2,
  },
  {
    id: 'uranus',
    name: 'Uranus',
    kind: 'planet',
    line: 'Knocked onto its side: the axis tilts 97.8°, so each pole gets about 42 years of daylight, then 42 of night.',
    facts: [
      { label: 'Diameter', value: '51,118 km' },
      { label: 'Day', value: '17.2 hours' },
      { label: 'Year', value: '83.7 years' }, // 30,589 days
      { label: 'From the Sun', value: '2,867 million km' },
      { label: 'Mean temp.', value: '−195 °C' },
      { label: 'Moons', value: '28' },
    ],
    diameterKm: 51118,
    distanceMkm: 2867.0,
    rotationHours: 17.2,
    obliquityDeg: 97.8,
    L0: 313.23810451,
    Lrate: 428.48202785,
    tex: { map: 'uranus-2k.webp' },
    atmo: { color: [0.6, 0.9, 1.0], rim: 0.7, halo: 0.5 },
    frame: 4.8,
  },
  {
    id: 'neptune',
    name: 'Neptune',
    kind: 'planet',
    line: 'The farthest planet, and the slowest: one lap of the Sun takes 163.7 years.',
    facts: [
      { label: 'Diameter', value: '49,528 km' },
      { label: 'Day', value: '16.1 hours' },
      { label: 'Year', value: '163.7 years' }, // 59,800 days
      { label: 'From the Sun', value: '4,515 million km' },
      { label: 'Mean temp.', value: '−200 °C' },
      { label: 'Moons', value: '16' },
    ],
    diameterKm: 49528,
    distanceMkm: 4515.0,
    rotationHours: 16.1,
    obliquityDeg: 28.3,
    L0: -55.12002969,
    Lrate: 218.45945325,
    tex: { map: 'neptune-2k.webp' },
    atmo: { color: [0.38, 0.58, 1.0], rim: 0.7, halo: 0.5 },
    frame: 4.8,
  },
];

/** Moon figures from the same fact sheet. */
export const MOON = {
  diameterKm: 3475,
  periodDays: 27.3,
  inclinationDeg: 5.1,
  tex: { map: 'moon-2k.webp', map4k: 'moon-4k.webp' },
};

/* Compressed scale. True scale would make every planet a sub-pixel dot.
   Radii follow a 0.55 power of diameter and distances a square root of AU,
   which keeps the order and the rough proportions while fitting the whole
   system into one view. */
export const SUN_RADIUS = 5;
export const radiusOf = (diameterKm: number) => 0.5 * Math.pow(diameterKm / 12756, 0.55);
export const orbitOf = (distanceMkm: number) => 8 + 16 * Math.sqrt(distanceMkm / 149.6);
export const BELT = { inner: orbitOf(2.2 * 149.6), outer: orbitOf(3.2 * 149.6), periodDays: 1620 };

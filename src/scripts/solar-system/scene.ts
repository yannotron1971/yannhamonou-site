/* Solar System concept: the 3D scene.

   Lazy-loaded by the page after window load, so the HTML, facts and the
   poster image are on screen before three.js downloads. One WebGL canvas
   sits fixed behind the page. Two modes:

   - tour:    scroll position (tour.f) drives the camera between framings,
              swinging round the Sun rather than cutting through it.
   - explore: page scroll is frozen, OrbitControls take the wheel and the
              pointer, and clicking a body flies the camera to it and then
              follows it along its orbit.

   The subject is pushed off-centre with camera.setViewOffset rather than by
   aiming past it, so OrbitControls always orbit the body itself. */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { gsap } from 'gsap';
import { BODIES, MOON, TEX, J2000_MS, SUN_RADIUS, BELT, radiusOf, orbitOf, type Body } from './data';
import * as G from './shaders';
import { tour } from './tour';

const V3 = THREE.Vector3;
const UP = new V3(0, 1, 0);
const DEG = Math.PI / 180;
const TAU = Math.PI * 2;
const SUN_POWER = 1.3;
const SPEEDS = [0, 1, 10, 100];

type Live = {
  body: Body;
  r: number;
  orbitR: number;
  pivot: THREE.Group;
  tilt: THREE.Group;
  mesh: THREE.Mesh;
  uniforms: Record<string, THREE.IUniform>;
  clouds?: THREE.Mesh;
  cloudUniforms?: Record<string, THREE.IUniform>;
  orbitLine?: THREE.Line;
  hit: THREE.Mesh;
  spin: number;
  upgraded: boolean;
  ringCenter?: THREE.Vector3;
};

const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export function start() {
  const html = document.documentElement;
  const canvas = document.getElementById('ss-canvas') as HTMLCanvasElement;
  const stage = document.getElementById('ss-stage') as HTMLElement;
  const loaderEl = document.getElementById('ss-loader');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4 || matchMedia('(max-width: 760px)').matches;

  /* ── Renderer and post ─────────────────────────────────────── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x030303, 1);
  let pr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 1.75);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 4000);

  /* High-density screens need less MSAA; the samples go where the pixels are fewest. */
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: lowPower ? 0 : pr > 1.2 ? 2 : 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.45, 1.05);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ── Textures ──────────────────────────────────────────────── */
  const manager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader(manager);
  const lateLoader = new THREE.TextureLoader();
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const prep = (t: THREE.Texture, color: boolean) => {
    t.colorSpace = color ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    t.anisotropy = maxAniso;
    /* Sphere maps wrap round in U. The Sun's surface drifts and the gas
       giants' bands sway, both by offsetting U; under the default clamp the
       shifted edge smeared a strip down the seam that widened over time. */
    t.wrapS = THREE.RepeatWrapping;
    return t;
  };
  const load = (file: string, color = true) => prep(loader.load(TEX + file), color);
  const black = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  black.needsUpdate = true;

  manager.onProgress = (_url, loaded, total) => loaderEl?.style.setProperty('--p', String(loaded / total));

  /* ── Shared geometry ───────────────────────────────────────── */
  const seg = lowPower ? 64 : 96;
  const sphere = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.66));
  const sunTime = { value: 0 };

  /* ── Background: Milky Way and stars ───────────────────────── */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1600, 64, 32),
    new THREE.MeshBasicMaterial({ map: load('milky-way-4k.webp'), side: THREE.BackSide, color: new THREE.Color(0.5, 0.5, 0.56), depthWrite: false }),
  );
  sky.rotation.set(60 * DEG, 0, 18 * DEG);
  scene.add(sky);

  const starCount = lowPower ? 2000 : 4200;
  const starPos = new Float32Array(starCount * 3);
  const starSize = new Float32Array(starCount);
  const starTint = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const u = Math.random() * 2 - 1;
    const a = Math.random() * TAU;
    const s = Math.sqrt(1 - u * u);
    starPos.set([1400 * s * Math.cos(a), 1400 * u, 1400 * s * Math.sin(a)], i * 3);
    starSize[i] = 0.8 + Math.pow(Math.random(), 5) * 2.8;
    const b = 0.35 + Math.pow(Math.random(), 2) * 0.9;
    const warm = Math.random();
    starTint.set([b * (0.85 + warm * 0.15), b * 0.92, b * (1.05 - warm * 0.2)], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('size', new THREE.BufferAttribute(starSize, 1));
  starGeo.setAttribute('tint', new THREE.BufferAttribute(starTint, 3));
  const starMat = new THREE.ShaderMaterial({
    vertexShader: G.starVertex,
    fragmentShader: G.starFragment,
    uniforms: { pixelRatio: { value: pr }, time: sunTime },
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
  });
  scene.add(new THREE.Points(starGeo, starMat));

  /* Lights only for the asteroid belt, which uses a standard material. */
  scene.add(new THREE.PointLight(0xfff1e0, 3.2, 0, 0));
  scene.add(new THREE.AmbientLight(0xffffff, 0.05));

  /* ── Bodies ────────────────────────────────────────────────── */
  const lives: Record<string, Live> = {};
  const hitMeshes: THREE.Mesh[] = [];
  const ringTexFile = BODIES.find((b) => b.tex?.ring)?.tex?.ring;
  const ringTex = ringTexFile ? load(ringTexFile) : black;
  /* The ring strip runs inner edge to outer edge; wrapping would blend the two. */
  ringTex.wrapS = THREE.ClampToEdgeWrapping;

  const planetUniforms = (b: { tex?: Body['tex']; atmo?: Body['atmo']; bands?: number }, map: THREE.Texture) => ({
    map: { value: map },
    nightMap: { value: b.tex?.night ? load(b.tex.night) : black },
    specMap: { value: b.tex?.spec ? load(b.tex.spec, false) : black },
    ringMap: { value: b.tex?.ring ? ringTex : black },
    hasNight: { value: b.tex?.night ? 1 : 0 },
    hasSpec: { value: b.tex?.spec ? 1 : 0 },
    hasRing: { value: b.tex?.ring ? 1 : 0 },
    bands: { value: b.bands ?? 0 },
    time: sunTime,
    sunPower: { value: SUN_POWER },
    ambient: { value: 0.012 },
    atmoColor: { value: new THREE.Color(...(b.atmo?.color ?? [0, 0, 0])) },
    atmoRim: { value: b.atmo?.rim ?? 0 },
    ringNormal: { value: new V3(0, 1, 0) },
    planetCenter: { value: new V3() },
    ringInner: { value: 0 },
    ringOuter: { value: 1 },
    highlight: { value: 0 },
  });

  for (const body of BODIES) {
    if (body.kind === 'belt') continue;
    const isSun = body.kind === 'star';
    const r = isSun ? SUN_RADIUS : radiusOf(body.diameterKm!);
    const orbitR = isSun ? 0 : orbitOf(body.distanceMkm!);
    const pivot = new THREE.Group();
    const tilt = new THREE.Group();
    tilt.rotation.z = (body.obliquityDeg ?? 0) * DEG;
    pivot.add(tilt);
    scene.add(pivot);

    let uniforms: Record<string, THREE.IUniform>;
    let material: THREE.ShaderMaterial;
    if (isSun) {
      uniforms = { map: { value: load(body.tex!.map) }, time: sunTime };
      material = new THREE.ShaderMaterial({ vertexShader: G.bodyVertex, fragmentShader: G.sunFragment, uniforms });
    } else {
      uniforms = planetUniforms(body, load(body.tex!.map));
      material = new THREE.ShaderMaterial({ vertexShader: G.bodyVertex, fragmentShader: G.planetFragment, uniforms });
    }
    const mesh = new THREE.Mesh(sphere, material);
    mesh.scale.setScalar(r);
    tilt.add(mesh);

    const hit = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ visible: false }));
    hit.scale.setScalar(Math.max(r * 1.5, 0.9));
    hit.userData.id = body.id;
    pivot.add(hit);
    hitMeshes.push(hit);

    const live: Live = { body, r, orbitR, pivot, tilt, mesh, uniforms, hit, spin: Math.random() * TAU, upgraded: false };

    if (body.atmo) {
      const scale = body.id === 'earth' ? 1.05 : 1.04;
      const halo = new THREE.Mesh(
        sphere,
        new THREE.ShaderMaterial({
          vertexShader: G.bodyVertex,
          fragmentShader: G.haloFragment,
          uniforms: {
            atmoColor: { value: new THREE.Color(...body.atmo.color) },
            strength: { value: body.atmo.halo },
            limb: { value: Math.sqrt(1 - 1 / (scale * scale)) },
          },
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        }),
      );
      halo.scale.setScalar(r * scale);
      pivot.add(halo);
    }

    if (body.tex?.clouds) {
      const cloudUniforms = { map: { value: load(body.tex.clouds, false) }, sunPower: { value: SUN_POWER }, opacity: { value: 0.92 } };
      const clouds = new THREE.Mesh(
        sphere,
        new THREE.ShaderMaterial({
          vertexShader: G.bodyVertex,
          fragmentShader: G.cloudFragment,
          uniforms: cloudUniforms,
          transparent: true,
          depthWrite: false,
        }),
      );
      clouds.scale.setScalar(r * 1.012);
      tilt.add(clouds);
      live.clouds = clouds;
      live.cloudUniforms = cloudUniforms;
    }

    if (body.tex?.ring) {
      const inner = r * 1.24;
      const outer = r * 2.27;
      const ringUniforms = {
        ringMap: { value: ringTex },
        planetCenter: { value: new V3() },
        planetRadius: { value: r },
        ringInner: { value: inner },
        ringOuter: { value: outer },
        ringNormal: { value: new V3(0, 1, 0) },
        sunPower: { value: SUN_POWER },
      };
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(inner, outer, 192, 1),
        new THREE.ShaderMaterial({
          vertexShader: G.ringVertex,
          fragmentShader: G.ringFragment,
          uniforms: ringUniforms,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      tilt.add(ring);
      tilt.updateWorldMatrix(true, false);
      const n = new V3(0, 1, 0).applyQuaternion(tilt.getWorldQuaternion(new THREE.Quaternion()));
      ringUniforms.ringNormal.value.copy(n);
      uniforms.ringNormal.value.copy(n);
      uniforms.ringInner.value = inner;
      uniforms.ringOuter.value = outer;
      live.ringCenter = ringUniforms.planetCenter.value;
    }

    if (!isSun) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 720; i++) {
        const a = (i / 720) * TAU;
        pts.push(new V3(orbitR * Math.cos(a), 0, -orbitR * Math.sin(a)));
      }
      /* The orbit fades out round the planet so the line never crosses
         its disc. */
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(pts),
        new THREE.ShaderMaterial({
          vertexShader: G.orbitVertex,
          fragmentShader: G.orbitFragment,
          uniforms: {
            color: { value: new THREE.Color(0xfafaf7) },
            opacity: { value: 0.12 },
            planetPos: { value: pivot.position },
            fadeR: { value: r * (body.tex?.ring ? 3.2 : 2.4) },
          },
          transparent: true,
          depthWrite: false,
        }),
      );
      scene.add(line);
      live.orbitLine = line;
    }

    lives[body.id] = live;
  }

  /* The Moon rides on an arm round Earth; the arm turning keeps one face
     towards Earth, which is the tidal lock for free. */
  const earth = lives.earth;
  const moonPlane = new THREE.Group();
  moonPlane.rotation.x = MOON.inclinationDeg * DEG;
  const moonArm = new THREE.Group();
  const moonR = radiusOf(MOON.diameterKm);
  const moonUniforms = planetUniforms({}, load(MOON.tex.map));
  const moon = new THREE.Mesh(sphere, new THREE.ShaderMaterial({ vertexShader: G.bodyVertex, fragmentShader: G.planetFragment, uniforms: moonUniforms }));
  moon.scale.setScalar(moonR);
  moon.position.set(earth.r * 2.9, 0, 0);
  moon.rotation.y = Math.PI;
  moonArm.add(moon);
  moonPlane.add(moonArm);
  earth.pivot.add(moonPlane);

  /* Sun corona: a quad that always faces the camera. */
  const corona = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      vertexShader: G.coronaVertex,
      fragmentShader: G.coronaFragment,
      uniforms: { time: sunTime },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
    }),
  );
  corona.scale.setScalar(SUN_RADIUS * 7);
  scene.add(corona);

  /* ── Asteroid belt: one instanced draw ─────────────────────── */
  const beltGroup = new THREE.Group();
  const rockCount = lowPower ? 2500 : 7000;
  const rocks = new THREE.InstancedMesh(
    new THREE.DodecahedronGeometry(1, 0),
    new THREE.MeshStandardMaterial({ color: 0x9a948c, roughness: 0.95, metalness: 0, flatShading: true }),
    rockCount,
  );
  const dummy = new THREE.Object3D();
  for (let i = 0; i < rockCount; i++) {
    const a = Math.random() * TAU;
    const t = (Math.random() + Math.random() + Math.random()) / 3;
    const rr = BELT.inner + (BELT.outer - BELT.inner) * t;
    const s = 0.007 + Math.pow(Math.random(), 4) * 0.06;
    dummy.position.set(rr * Math.cos(a), (Math.random() - 0.5) * 1.1 * (1 - Math.abs(t - 0.5)), -rr * Math.sin(a));
    dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    dummy.scale.set(s * (0.7 + Math.random() * 0.6), s * (0.55 + Math.random() * 0.5), s * (0.7 + Math.random() * 0.6));
    dummy.updateMatrix();
    rocks.setMatrixAt(i, dummy.matrix);
  }
  beltGroup.add(rocks);

  /* Dust: far more points than rocks, faint and additive, so the belt
     reads as a band from a distance and as depth from inside it. */
  const dustCount = lowPower ? 6000 : 16000;
  const dustPos = new Float32Array(dustCount * 3);
  const dustSize = new Float32Array(dustCount);
  const dustTint = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    const a = Math.random() * TAU;
    const t = (Math.random() + Math.random()) / 2;
    const rr = BELT.inner + (BELT.outer - BELT.inner) * t;
    dustPos.set([rr * Math.cos(a), (Math.random() - 0.5) * 0.9, -rr * Math.sin(a)], i * 3);
    dustSize[i] = 0.6 + Math.random() * 1.1;
    const b = 0.12 + Math.random() * 0.22;
    dustTint.set([b, b * 0.93, b * 0.85], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('size', new THREE.BufferAttribute(dustSize, 1));
  dustGeo.setAttribute('tint', new THREE.BufferAttribute(dustTint, 3));
  beltGroup.add(new THREE.Points(dustGeo, starMat));
  scene.add(beltGroup);
  const beltMid = (BELT.inner + BELT.outer) / 2;
  const beltAnchor = new V3();
  let beltAngle = 0;

  /* ── Orbits over time ──────────────────────────────────────── */
  let simDays = (Date.now() - J2000_MS) / 86400000;
  const TOUR_SPEED = reduced ? 0 : 0.4;
  let speed = TOUR_SPEED;
  let lastSpeedChoice = reduced ? 0 : 1;

  const polar = (out: THREE.Vector3, radius: number, angle: number, y = 0) => out.set(radius * Math.cos(angle), y, -radius * Math.sin(angle));
  const angleOf = (b: Body, days: number) => ((b.L0! + (b.Lrate! * days) / 36525) % 360) * DEG;

  function place(days: number) {
    for (const id in lives) {
      const L = lives[id];
      if (L.body.kind !== 'planet') continue;
      polar(L.pivot.position, L.orbitR, angleOf(L.body, days));
    }
    moonArm.rotation.y = (days / MOON.periodDays) * TAU;
    beltGroup.rotation.y = (days / BELT.periodDays) * TAU;
    beltAngle = angleOf(lives.mars.body, days) + 0.75;
    polar(beltAnchor, beltMid, beltAngle);
    const sat = lives.saturn;
    if (sat) {
      sat.uniforms.planetCenter.value.copy(sat.pivot.position);
      sat.ringCenter?.copy(sat.pivot.position);
    }
  }

  const bodyPos = (id: string | null, out: THREE.Vector3) => {
    if (!id || id === 'sun' || id === 'hero' || id === 'wide') return out.set(0, 0, 0);
    if (id === 'belt') return out.copy(beltAnchor);
    return out.copy(lives[id].pivot.position);
  };

  /* ── Framings ──────────────────────────────────────────────── */
  let mobile = false;
  type Frame = { pos: THREE.Vector3; target: THREE.Vector3; sx: number; sy: number };
  const mk = (): Frame => ({ pos: new V3(), target: new V3(), sx: 0, sy: 0 });
  const tA = new V3();
  const tB = new V3();

  /** sx/sy are view offsets as a fraction of the viewport: negative sx puts
      the subject right of centre (tour card on the left); positive sy lifts
      it (cards along the bottom on phones). */
  function frame(key: string, out: Frame, panelSide: 'left' | 'right' | 'none' = 'left') {
    if (key === 'hero') {
      out.pos.set(-36, 11, 41);
      out.target.set(3, -2.5, -4);
      out.sx = mobile ? 0 : -0.2;
      out.sy = mobile ? 0.22 : 0;
      return out;
    }
    if (key === 'wide') {
      out.pos.set(0, mobile ? 190 : 108, mobile ? 230 : 150);
      out.target.set(0, -6, 0);
      out.sx = 0;
      out.sy = mobile ? 0.1 : 0;
      return out;
    }
    if (key === 'belt') {
      polar(out.pos, BELT.inner - 1.4, beltAngle - 0.2, 0.75);
      out.target.copy(beltAnchor);
    } else {
      const L = lives[key];
      const p = L.pivot.position;
      const d = L.r * (L.body.frame ?? 5) * (mobile ? 1.6 : 1);
      const outDir = p.lengthSq() > 1e-6 ? tA.copy(p).normalize() : tA.set(0.62, 0, 0.78);
      const tan = tB.crossVectors(UP, outDir).normalize();
      const dir = new V3().copy(outDir).multiplyScalar(-0.42).addScaledVector(tan, 0.86).addScaledVector(UP, 0.3).normalize();
      out.pos.copy(p).addScaledVector(dir, d);
      out.target.copy(p);
    }
    if (mobile) {
      out.sx = 0;
      out.sy = panelSide === 'none' ? 0 : 0.23;
    } else {
      out.sx = panelSide === 'left' ? -0.17 : panelSide === 'right' ? 0.14 : 0;
      out.sy = 0;
    }
    return out;
  }

  /* Swing between two camera positions round the Sun (cylindrical lerp)
     with a lift in the middle, so no move cuts through the Sun. */
  const cyl = (out: THREE.Vector3, a: THREE.Vector3, b: THREE.Vector3, e: number, lift = 0.14) => {
    const ra = Math.hypot(a.x, a.z);
    const rb = Math.hypot(b.x, b.z);
    const pa = Math.atan2(a.z, a.x);
    let dp = Math.atan2(b.z, b.x) - pa;
    if (dp > Math.PI) dp -= TAU;
    if (dp < -Math.PI) dp += TAU;
    const rr = ra + (rb - ra) * e;
    const pp = pa + dp * e;
    out.set(rr * Math.cos(pp), a.y + (b.y - a.y) * e, rr * Math.sin(pp));
    out.y += Math.sin(Math.PI * e) * a.distanceTo(b) * lift;
    return out;
  };

  /* ── Camera state ──────────────────────────────────────────── */
  let mode: 'tour' | 'explore' = 'tour';
  const fA = mk();
  const fB = mk();
  const want = mk();
  const look = new V3();
  const shift = { x: 0, y: 0 };
  let first = true;

  function tourDesired(out: Frame) {
    const keys = tour.keys;
    const f = Math.min(tour.f, keys.length - 1);
    const i = Math.min(Math.floor(f), keys.length - 2);
    const s = f - i;
    const e = reduced ? (s < 0.5 ? 0 : 1) : smoother(clamp01((s - 0.2) / 0.6));
    frame(keys[i], fA);
    frame(keys[i + 1], fB);
    cyl(out.pos, fA.pos, fB.pos, e);
    out.target.lerpVectors(fA.target, fB.target, e);
    out.sx = fA.sx + (fB.sx - fA.sx) * e;
    out.sy = fA.sy + (fB.sy - fA.sy) * e;
    return out;
  }

  const controls = new OrbitControls(camera, canvas);
  controls.enabled = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.enablePan = false;
  controls.rotateSpeed = 0.55;
  controls.zoomSpeed = 0.8;
  controls.minDistance = 8;
  controls.maxDistance = 420;

  let focusId: string | null = null;
  let flying = false;
  const fly = { t: 1 };
  const flyFrom = mk();
  const lastFocus = new V3();
  let panelOpen = false;

  function flyTo(id: string | null) {
    focusId = id;
    flying = true;
    controls.enabled = false;
    flyFrom.pos.copy(camera.position);
    flyFrom.target.copy(controls.target);
    flyFrom.sx = shift.x;
    flyFrom.sy = shift.y;
    gsap.killTweensOf(fly);
    fly.t = 0;
    if (id) upgrade(id);
    const done = () => {
      flying = false;
      controls.enabled = true;
      const L = id && lives[id];
      controls.minDistance = L ? L.r * 1.7 : id === 'belt' ? 1 : 8;
      bodyPos(id, lastFocus);
    };
    if (reduced) {
      fly.t = 1;
      stepFly();
      done();
      return;
    }
    gsap.to(fly, { t: 1, duration: id ? 1.6 : 1.3, ease: 'power3.inOut', onComplete: done });
  }

  function stepFly() {
    frame(focusId ?? 'wide', want, panelOpen ? 'right' : 'none');
    const e = fly.t;
    cyl(camera.position, flyFrom.pos, want.pos, e, 0.1);
    controls.target.lerpVectors(flyFrom.target, want.target, e);
    shift.x = flyFrom.sx + (want.sx - flyFrom.sx) * e;
    shift.y = flyFrom.sy + (want.sy - flyFrom.sy) * e;
    camera.lookAt(controls.target);
  }

  /* ── Texture upgrades ──────────────────────────────────────── */
  function swap(file: string, u: THREE.IUniform, color = true) {
    lateLoader.load(TEX + file, (t) => {
      prep(t, color);
      const old = u.value as THREE.Texture;
      u.value = t;
      if (old !== black) old.dispose();
    });
  }
  function upgrade(id: string) {
    if (saveData) return;
    const L = lives[id];
    if (!L || L.upgraded) return;
    L.upgraded = true;
    const t = L.body.tex!;
    if (t.map4k) swap(t.map4k, L.uniforms.map);
    if (t.night4k) swap(t.night4k, L.uniforms.nightMap);
    if (t.clouds4k && L.cloudUniforms) swap(t.clouds4k, L.cloudUniforms.map, false);
    if (id === 'earth') swap(MOON.tex.map4k, moonUniforms.map);
  }

  /* ── Highlights ────────────────────────────────────────────── */
  const paper = new THREE.Color(0xfafaf7);
  const signal = new THREE.Color(0xff4f1a);
  let litId: string | null = null;
  let hoverId: string | null = null;
  function setOrbitLit(id: string | null) {
    litId = id;
    for (const k in lives) {
      const line = lives[k].orbitLine;
      if (!line) continue;
      const u = (line.material as THREE.ShaderMaterial).uniforms;
      const on = k === id;
      (u.color.value as THREE.Color).copy(on ? signal : paper);
      u.opacity.value = on ? 0.75 : 0.12;
    }
  }

  tour.onChange((i) => {
    const key = tour.keys[i];
    if (mode === 'tour') setOrbitLit(lives[key] ? key : null);
    if (lives[key]) upgrade(key);
    const next = tour.keys[i + 1];
    if (next && lives[next] && !lowPower) upgrade(next);
    if (reduced && !first) canvas.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 380, easing: 'ease-out' });
  });

  /* ── Labels (explore) ──────────────────────────────────────── */
  const labelWrap = document.getElementById('ss-labels');
  const labelIds = ['sun', 'mercury', 'venus', 'earth', 'mars', 'belt', 'jupiter', 'saturn', 'uranus', 'neptune'];
  const labels = new Map<string, HTMLButtonElement>();
  for (const id of labelIds) {
    const b = BODIES.find((x) => x.id === id)!;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'ss-label';
    btn.textContent = b.name.replace(/^The /, '');
    btn.setAttribute('aria-label', `Fly to ${b.name}`);
    btn.addEventListener('click', () => focusBody(id));
    btn.addEventListener('pointerenter', () => (hoverId = id));
    btn.addEventListener('pointerleave', () => (hoverId = null));
    labelWrap?.append(btn);
    labels.set(id, btn);
  }
  const proj = new V3();
  /* From the wide view the inner planets sit a few pixels apart, so labels
     are placed in priority order and a label that would land on one already
     placed steps upwards until it is clear. Labels stay inside the screen. */
  const LABEL_ORDER = ['sun', 'earth', 'jupiter', 'saturn', 'mars', 'venus', 'mercury', 'uranus', 'neptune', 'belt'];
  const labelSize = new Map<string, { w: number; h: number }>();
  const placed: number[][] = [];
  const clash = (x0: number, y0: number, x1: number, y1: number) =>
    placed.some((p) => x0 < p[2] + 4 && x1 > p[0] - 4 && y0 < p[3] + 2 && y1 > p[1] - 2);
  function updateLabels(w: number, h: number) {
    placed.length = 0;
    const order = [focusId, hoverId, ...LABEL_ORDER].filter((v, i, a): v is string => !!v && a.indexOf(v) === i);
    for (const id of order) {
      const btn = labels.get(id);
      if (!btn) continue;
      bodyPos(id, proj);
      const r = id === 'sun' ? SUN_RADIUS : id === 'belt' ? 0 : lives[id].r;
      proj.y += r * 1.15 + 0.15;
      proj.project(camera);
      const onScreen = proj.z < 1 && Math.abs(proj.x) < 1.1 && Math.abs(proj.y) < 1.1;
      if (!onScreen) {
        btn.hidden = true;
        continue;
      }
      btn.hidden = false;
      let s = labelSize.get(id);
      if (!s) {
        s = { w: btn.offsetWidth, h: btn.offsetHeight };
        if (s.w) labelSize.set(id, s);
      }
      const x = Math.min(Math.max((proj.x * 0.5 + 0.5) * w, s.w / 2 + 8), w - s.w / 2 - 8);
      let y = (-proj.y * 0.5 + 0.5) * h;
      let tries = 0;
      while (clash(x - s.w / 2, y - s.h, x + s.w / 2, y) && tries < 4) {
        y -= s.h + 2;
        tries++;
      }
      if (y - s.h < 4 || clash(x - s.w / 2, y - s.h, x + s.w / 2, y)) {
        btn.hidden = true;
        continue;
      }
      placed.push([x - s.w / 2, y - s.h, x + s.w / 2, y]);
      btn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -100%)`;
      btn.classList.toggle('is-current', id === focusId);
      btn.classList.toggle('is-hover', id === hoverId);
    }
  }

  /* ── Explore panel ─────────────────────────────────────────── */
  const panel = document.getElementById('ss-panel');
  const panelBody = document.getElementById('ss-panel-body');
  function openPanel(id: string) {
    const card = document.querySelector(`[data-frame="${id}"] .ss-card`);
    if (!panel || !panelBody || !card) return;
    panelBody.replaceChildren(...Array.from(card.childNodes, (n) => n.cloneNode(true)));
    panelBody.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
    panel.hidden = false;
    panelOpen = true;
  }
  function closePanel() {
    if (panel) panel.hidden = true;
    panelOpen = false;
  }
  function focusBody(id: string) {
    openPanel(id);
    flyTo(id);
  }
  document.getElementById('ss-panel-close')?.addEventListener('click', () => {
    closePanel();
    flyTo(null);
  });

  /* ── Mode switches ─────────────────────────────────────────── */
  const dateEl = document.getElementById('ss-date');
  const speedBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-speed]'));
  function setSpeed(i: number) {
    speed = SPEEDS[i];
    if (mode === 'explore') lastSpeedChoice = i;
    speedBtns.forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.speed) === i)));
  }
  speedBtns.forEach((b) => b.addEventListener('click', () => setSpeed(Number(b.dataset.speed))));

  function enterExplore() {
    if (mode === 'explore') return;
    mode = 'explore';
    /* The tour lets time drift; the explorer starts from today's sky. */
    simDays = (Date.now() - J2000_MS) / 86400000;
    tour.setLocked(true);
    html.classList.add('ss-exploring');
    html.style.overflow = 'hidden';
    setSpeed(lastSpeedChoice);
    controls.target.copy(look);
    setOrbitLit(null);
    flyTo(null);
    requestAnimationFrame(() => document.getElementById('ss-back')?.focus());
  }
  function exitExplore() {
    if (mode === 'tour') return;
    closePanel();
    gsap.killTweensOf(fly);
    flying = false;
    focusId = null;
    controls.enabled = false;
    mode = 'tour';
    html.classList.remove('ss-exploring');
    html.style.overflow = '';
    look.copy(controls.target);
    speed = TOUR_SPEED;
    tour.setLocked(false);
    tour.goto(tour.count - 2);
    requestAnimationFrame(() => document.getElementById('ss-explore')?.focus());
  }
  document.getElementById('ss-explore')?.addEventListener('click', enterExplore);
  document.getElementById('ss-back')?.addEventListener('click', exitExplore);
  window.addEventListener('keydown', (e) => {
    if (mode !== 'explore' || e.key !== 'Escape') return;
    if (panelOpen || focusId) {
      closePanel();
      flyTo(null);
    } else exitExplore();
  });

  /* ── Pointer: hover and click to fly ───────────────────────── */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downAt: { x: number; y: number } | null = null;
  const pick = (ev: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    ndc.set(((ev.clientX - rect.left) / rect.width) * 2 - 1, -((ev.clientY - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(hitMeshes, false)[0];
    return (hit?.object.userData.id as string | undefined) ?? null;
  };
  canvas.addEventListener('pointermove', (ev) => {
    if (mode !== 'explore' || ev.pointerType === 'touch') return;
    hoverId = pick(ev);
    canvas.style.cursor = hoverId ? 'pointer' : 'grab';
  });
  canvas.addEventListener('pointerdown', (ev) => (downAt = { x: ev.clientX, y: ev.clientY }));
  canvas.addEventListener('pointerup', (ev) => {
    if (mode !== 'explore' || !downAt) return;
    const moved = Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y);
    downAt = null;
    if (moved > 6) return;
    const id = pick(ev);
    if (id && id !== focusId) focusBody(id);
  });

  /* ── Size and quality ──────────────────────────────────────── */
  let W = 1;
  let H = 1;
  function resize() {
    W = stage.clientWidth || window.innerWidth;
    H = stage.clientHeight || window.innerHeight;
    mobile = W < 760;
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    composer.setPixelRatio(pr);
    composer.setSize(W, H);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    starMat.uniforms.pixelRatio.value = pr;
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  /* Drop the render resolution a step at a time when frames run long.
     It never climbs back, so it cannot oscillate. */
  let slowFrames = 0;
  function adapt(dt: number) {
    if (pr <= 1) return;
    slowFrames = dt > 1 / 52 ? slowFrames + 1 : Math.max(0, slowFrames - 1);
    if (slowFrames > 45) {
      pr = Math.max(1, pr - 0.25);
      slowFrames = 0;
      resize();
    }
  }

  /* ── Loop ──────────────────────────────────────────────────── */
  const timer = new THREE.Timer();
  let dateTick = 0;
  const tmp = new V3();

  function loop(now: number) {
    timer.update(now);
    const dt = Math.min(timer.getDelta(), 0.05);
    adapt(dt);
    simDays += dt * speed;
    if (!reduced) sunTime.value += dt;
    place(simDays);

    const spinOn = speed > 0 ? 1 : 0;
    for (const id in lives) {
      const L = lives[id];
      const hours = Math.abs(L.body.rotationHours ?? 24);
      L.spin += dt * spinOn * TAU * (24 / hours) * 0.05;
      L.mesh.rotation.y = L.spin;
      if (L.clouds) L.clouds.rotation.y = L.spin * 1.04 + sunTime.value * 0.003;
      const target = mode === 'explore' && id === hoverId ? 1 : 0;
      const hu = L.uniforms.highlight;
      if (hu) hu.value += (target - hu.value) * Math.min(1, dt * 8);
    }
    if (mode === 'explore') setOrbitLit(hoverId ?? focusId);

    corona.quaternion.copy(camera.quaternion);

    if (mode === 'tour') {
      tourDesired(want);
      const k = first || reduced ? 1 : 1 - Math.exp(-dt * 5);
      camera.position.lerp(want.pos, k);
      look.lerp(want.target, k);
      shift.x += (want.sx - shift.x) * k;
      shift.y += (want.sy - shift.y) * k;
      camera.lookAt(look);
    } else if (flying) {
      stepFly();
    } else {
      if (focusId) {
        bodyPos(focusId, tmp);
        const delta = tmp.clone().sub(lastFocus);
        camera.position.add(delta);
        controls.target.add(delta);
        lastFocus.copy(tmp);
      }
      frame(focusId ?? 'wide', want, panelOpen ? 'right' : 'none');
      const k = 1 - Math.exp(-dt * 6);
      shift.x += (want.sx - shift.x) * k;
      shift.y += (want.sy - shift.y) * k;
      controls.update();
    }
    first = false;

    camera.setViewOffset(W, H, shift.x * W, shift.y * H, W, H);
    if (mode === 'explore') updateLabels(W, H);

    dateTick += dt;
    if (dateEl && dateTick > 0.25) {
      dateTick = 0;
      dateEl.textContent = new Date(J2000_MS + simDays * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    composer.render();
  }

  let running = false;
  const run = (on: boolean) => {
    if (on === running) return;
    running = on;
    if (on) timer.update();
    renderer.setAnimationLoop(on ? loop : null);
  };
  document.addEventListener('visibilitychange', () => run(!document.hidden && html.classList.contains('ss-ready')));

  let started = false;
  const begin = () => {
    if (started) return;
    started = true;
    html.classList.add('ss-ready');
    run(!document.hidden);
  };
  manager.onLoad = begin;
  manager.onError = (url) => console.warn('[solar-system] texture failed', url);
  setTimeout(begin, 9000);

  window.addEventListener('pagehide', () => {
    run(false);
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) {
        for (const v of Object.values((mat as THREE.ShaderMaterial).uniforms ?? {})) (v.value as THREE.Texture)?.isTexture && v.value.dispose();
        (mat as THREE.MeshBasicMaterial).map?.dispose();
        mat.dispose();
      }
    });
    composer.dispose();
    controls.dispose();
    renderer.dispose();
  });

  return { scene, camera };
}

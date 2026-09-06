/**
 * The Edge field — a full-bleed ambient background, raw WebGL2, no dependency.
 *
 * Three.js would be ~150KB gzipped to draw one quad, so this is hand-rolled:
 * a full-screen triangle, one fragment shader.
 *
 * Unlike the shelved parchment version this runs on a single near-black ground,
 * which is the whole reason it reads: a pale mist tint against #151515 gives
 * ~0.7 luminance separation, where the same alpha over parchment gave ~0.1 and
 * disappeared. One ground, no season sampling, no copy mask — it sits under
 * everything at z-index -1.
 */

const VERT = `#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;

out vec4 outColor;

uniform vec2  u_res;
uniform float u_time;
uniform vec2  u_mouse;   // pixels, y up
uniform float u_wake;    // 0..1, decaying pointer energy
uniform float u_scroll;  // 0..1 down the document
uniform vec3  u_ground;  // the near-black ground the field paints onto
uniform vec3  u_mist;    // pale swell colour
uniform vec3  u_deep;    // cold trough colour
uniform float u_amp;     // master amplitude — 0 disables all motion
uniform float u_intensity; // see INTENSITY below — the one dial worth turning

/* ── Ashima simplex noise (McEwan/Gustavson), unmodified ── */
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm3(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { s += a * snoise(p); p *= 2.03; a *= 0.5; }
  return s;
}

float fbm4(vec3 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * snoise(p); p *= 2.01; a *= 0.5; }
  return s;
}

/* Cheap per-pixel dither — paper tooth, and it kills the banding that shallow
   gradients like these would otherwise show on 8-bit displays. */
float grain(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - 0.5 * u_res) / u_res.y;

  float t = u_time * 0.028 * u_amp;

  /* Scroll leans the whole field over, like weather turning onshore. */
  float ang = u_scroll * 0.5;
  float ca = cos(ang), sa = sin(ang);
  p = mat2(ca, -sa, sa, ca) * p;

  /* Pointer wake — a slow swell, not a ripple-tank splash. */
  vec2 m = (u_mouse - 0.5 * u_res) / u_res.y;
  float md = length(p - m);
  float wake = exp(-md * 2.6) * sin(md * 9.0 - u_time * 1.1) * u_wake * u_amp;

  /* One level of domain warp is enough at this amplitude, and it halves the
     noise cost against the usual two-level warp. */
  vec3 q3 = vec3(p * 1.15, t);
  vec2 q = vec2(
    fbm3(q3),
    fbm3(q3 + vec3(4.3, 1.7, 0.0))
  );

  vec3 f3 = vec3(p * 1.6 + 0.85 * q + vec2(wake * 0.35), t * 1.3 + wake * 0.2);
  float f = fbm4(f3);

  /* Tree rings: concentric interference, warped by the same field so they read
     as growth rings rather than as a bullseye. */
  float rd = length(p * vec2(1.0, 1.35) + 0.28 * q);
  float rings = sin(rd * 19.0 - t * 2.4 + f * 3.2);
  rings = smoothstep(0.55, 1.0, rings * 0.5 + 0.5);

  float v = f * 0.5 + 0.5;

  /* Two colours only: a cold trough and a pale swell. Against #151515 the
     separation is ~0.7, so modest alpha still reads clearly — the opposite of
     the parchment problem. */
  vec3 tint = mix(u_deep, u_mist, smoothstep(0.30, 0.92, v));
  tint = mix(tint, u_mist, rings * 0.30);

  /* Scroll cools the field as you descend — the sea getting deeper. */
  tint = mix(tint, u_deep, u_scroll * 0.35);

  float a = smoothstep(0.26, 0.98, v) * 0.30
          + rings * 0.06
          + abs(wake) * 0.14;

  /* Ease off at the very top so the nav bar stays clean. */
  float vh = frag.y / u_res.y;
  a *= smoothstep(1.04, 0.80, vh);

  a += (grain(frag) - 0.5) * 0.030;
  a = clamp(a, 0.0, 0.42) * u_intensity;

  /* Opaque: this canvas paints the ground itself rather than compositing over
     it, so fading the element out reveals the white page beneath. */
  outColor = vec4(u_ground + (tint - u_ground) * a, 1.0);
}
`;

/**
 * The one dial worth turning. 1 is the tuned default — a quiet paper texture.
 * Drop to 0.5 for barely-there, push to 2 for obvious weather. Below about
 * 0.3 it falls under the threshold where you can see it at all on the light
 * seasons, which is not the same thing as being tasteful.
 */
const INTENSITY = 1.0;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error('[oak-weather] shader compile failed:', gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

/** '#131917' or 'rgb(19, 25, 23)' -> [r, g, b] in 0..1 */
function parseColor(str) {
  const s = (str || '').trim();
  if (s.startsWith('#')) {
    const h = s.length === 4
      ? s[1] + s[1] + s[2] + s[2] + s[3] + s[3]
      : s.slice(1, 7);
    const n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const m = s.match(/-?[\d.]+/g);
  if (m && m.length >= 3) return [+m[0] / 255, +m[1] / 255, +m[2] / 255];
  return [0.5, 0.5, 0.5];
}

export function initEdgeField() {
  const canvas = document.querySelector('.edge-field');
  if (!canvas) return;

  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    premultipliedAlpha: true,
  });
  /* No WebGL2, or a blocked context, leaves the flat ground — which is fine,
     but say so. Chrome disables GPU access process-wide after repeated crashes
     and every canvas on the page then fails here; silence made that look
     identical to a shader that simply never drew. */
  if (!gl) {
    console.warn('[edge-field] no WebGL2 context — falling back to the flat ground.');
    canvas.remove();
    return;
  }

  const U = {};

  /* Everything the context owns, in one place. A lost context takes the
     program, the VAO, the buffer and every uniform location with it, so
     coming back means running all of this again. */
  function build() {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.bindAttribLocation(prog, 0, 'a_pos');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('[oak-weather] link failed:', gl.getProgramInfoLog(prog));
      return false;
    }
    gl.useProgram(prog);

    // One oversized triangle beats a quad: no diagonal seam, one less vertex.
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    /* Uniform locations belong to the program, so they go stale with it. */
    for (const n of ['u_res', 'u_time', 'u_mouse', 'u_wake', 'u_scroll',
                     'u_ground', 'u_mist', 'u_deep', 'u_amp', 'u_intensity']) {
      U[n] = gl.getUniformLocation(prog, n);
    }
    return true;
  }

  if (!build()) {
    console.warn('[edge-field] setup failed — falling back to the flat ground.');
    canvas.remove();
    return;
  }

  // Opaque output — nothing to blend against.

  /* Fixed palette — one ground, so nothing to sample or cross-fade. */
  const GROUND = [0.082, 0.082, 0.082]; // #151515
  const MIST = [0.62, 0.68, 0.71];      // cold pale grey-blue, the swell
  const DEEP = [0.10, 0.13, 0.15];      // barely above the ground, the trough

  /* ── Sizing. DPR is capped: this layer is nearly invisible, so shading it at
     3x on a phone is pure heat for no visible gain. ── */
  let w = 1, h = 1;
  const PIXEL_BUDGET = 3.2e6; // ~1440p worth of fragments, whatever the display
  function resize() {
    const cap = window.innerWidth < 1025 ? 1.5 : 2;
    let dpr = Math.min(window.devicePixelRatio || 1, cap);
    const cw = Math.max(1, window.innerWidth);
    const ch = Math.max(1, window.innerHeight);
    /* A large display would otherwise ask for 7M+ fragments a frame. This
       layer is a texture, not a subject — resolution buys it nothing. */
    const over = (cw * ch * dpr * dpr) / PIXEL_BUDGET;
    if (over > 1) dpr /= Math.sqrt(over);
    const nw = Math.max(1, Math.round(cw * dpr));
    const nh = Math.max(1, Math.round(ch * dpr));
    if (nw === w && nh === h) return;
    w = nw; h = nh;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Pointer ── */
  let mx = w * 0.72, my = h * 0.55, tmx = mx, tmy = my, wake = 0;
  window.addEventListener('pointermove', (e) => {
    tmx = (e.clientX / window.innerWidth) * w;
    tmy = (1 - e.clientY / window.innerHeight) * h;
    wake = Math.min(1, wake + 0.14);
  }, { passive: true });

  /* ── The hero hands over to the white sheet. The canvas fades out across the
     first viewport, and the nav flips to its light state at the same point, so
     a dark bar never sits on white content. ── */
  const body = document.body;
  let fadeTick = 0;
  function updateHandover() {
    fadeTick = 0;
    const vh = Math.max(1, window.innerHeight);
    const p = Math.min(1, window.scrollY / vh);
    // Hold, then fall away — the sheet is most of the way up before the ground
    // starts going, so you never catch pale hero text on white.
    const o = 1 - Math.pow(Math.min(1, p / 0.92), 2.2);
    canvas.style.opacity = String(Math.max(0, o));
    body.classList.toggle('sheet-active', p > 0.62);
  }
  function onScroll() {
    if (!fadeTick) fadeTick = requestAnimationFrame(updateHandover);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateHandover();

  /* ── Motion contract: matches oak-motion.js. Reduced motion gets a single
     static frame — the paper tooth, none of the weather. ── */
  const motionOK = window.matchMedia('(prefers-reduced-motion: no-preference)');

  let running = false;
  let raf = 0;
  let t0 = performance.now();

  function draw(nowMs) {
    const time = (nowMs - t0) / 1000;

    mx += (tmx - mx) * 0.06;
    my += (tmy - my) * 0.06;
    wake *= 0.965;

    /* Document scroll progress, read inside the frame we are already
       rendering rather than from a separate scroll listener. */
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const scroll = Math.min(1, Math.max(0, window.scrollY / max));

    gl.uniform2f(U.u_res, w, h);
    gl.uniform1f(U.u_time, time);
    gl.uniform2f(U.u_mouse, mx, my);
    gl.uniform1f(U.u_wake, wake);
    gl.uniform1f(U.u_scroll, scroll);
    gl.uniform3f(U.u_ground, GROUND[0], GROUND[1], GROUND[2]);
    gl.uniform3f(U.u_mist, MIST[0], MIST[1], MIST[2]);
    gl.uniform3f(U.u_deep, DEEP[0], DEEP[1], DEEP[2]);
    gl.uniform1f(U.u_amp, motionOK.matches ? 1 : 0);
    gl.uniform1f(U.u_intensity, INTENSITY);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    if (running) raf = requestAnimationFrame(draw);
  }

  function start() {
    if (running || !motionOK.matches) return;
    running = true;
    t0 = performance.now() - 1000; // skip the dead-flat first second
    raf = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  /* ── Context loss. The browser can take the context back at any time — a GPU
     reset, a laptop switching between its two GPUs, the compositor reclaiming
     memory. Two things matter here: preventDefault, without which the browser
     never offers the context back, and stopping the loop, which would
     otherwise keep issuing calls into a dead context for the life of the
     page, silently. ── */
  let rebuilt = false;
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
  });
  canvas.addEventListener('webglcontextrestored', () => {
    /* One attempt. Losing it again straight after a rebuild means something
       the rebuild cannot fix, and the flat ground is a fine outcome. */
    if (rebuilt || !build()) {
      console.warn('[edge-field] context lost again after a rebuild — giving up on the field.');
      canvas.remove();
      return;
    }
    rebuilt = true;
    /* canvas.width/height are DOM attributes and survive the loss, so resize()
       would see no change and skip the viewport the new context needs. */
    w = h = 1;
    resize();
    t0 = performance.now() - 1000; // otherwise the first frame jumps by the outage
    if (motionOK.matches && !document.hidden) start();
    else draw(performance.now());
  });

  // Static frame first, so there is texture even if motion never starts.
  draw(performance.now());

  if (motionOK.matches) {
    start();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });
  }

  motionOK.addEventListener('change', () => {
    if (motionOK.matches) {
      start();
    } else {
      stop();
      draw(performance.now());
    }
  });
}

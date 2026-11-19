/* GLSL for the Solar System concept. Everything is lit by one point: the Sun
   at the origin, so every shader takes L = normalize(-worldPos) and no
   three.js lights are needed for the bodies. Output is linear HDR; the
   composer's OutputPass applies tone mapping and the sRGB transfer once. */

export const bodyVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  varying vec3 vObjPos;
  void main() {
    vUv = uv;
    vObjPos = position;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

/* Planets and the Moon. Soft terminator, ocean glint, city lights on the
   night side, an atmospheric rim, band drift for the gas giants and the
   shadow Saturn's rings throw across the globe. */
export const planetFragment = /* glsl */ `
  uniform sampler2D map;
  uniform sampler2D nightMap;
  uniform sampler2D specMap;
  uniform sampler2D ringMap;
  uniform float hasNight;
  uniform float hasSpec;
  uniform float hasRing;
  uniform float bands;
  uniform float time;
  uniform float sunPower;
  uniform float ambient;
  uniform vec3 atmoColor;
  uniform float atmoRim;
  uniform vec3 ringNormal;
  uniform vec3 planetCenter;
  uniform float ringInner;
  uniform float ringOuter;
  uniform float highlight;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormalW;

  void main() {
    vec2 uv = vUv;
    if (bands > 0.0) {
      uv.x += bands * 0.0022 * sin(uv.y * 46.0 + time * 0.35);
      uv.x += bands * 0.0012 * sin(uv.y * 131.0 - time * 0.22);
    }
    vec3 albedo = texture2D(map, uv).rgb;

    vec3 N = normalize(vNormalW);
    vec3 L = normalize(-vWorldPos);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float ndl = dot(N, L);
    float diff = clamp(ndl * 0.96 + 0.04, 0.0, 1.0) * smoothstep(-0.1, 0.06, ndl);

    float shadow = 1.0;
    if (hasRing > 0.5) {
      float denom = dot(L, ringNormal);
      if (abs(denom) > 1e-4) {
        float t = dot(planetCenter - vWorldPos, ringNormal) / denom;
        if (t > 0.0) {
          vec3 hit = vWorldPos + L * t;
          float u = (length(hit - planetCenter) - ringInner) / (ringOuter - ringInner);
          if (u > 0.0 && u < 1.0) shadow = 1.0 - texture2D(ringMap, vec2(u, 0.5)).a * 0.85;
        }
      }
    }

    vec3 col = albedo * diff * shadow * sunPower + albedo * ambient;

    if (hasSpec > 0.5) {
      float ocean = texture2D(specMap, vUv).r;
      vec3 H = normalize(L + V);
      float glint = pow(max(dot(N, H), 0.0), 70.0) * 1.4 + pow(max(dot(N, H), 0.0), 12.0) * 0.08;
      col += vec3(1.0, 0.93, 0.82) * ocean * glint * smoothstep(0.0, 0.2, ndl) * shadow;
    }
    if (hasNight > 0.5) {
      vec3 lights = texture2D(nightMap, vUv).rgb;
      col += lights * vec3(1.0, 0.82, 0.55) * smoothstep(0.1, -0.22, ndl) * 2.2;
    }

    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col += atmoColor * fres * atmoRim * smoothstep(-0.3, 0.55, ndl);
    col += vec3(1.0, 0.31, 0.1) * fres * highlight * 0.6;

    gl_FragColor = vec4(col, 1.0);
  }
`;

/* Earth's cloud deck, a slightly larger sphere drawn over the surface. */
export const cloudFragment = /* glsl */ `
  uniform sampler2D map;
  uniform float sunPower;
  uniform float opacity;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  void main() {
    float a = texture2D(map, vUv).r;
    vec3 N = normalize(vNormalW);
    vec3 L = normalize(-vWorldPos);
    float ndl = dot(N, L);
    float diff = clamp(ndl, 0.0, 1.0) * smoothstep(-0.1, 0.08, ndl);
    gl_FragColor = vec4(vec3(diff * sunPower * 0.95 + 0.004), a * opacity);
  }
`;

/* Atmospheric halo: a back-faced shell, brightest just outside the limb and
   fading to nothing at its own edge, only on the side facing the Sun. */
export const haloFragment = /* glsl */ `
  uniform vec3 atmoColor;
  uniform float strength;
  uniform float limb;
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 L = normalize(-vWorldPos);
    float x = clamp(-dot(N, V), 0.0, 1.0);
    float i = pow(smoothstep(0.0, limb, x), 2.2);
    float lit = smoothstep(-0.4, 0.5, dot(N, L));
    gl_FragColor = vec4(atmoColor * i * lit * strength, 1.0);
  }
`;

/* The Sun: the photosphere map, slow churning noise, limb darkening and
   enough HDR headroom for the bloom pass to pick it up. */
export const sunFragment = /* glsl */ `
  uniform sampler2D map;
  uniform float time;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  varying vec3 vNormalW;
  varying vec3 vObjPos;

  float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float noise(vec3 x) {
    vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float v = 0.0; float a = 0.5; for (int k = 0; k < 4; k++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

  void main() {
    vec3 N = normalize(vNormalW);
    vec3 V = normalize(cameraPosition - vWorldPos);
    float mu = clamp(dot(N, V), 0.0, 1.0);
    vec3 p = normalize(vObjPos) * 3.0;
    float n = fbm(p * 2.2 + vec3(0.0, time * 0.04, time * 0.03));
    float cells = fbm(p * 9.0 - vec3(time * 0.08));
    vec3 base = texture2D(map, vUv + vec2(time * 0.0015, 0.0)).rgb;
    vec3 col = base * (0.72 + 0.55 * n) * (0.85 + 0.3 * cells);
    float limbDark = 0.3 + 0.7 * pow(mu, 0.5);
    col *= limbDark * vec3(2.3, 1.42, 0.78);
    col += vec3(1.4, 0.45, 0.08) * pow(1.0 - mu, 3.0) * 0.6;
    /* Clamp per channel so the brightest granules stay orange, not white. */
    col = min(col, vec3(2.1, 1.2, 0.55));
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* Corona: a camera-facing quad behind the Sun with a soft radial falloff. */
export const coronaVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
export const coronaFragment = /* glsl */ `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv - 0.5;
    float d = length(c) * 2.0;
    float a = atan(c.y, c.x);
    float rays = 0.85 + 0.15 * sin(a * 9.0 + time * 0.15) * sin(a * 5.0 - time * 0.1);
    float glow = pow(max(1.0 - d, 0.0), 3.2) * 0.55 * rays + exp(-d * 10.0) * 0.35;
    gl_FragColor = vec4(vec3(1.0, 0.5, 0.18) * glow, 1.0);
  }
`;

/* Saturn's rings: colour and alpha from the strip texture, lit by how
   squarely the Sun hits the ring plane, brighter when backlit, and
   darkened inside the planet's shadow. */
export const ringVertex = /* glsl */ `
  varying vec2 vLocal;
  varying vec3 vWorldPos;
  void main() {
    vLocal = position.xy;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
export const ringFragment = /* glsl */ `
  uniform sampler2D ringMap;
  uniform vec3 planetCenter;
  uniform float planetRadius;
  uniform float ringInner;
  uniform float ringOuter;
  uniform vec3 ringNormal;
  uniform float sunPower;
  varying vec2 vLocal;
  varying vec3 vWorldPos;
  void main() {
    float u = (length(vLocal) - ringInner) / (ringOuter - ringInner);
    if (u < 0.0 || u > 1.0) discard;
    vec4 t = texture2D(ringMap, vec2(u, 0.5));
    vec3 L = normalize(-vWorldPos);
    vec3 V = normalize(cameraPosition - vWorldPos);
    vec3 oc = planetCenter - vWorldPos;
    float b = dot(oc, L);
    float d2 = dot(oc, oc) - b * b;
    float r2 = planetRadius * planetRadius;
    float sh = b > 0.0 ? smoothstep(r2 * 0.88, r2 * 1.02, d2) : 1.0;
    float lit = 0.3 + 0.7 * pow(abs(dot(ringNormal, L)), 0.6);
    float back = pow(max(dot(-V, L), 0.0), 8.0) * 0.8;
    vec3 col = t.rgb * (lit + back) * sh * sunPower * 0.95;
    gl_FragColor = vec4(col, t.a * 0.96);
  }
`;

/* Background stars: round points, a little colour, a slow twinkle. */
export const starVertex = /* glsl */ `
  attribute float size;
  attribute vec3 tint;
  uniform float pixelRatio;
  uniform float time;
  varying vec3 vTint;
  varying float vTw;
  void main() {
    vTint = tint;
    vTw = 0.75 + 0.25 * sin(time * (0.6 + size) + position.x * 0.07);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * pixelRatio;
    gl_Position = projectionMatrix * mv;
  }
`;
export const starFragment = /* glsl */ `
  varying vec3 vTint;
  varying float vTw;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vTint * a * vTw, 1.0);
  }
`;

/* Orbit lines: a hairline that fades to nothing near its own planet. */
export const orbitVertex = /* glsl */ `
  uniform vec3 planetPos;
  uniform float fadeR;
  varying float vFade;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vFade = smoothstep(fadeR * 0.7, fadeR * 1.6, distance(wp.xyz, planetPos));
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
export const orbitFragment = /* glsl */ `
  uniform vec3 color;
  uniform float opacity;
  varying float vFade;
  void main() { gl_FragColor = vec4(color, opacity * vFade); }
`;

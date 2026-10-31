/* Hero: tens of thousands of particles flowing between abstract forms (planet, knot, wave, galaxy) and the nestudio mark.
   The cursor blows them aside like wind; a click scatters the form into the next one. */
import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
const hero = canvas.closest('.hero');
const nameEl = document.getElementById('scene-name');
const barEl = document.getElementById('scene-bar');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = matchMedia('(pointer: coarse)').matches;
const narrow = () => innerWidth < 720;

const N = coarse || narrow() ? 24000 : 70000;
const TAU = Math.PI * 2;
// flat forms face the viewer when assembled; volumetric ones keep turning
const SCENES = [
  { id: 'planet', make: planet, aspect: 1, flat: false },
  { id: 'knot', make: knot, aspect: 1, flat: false },
  { id: 'wave', make: wave, aspect: 1.5, flat: false },
  { id: 'galaxy', make: galaxy, aspect: 1.2, flat: false },
  { id: 'logo', make: logo, aspect: 703 / 740, flat: true }
];
const T = { assemble: 3.4, hold: 5.2 };

function fail() { hero.classList.add('no-gl'); canvas.style.display = 'none'; barEl.parentElement.style.display = 'none'; }

let renderer;
try {
  if (reduce) throw new Error('reduced motion');
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
} catch (e) { fail(); }

async function start() {
  renderer.setClearColor(0x000000, 0); // transparent: the showreel plays underneath
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .1, 100);
  const CAMZ = 10; camera.position.set(0, 0, CAMZ);
  const group = new THREE.Group(); scene.add(group);

  /* ---- point clouds for every form (unit box, colours 0..1) ---- */
  const data = await Promise.all(SCENES.map(s => s.make(s)));

  const geo = new THREE.BufferGeometry();
  const posA = new Float32Array(N * 3), posB = new Float32Array(N * 3), colA = new Float32Array(N * 3), colB = new Float32Array(N * 3);
  const rnd = new Float32Array(N * 4);
  for (let i = 0; i < N * 4; i++) rnd[i] = Math.random();
  // start from a wide, faint cloud so the first form reads as particles arriving
  for (let i = 0; i < N; i++) {
    const v = randDir(), r = .9 + Math.random() * 1.4;
    posA[i * 3] = v[0] * r; posA[i * 3 + 1] = v[1] * r * .6; posA[i * 3 + 2] = v[2] * r * .5;
    colA[i * 3] = .08; colA[i * 3 + 1] = .06; colA[i * 3 + 2] = .1;
  }
  posB.set(data[0].pos); colB.set(data[0].col);
  const attr = (arr, n) => new THREE.BufferAttribute(arr, n).setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', attr(posB, 3)); // unused by the shader, keeps three.js happy
  geo.setAttribute('aPosA', attr(posA, 3)); geo.setAttribute('aPosB', attr(posB, 3));
  geo.setAttribute('aColA', attr(colA, 3)); geo.setAttribute('aColB', attr(colB, 3));
  geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);

  const TRAIL = 12;
  const uniforms = {
    uMix: { value: 0 }, uTime: { value: 0 }, uScaleA: { value: 4 }, uScaleB: { value: 4 }, uOffset: { value: new THREE.Vector2() },
    uSize: { value: 2 }, uBurst: { value: 0 }, uBurstAt: { value: new THREE.Vector2() },
    uTrail: { value: Array.from({ length: TRAIL }, () => new THREE.Vector4(99, 99, 0, 0)) }
  };
  const mat = new THREE.ShaderMaterial({
    uniforms, transparent: true, depthWrite: false, depthTest: false,
    // pure light: colour adds onto the premultiplied canvas, a little alpha dims the video under bright points
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor,
    vertexShader: /* glsl */`
      attribute vec3 aPosA; attribute vec3 aPosB; attribute vec3 aColA; attribute vec3 aColB; attribute vec4 aRnd;
      uniform float uMix, uTime, uScaleA, uScaleB, uSize, uBurst; uniform vec2 uOffset, uBurstAt;
      uniform vec4 uTrail[${TRAIL}];
      varying vec3 vCol;
      float ease(float t){ return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0; }
      void main(){
        float t = ease(clamp((uMix - aRnd.x * 0.35) / 0.65, 0.0, 1.0));
        vec3 a = aPosA * uScaleA, b = aPosB * uScaleB;
        vec3 n = vec3(aRnd.y, aRnd.z, aRnd.w) * 2.0 - 1.0;
        float mid = sin(3.14159 * t);
        // travel along a gentle arc instead of a straight line
        vec3 p = mix(a, b, t) + (n * 0.6 + vec3(0.0, 0.0, 0.4)) * mid * uScaleB * 0.22;
        // slow breathing flow, so a held form never looks frozen
        float s = uScaleB * 0.012;
        p += vec3(sin(uTime * 0.6 + b.y * 1.7 + aRnd.y * 6.28), cos(uTime * 0.5 + b.x * 1.9 + aRnd.z * 6.28), sin(uTime * 0.4 + b.z * 2.3 + aRnd.w * 6.28)) * s;
        vec4 w = modelMatrix * vec4(p, 1.0);
        w.xy += uOffset;
        // cursor wind: a trail of recent pointer positions pushes particles away
        for (int i = 0; i < ${TRAIL}; i++) {
          vec4 tr = uTrail[i];
          vec2 dv = w.xy - tr.xy;
          float f = tr.z * exp(-dot(dv, dv) / (tr.w * tr.w));
          w.xy += normalize(dv + 1e-4) * f * (0.5 + aRnd.w * 0.7) * tr.w;
          w.z += f * (0.6 + aRnd.y) * tr.w;
        }
        vec2 bd = w.xy - uBurstAt;
        w.xyz += vec3(normalize(bd + n.xy * 0.4), n.z) * uBurst * (0.5 + aRnd.x * 1.5) * uScaleB * 0.45;
        vec4 mv = viewMatrix * w;
        gl_Position = projectionMatrix * mv;
        float depth = 10.0 / -mv.z;
        gl_PointSize = uSize * depth * (0.7 + aRnd.z * 0.6);
        // nearer particles glow a little brighter
        vCol = mix(aColA, aColB, t) * clamp(depth * depth, 0.55, 1.6) * (1.0 - mid * 0.25);
      }`,
    fragmentShader: /* glsl */`
      varying vec3 vCol;
      void main(){
        float r = length(gl_PointCoord - 0.5);
        if (r > 0.5) discard;
        vec3 c = vCol * smoothstep(0.5, 0.0, r);
        gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * 0.5);
      }`
  });
  group.add(new THREE.Points(geo, mat));

  /* ---- layout: the free area next to (wide screens) or above (narrow screens) the headline block ---- */
  let cssW = 1, cssH = 1, ppw = 1, visH = 1, visW = 1, dpr = 1, region = { w: 1, h: 1 };
  const copyEl = hero.querySelector('.hero__copy');
  function scaleFor(i) {
    const [fw, fh] = fitBox(SCENES[i].aspect);
    return Math.min(region.w / fw, region.h / fh) / ppw;
  }
  function layout() {
    const r = hero.getBoundingClientRect(), c = copyEl.getBoundingClientRect();
    cssW = r.width; cssH = r.height;
    dpr = Math.min(coarse ? 1.5 : 2, devicePixelRatio || 1);
    renderer.setPixelRatio(dpr); renderer.setSize(cssW, cssH, false);
    camera.aspect = cssW / cssH; camera.updateProjectionMatrix();
    visH = 2 * CAMZ * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)); visW = visH * camera.aspect;
    ppw = cssH / visH;
    let L, R, Tp, B;
    if (cssW >= 1180) { L = c.left - r.left + Math.max(c.width, copyEl.querySelector('h1').scrollWidth) + 24; R = cssW - 24; Tp = 90; B = cssH - 70; }
    else { L = 16; R = cssW - 16; Tp = 110; B = c.top - r.top - 12; }
    region = { w: Math.max(80, R - L), h: Math.max(80, B - Tp) };
    uniforms.uOffset.value.set(((L + R) / 2 - cssW / 2) / ppw, (cssH / 2 - (Tp + B) / 2) / ppw);
    uniforms.uScaleA.value = uniforms.uScaleB.value = scaleFor(cur);
    sizePoints();
  }
  function sizePoints() { uniforms.uSize.value = Math.max(1.6, Math.min(3.2, uniforms.uScaleB.value * ppw / 170)) * dpr; }

  /* ---- pointer → world (plane z = 0) ---- */
  const trail = uniforms.uTrail.value;
  let ti = 0, last = null;
  function toWorld(cx, cy) {
    const r = canvas.getBoundingClientRect();
    return [((cx - r.left) / r.width - .5) * visW, (.5 - (cy - r.top) / r.height) * visH];
  }
  function push(cx, cy) {
    const [x, y] = toWorld(cx, cy);
    const sp = last ? Math.hypot(x - last[0], y - last[1]) : 0;
    last = [x, y];
    const radius = uniforms.uScaleB.value * (.08 + Math.min(.08, sp * .25));
    trail[ti % TRAIL].set(x, y, Math.min(1, .4 + sp * 4), radius);
    ti++;
  }
  const ptr = { x: 0, y: 0 };
  hero.addEventListener('pointermove', (e) => {
    push(e.clientX, e.clientY);
    ptr.x = e.clientX / innerWidth - .5; ptr.y = e.clientY / innerHeight - .5;
  }, { passive: true });
  hero.addEventListener('pointerleave', () => { last = null; });
  hero.addEventListener('click', (e) => {
    if (e.target.closest('a, button, input, form')) return;
    const [x, y] = toWorld(e.clientX, e.clientY);
    uniforms.uBurstAt.value.set(x, y);
    next(1);
  });
  // tilt on phones that expose orientation without a permission prompt
  let tiltX = 0, tiltY = 0;
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    tiltY = THREE.MathUtils.clamp(e.gamma / 45, -1, 1) * .35; tiltX = THREE.MathUtils.clamp((e.beta - 45) / 45, -1, 1) * .2;
  });

  /* ---- timeline ---- */
  let cur = 0, phase = 'assemble', phaseT = 0, mix = 0, burst = 0;
  barEl.innerHTML = SCENES.map((s, i) => `<button type="button" aria-label="${i + 1}" data-i="${i}"><i></i></button>`).join('');
  const bars = [...barEl.children];
  bars.forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); uniforms.uBurstAt.value.copy(uniforms.uOffset.value); next(.7, +b.dataset.i); }));
  function label() {
    nameEl.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(SCENES.length).padStart(2, '0');
    bars.forEach((b, i) => { b.classList.toggle('is-active', i === cur); b.classList.toggle('is-done', i < cur); });
  }
  label();

  function next(strength = .25, to) {
    // freeze the current per-particle state into A, then aim B at the next form
    const m = mix;
    for (let i = 0; i < N; i++) {
      let t = Math.min(1, Math.max(0, (m - rnd[i * 4] * .35) / .65));
      t = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      for (let k = 0; k < 3; k++) {
        const j = i * 3 + k;
        posA[j] = (posA[j] * uniforms.uScaleA.value + (posB[j] * uniforms.uScaleB.value - posA[j] * uniforms.uScaleA.value) * t) / uniforms.uScaleB.value;
        colA[j] = colA[j] + (colB[j] - colA[j]) * t;
      }
    }
    uniforms.uScaleA.value = uniforms.uScaleB.value;
    cur = to ?? (cur + 1) % SCENES.length;
    uniforms.uScaleB.value = scaleFor(cur); sizePoints();
    posB.set(data[cur].pos); colB.set(data[cur].col);
    ['aPosA', 'aPosB', 'aColA', 'aColB'].forEach(n => (geo.attributes[n].needsUpdate = true));
    mix = 0; phase = 'assemble'; phaseT = 0; burst = Math.max(burst, strength);
    label();
  }

  /* ---- loop ---- */
  let running = true, paused = false, prev = performance.now(), elapsed = 0, spin = 0;
  const rot = { x: 0, y: 0 };

  function tick(now) {
    if (!running) return;
    const dt = paused ? 0 : Math.min(.05, (now - prev) / 1000); prev = now; elapsed += dt;
    uniforms.uTime.value = elapsed;
    phaseT += dt;
    if (phase === 'assemble') {
      mix = Math.min(1, phaseT / T.assemble);
      if (mix >= 1) { phase = 'hold'; phaseT = 0; }
    } else if (phase === 'hold' && phaseT > T.hold) next();

    uniforms.uMix.value = mix;
    burst *= Math.pow(.2, dt); uniforms.uBurst.value = burst;
    for (let i = 0; i < TRAIL; i++) trail[i].z *= Math.pow(.12, dt);

    const done = phase === 'assemble' ? phaseT : T.assemble + phaseT;
    bars[cur] && bars[cur].style.setProperty('--p', Math.min(100, done / (T.assemble + T.hold) * 100) + '%');

    // volumetric forms turn slowly; the flat mark settles to face the viewer
    if (SCENES[cur].flat) spin += (Math.round(spin / TAU) * TAU - spin) * Math.min(1, dt * 1.6);
    else spin += dt * .22;
    rot.y += ((ptr.x * .35 + tiltY) - rot.y) * Math.min(1, dt * 2.5);
    rot.x += ((ptr.y * .2 + tiltX) - rot.x) * Math.min(1, dt * 2.5);
    group.rotation.set(rot.x, spin + rot.y, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; prev = performance.now(); requestAnimationFrame(tick); }
    if (!e.isIntersecting) running = false;
  }).observe(hero);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) running = false;
    else if (!running) { running = true; prev = performance.now(); requestAnimationFrame(tick); }
  });
  addEventListener('resize', layout);
  layout();
  // ?still=N renders form N fully assembled and frozen (for screenshots and review)
  const still = new URLSearchParams(location.search).get('still');
  if (still !== null) {
    if (+still !== cur) next(0, +still);
    mix = 1; phase = 'hold'; phaseT = -1e9; paused = true; spin = SCENES[cur].flat ? 0 : .5;
    posA.set(posB); colA.set(colB); uniforms.uScaleA.value = uniforms.uScaleB.value;
    geo.attributes.aPosA.needsUpdate = geo.attributes.aColA.needsUpdate = true;
  }
  requestAnimationFrame(tick);
}

/* ---------- forms: positions fit a unit box (fitBox), colours are additive light ---------- */
function fitBox(aspect) { return aspect >= 1 ? [1, 1 / aspect] : [aspect, 1]; }
function randDir() {
  const u = Math.random() * 2 - 1, a = Math.random() * TAU, s = Math.sqrt(1 - u * u);
  return [s * Math.cos(a), u, s * Math.sin(a)];
}
const PAL = {
  crimson: [.91, .11, .35], pink: [1, .42, .62], violet: [.5, .25, .95], blue: [.2, .42, 1], white: [1, .93, .96]
};
function mixc(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function setc(col, i, c, g) { col[i * 3] = c[0] * g; col[i * 3 + 1] = c[1] * g; col[i * 3 + 2] = c[2] * g; }
function gainFor(n) { return Math.min(.9, 14000 / n); } // keep additive density similar on phones and desktops
function tilt(p, ax, ay) {
  const [x, y, z] = p, cx = Math.cos(ax), sx = Math.sin(ax), cy = Math.cos(ay), sy = Math.sin(ay);
  const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
  return [x * cy + z1 * sy, y1, -x * sy + z1 * cy];
}

// planet with a tilted ring of dust
function planet() {
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), g = gainFor(N);
  const ringN = Math.floor(N * .34);
  for (let i = 0; i < N; i++) {
    let p, c;
    if (i < N - ringN) {
      const k = i + .5, phi = Math.acos(1 - 2 * k / (N - ringN)), th = Math.PI * (1 + Math.sqrt(5)) * k;
      const band = .5 + .5 * Math.sin(phi * 9 + Math.sin(th * 2) * .6);
      const r = .3 * (1 + (Math.random() - .5) * .03);
      p = [r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th)];
      c = mixc(mixc(PAL.violet, PAL.crimson, band), PAL.white, Math.max(0, p[1] / .3) * .5);
    } else {
      const a = Math.random() * TAU, r = .38 + Math.pow(Math.random(), 1.6) * .14;
      p = tilt([Math.cos(a) * r, (Math.random() - .5) * .008, Math.sin(a) * r], .42, 0);
      c = mixc(PAL.pink, PAL.white, Math.random() * .6);
    }
    pos.set(p, i * 3); setc(col, i, c, g * (i < N - ringN ? 1 : .8));
  }
  return { pos, col };
}

// (2,3) torus knot drawn as a lit tube
const kc = (t) => { const r = 2 + Math.cos(3 * t); return [r * Math.cos(2 * t), r * Math.sin(2 * t), Math.sin(3 * t) * 1.2]; };
const norm = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function knot() {
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), g = gainFor(N);
  for (let i = 0; i < N; i++) {
    // points on the tube surface around the curve, using a numeric Frenet-like frame
    const t = Math.random() * TAU, c0 = kc(t), c1 = kc(t + .001);
    const tg = norm([c1[0] - c0[0], c1[1] - c0[1], c1[2] - c0[2]]);
    const nx = norm(cross(tg, [0, 0, 1])), bx = cross(tg, nx);
    const a = Math.random() * TAU, dust = Math.random() < .08, tube = dust ? .3 + Math.random() * .5 : .26 * (1 + (Math.random() - .5) * .08);
    let p = [0, 1, 2].map(j => (c0[j] + (nx[j] * Math.cos(a) + bx[j] * Math.sin(a)) * tube) * .14);
    p = tilt(p, .5, 0);
    const k = .5 + .5 * Math.sin(t * 2), lit = Math.max(0, Math.cos(a - .8));
    pos.set(p, i * 3); setc(col, i, mixc(mixc(PAL.crimson, PAL.violet, k), PAL.white, lit * .45), g * (dust ? .5 : 1));
  }
  return { pos, col };
}

// rolling wave field, like a terrain of sound
function wave() {
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), g = gainFor(N) * 1.1;
  const side = Math.ceil(Math.sqrt(N * 1.5)), rows = Math.ceil(N / side);
  for (let i = 0; i < N; i++) {
    const u = (i % side) / (side - 1) - .5, v = Math.floor(i / side) / (rows - 1) - .5;
    const h = .07 * Math.sin(u * 11 + v * 3) * Math.cos(v * 9) + .045 * Math.sin(Math.hypot(u, v) * 22);
    const p = tilt([u * .98, h, v * .66], .62, 0);
    const k = THREE.MathUtils.clamp(h / .12 * .5 + .5, 0, 1);
    pos.set(p, i * 3); setc(col, i, mixc(mixc(PAL.blue, PAL.violet, Math.min(1, k * 1.6)), PAL.pink, Math.max(0, k * 2 - 1)), g);
  }
  return { pos, col };
}

// three-armed spiral galaxy with a bright core
function galaxy() {
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), g = gainFor(N);
  for (let i = 0; i < N; i++) {
    const arm = i % 3, r = Math.pow(Math.random(), .7) * .5;
    const a = arm * TAU / 3 + r * 9 + (Math.random() - .5) * (.5 + (1 - r) * .4);
    const spread = (Math.random() - .5) * .05 * (1 - r);
    const p = tilt([Math.cos(a) * r + spread, (Math.random() - .5) * .04 * (1 - r * 1.5), Math.sin(a) * r + spread], 1.05, 0);
    const c = mixc(PAL.white, mixc(PAL.crimson, PAL.violet, Math.min(1, r * 2.2)), Math.min(1, r * 4));
    pos.set(p, i * 3); setc(col, i, c, g * (r < .06 ? .7 : 1));
  }
  return { pos, col };
}

// the nestudio mark, sampled from the inline SVG symbol
async function logo(s) {
  const paths = [...document.querySelectorAll('#mark path')];
  const W = 703, H = 740, k = 1.4, c = document.createElement('canvas'); c.width = W * k; c.height = H * k;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.scale(k, k);
  const playIdx = paths.findIndex(p => (p.getAttribute('fill') || '').startsWith('#'));
  paths.forEach((p, i) => { x.fillStyle = i === playIdx ? '#f00' : '#fff'; x.fill(new Path2D(p.getAttribute('d'))); });
  const d = x.getImageData(0, 0, c.width, c.height).data, ring = [], play = [];
  for (let i = 0; i < c.width * c.height; i += 2) {
    if (d[i * 4 + 3] < 160) continue;
    (d[i * 4 + 1] < 100 ? play : ring).push(i);
  }
  const [fw, fh] = fitBox(s.aspect), g = gainFor(N);
  const pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const playN = Math.floor(N * .26), ringN = Math.floor(N * .62);
  for (let i = 0; i < N; i++) {
    if (i < playN + ringN) {
      const src = i < playN ? play : ring, p = src[(Math.random() * src.length) | 0];
      const gx = p % c.width, gy = (p / c.width) | 0;
      pos[i * 3] = (gx / c.width - .5) * fw; pos[i * 3 + 1] = (.5 - gy / c.height) * fh; pos[i * 3 + 2] = (Math.random() - .5) * .04;
      setc(col, i, i < playN ? PAL.crimson : PAL.white, i < playN ? g * 1.5 : g * .85);
    } else { // faint halo
      const a = Math.random() * TAU, r = .5 + Math.random() * .25;
      pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = Math.sin(a) * r; pos[i * 3 + 2] = -.2 - Math.random() * .4;
      setc(col, i, PAL.crimson, g * .35);
    }
  }
  return { pos, col };
}

// started last so the form builders and palette above are initialised
if (renderer) start().catch((e) => { console.warn('[hero]', e); fail(); });

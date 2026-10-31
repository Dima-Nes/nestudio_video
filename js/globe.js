/* Dotted globe with arcs from Minsk. Canvas 2D, orthographic projection, drag to rotate. */
(() => {
  const box = document.getElementById('globe');
  const cv = document.getElementById('globe-canvas');
  if (!box || !cv || !window.LAND_DOTS) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = Math.PI / 180;

  const HOME = { lat: 53.90, lon: 27.56, name: { ru: 'Минск', en: 'Minsk' } };
  const PINS = [
    { lat: 55.75, lon: 37.62, name: { ru: 'Россия', en: 'Russia' }, big: true },
    { lat: 56.34, lon: 37.52 }, // Dmitrov, Sr.Double
    // more reach: Russia, the USA and Spain
    { lat: 59.93, lon: 30.34 }, { lat: 55.79, lon: 49.12 }, { lat: 56.84, lon: 60.60 }, { lat: 55.01, lon: 82.93 },
    { lat: 34.05, lon: -118.24 }, { lat: 41.88, lon: -87.63 }, { lat: 25.76, lon: -80.19 },
    { lat: 40.42, lon: -3.70 }, { lat: 41.39, lon: 2.17 },
    { lat: 47.13, lon: 8.13, name: { ru: 'Швейцария', en: 'Switzerland' }, big: true },
    { lat: 43.21, lon: -71.54, name: { ru: 'США', en: 'USA' }, big: true },
    { lat: 52.44, lon: 30.98 }, { lat: 53.68, lon: 23.83 }, { lat: 54.88, lon: 26.94 },
    { lat: 52.25, lon: 26.80 }, { lat: 54.15, lon: 25.32 }, { lat: 52.21, lon: 24.36 }
  ];
  const dots = [];
  const src = window.LAND_DOTS;
  const toV = (lat, lon) => { const a = lat * D, b = lon * D; return [Math.cos(a) * Math.sin(b), Math.sin(a), Math.cos(a) * Math.cos(b)]; };
  for (let i = 0; i < src.length; i += 2) dots.push(toV(src[i], src[i + 1]));
  const home = toV(HOME.lat, HOME.lon);
  PINS.forEach(p => { p.v = toV(p.lat, p.lon); p.arc = arcPoints(home, p.v); p.phase = Math.random(); });

  function slerp(a, b, t) {
    const dot = Math.min(1, Math.max(-1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
    const om = Math.acos(dot), s = Math.sin(om) || 1;
    const k1 = Math.sin((1 - t) * om) / s, k2 = Math.sin(t * om) / s;
    return [a[0] * k1 + b[0] * k2, a[1] * k1 + b[1] * k2, a[2] * k1 + b[2] * k2];
  }
  function arcPoints(a, b) {
    const dist = Math.acos(a[0] * b[0] + a[1] * b[1] + a[2] * b[2]);
    const h = .02 + dist * .32, out = [];
    for (let i = 0; i <= 48; i++) { const t = i / 48, p = slerp(a, b, t), k = 1 + h * Math.sin(Math.PI * t); out.push([p[0] * k, p[1] * k, p[2] * k]); }
    return out;
  }

  let W = 0, H = 0, R = 0, dpr = 1;
  let lon0 = -18 * D, lat0 = 28 * D, vel = reduce ? 0 : .0016, dragging = false, last = null;
  function size() {
    dpr = Math.min(2, devicePixelRatio || 1);
    const r = box.getBoundingClientRect();
    W = cv.width = Math.round(r.width * dpr); H = cv.height = Math.round(r.height * dpr);
    R = Math.min(W, H) * .42;
  }
  // rotate around Y by lon0 then around X by lat0
  function proj(v) {
    const cl = Math.cos(-lon0), sl = Math.sin(-lon0);
    const x1 = v[0] * cl + v[2] * sl, z1 = -v[0] * sl + v[2] * cl;
    const ct = Math.cos(lat0), st = Math.sin(lat0);
    const y2 = v[1] * ct - z1 * st, z2 = v[1] * st + z1 * ct;
    return [W / 2 + x1 * R, H / 2 - y2 * R, z2];
  }
  const css = getComputedStyle(document.documentElement);
  const C = { dot: '#e4dfe9', accent: css.getPropertyValue('--video').trim() || '#e81c5a', label: '#f3f0f5' };
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ru');

  let t0 = performance.now(), visible = true;
  function frame(now) {
    const dt = Math.min(50, now - t0); t0 = now;
    if (!dragging) lon0 += vel * dt * .06;
    ctx.clearRect(0, 0, W, H);
    // sphere
    const g = ctx.createRadialGradient(W / 2 - R * .35, H / 2 - R * .4, R * .1, W / 2, H / 2, R);
    g.addColorStop(0, '#1d1a25'); g.addColorStop(1, '#0d0b12');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(W / 2, H / 2, R, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.08)'; ctx.lineWidth = dpr; ctx.stroke();
    // land dots
    const ds = Math.max(1.4, R / 210) * 1;
    ctx.fillStyle = C.dot;
    for (let i = 0; i < dots.length; i++) {
      const p = proj(dots[i]); if (p[2] <= 0) continue;
      ctx.globalAlpha = .12 + p[2] * .5;
      ctx.fillRect(p[0] - ds / 2, p[1] - ds / 2, ds, ds);
    }
    ctx.globalAlpha = 1;
    // arcs
    const time = now / 1000;
    PINS.forEach(pin => {
      const pts = pin.arc.map(proj);
      ctx.lineWidth = (pin.big ? 1.6 : 1.1) * dpr; ctx.strokeStyle = 'rgba(232,28,90,.45)';
      ctx.beginPath(); let pen = false;
      pts.forEach(p => { const vis = p[2] > -.05 || Math.hypot(p[0] - W / 2, p[1] - H / 2) > R; if (vis) { pen ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); pen = true; } else pen = false; });
      ctx.stroke();
      // travelling comet
      const k = ((time * .35 + pin.phase) % 1), n = pts.length - 1, head = Math.floor(k * n);
      for (let j = Math.max(0, head - 8); j < head; j++) {
        const a = pts[j], b = pts[j + 1]; if (a[2] < -.05 && Math.hypot(a[0] - W / 2, a[1] - H / 2) < R) continue;
        ctx.strokeStyle = C.accent; ctx.globalAlpha = 1 - (head - j) / 9; ctx.lineWidth = (pin.big ? 2.6 : 1.8) * dpr;
        ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      }
      ctx.globalAlpha = 1;
      // pin
      const p = proj(pin.v); if (p[2] <= 0) return;
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(p[0], p[1], (pin.big ? 4 : 2.4) * dpr, 0, Math.PI * 2); ctx.fill();
      if (pin.big) label(p, pin.name[lang()]);
    });
    // home pulse
    const h = proj(home);
    if (h[2] > 0) {
      const pulse = (time % 1.6) / 1.6;
      ctx.strokeStyle = C.accent; ctx.globalAlpha = 1 - pulse; ctx.lineWidth = 2 * dpr;
      ctx.beginPath(); ctx.arc(h[0], h[1], (5 + pulse * 18) * dpr, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(h[0], h[1], 5 * dpr, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.accent; ctx.beginPath(); ctx.arc(h[0], h[1], 2.4 * dpr, 0, Math.PI * 2); ctx.fill();
      label(h, HOME.name[lang()], true);
    }
    if (visible) requestAnimationFrame(frame);
  }
  function label(p, text, bold) {
    ctx.font = `${bold ? 600 : 500} ${12 * dpr}px "Golos Text", system-ui, sans-serif`;
    const w = ctx.measureText(text).width, pad = 6 * dpr, x = p[0] + 9 * dpr, y = p[1] - 9 * dpr;
    ctx.fillStyle = 'rgba(17,15,23,.92)'; ctx.strokeStyle = 'rgba(255,255,255,.16)'; ctx.lineWidth = dpr;
    ctx.beginPath(); ctx.roundRect(x, y - 11 * dpr, w + pad * 2, 20 * dpr, 10 * dpr); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.label; ctx.fillText(text, x + pad, y + 3 * dpr);
  }

  box.addEventListener('pointerdown', (e) => { dragging = true; last = [e.clientX, e.clientY]; box.setPointerCapture(e.pointerId); });
  box.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - last[0], dy = e.clientY - last[1]; last = [e.clientX, e.clientY];
    lon0 -= dx * .006; lat0 = Math.max(-.9, Math.min(1.1, lat0 + dy * .006));
  });
  const up = () => { dragging = false; };
  box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);

  new IntersectionObserver(([e]) => { const was = visible; visible = e.isIntersecting; if (visible && !was) { t0 = performance.now(); requestAnimationFrame(frame); } }).observe(box);
  addEventListener('resize', size);
  size(); requestAnimationFrame(frame);
})();

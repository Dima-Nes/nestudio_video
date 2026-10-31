/* Client wall: a dot grid behind the names. Dots near the cursor swell and light up,
   raspberry on the left (video) blending to blue on the right (web); a slow diagonal wave keeps it alive on touch screens. */
(() => {
  const wall = document.getElementById('clients-wall');
  const cv = document.getElementById('clients-dots');
  if (!wall || !cv) return;
  const ctx = cv.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = getComputedStyle(document.documentElement);
  const hex = (v, d) => { const m = (css.getPropertyValue(v).trim() || d).match(/\w\w/g); return m.map(x => parseInt(x, 16)); };
  const A = hex('--video', '#e81c5a'), B = hex('--web', '#2f6bff');
  const GAP = 16, R = 150;
  let W = 0, H = 0, dpr = 1, cols = 0, rows = 0, mx = -1e4, my = -1e4, tx = -1e4, ty = -1e4, visible = false, raf = 0;

  function size() {
    dpr = Math.min(2, devicePixelRatio || 1);
    const r = wall.getBoundingClientRect();
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cols = Math.ceil(W / GAP) + 1; rows = Math.ceil(H / GAP) + 1;
    if (reduce) draw(0);
  }
  function draw(t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    mx += (tx - mx) * .18; my += (ty - my) * .18;
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const x = i * GAP + (j % 2) * GAP / 2, y = j * GAP;
        const d = Math.hypot(x - mx, y - my);
        const near = d < R ? Math.pow(1 - d / R, 2) : 0;
        const wave = reduce ? 0 : .5 + .5 * Math.sin(t * .0012 - (x + y) * .012);
        const k = x / W, c = [0, 1, 2].map(n => Math.round(A[n] + (B[n] - A[n]) * k));
        const a = .07 + wave * .06 + near * .85;
        const s = .9 + wave * .3 + near * 2.4;
        ctx.fillStyle = near > .02 ? `rgba(${c[0]},${c[1]},${c[2]},${a})` : `rgba(255,255,255,${a})`;
        ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  function loop(t) { draw(t); raf = visible && !reduce ? requestAnimationFrame(loop) : 0; }

  wall.addEventListener('pointermove', (e) => { const r = wall.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; if (mx < -1e3) { mx = tx; my = ty; } }, { passive: true });
  wall.addEventListener('pointerleave', () => { tx = ty = -1e4; });
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf && !reduce) raf = requestAnimationFrame(loop);
  }).observe(wall);
  new ResizeObserver(size).observe(wall);
  size();
})();

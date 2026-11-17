(() => {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!calm && matchMedia('(hover: hover)').matches) {
    let frame = 0, x = 0, y = 0;
    addEventListener('mousemove', (e) => {
      x = e.clientX / innerWidth * 2 - 1;
      y = e.clientY / innerHeight * 2 - 1;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        root.style.setProperty('--mx', x.toFixed(3));
        root.style.setProperty('--my', y.toFixed(3));
      });
    }, { passive: true });
  }
  document.querySelectorAll('[data-scope]').forEach((scope) => {
    scope.addEventListener('mousemove', (e) => {
      const box = scope.getBoundingClientRect();
      scope.style.setProperty('--lx', ((e.clientX - box.left) / box.width * 100).toFixed(1) + '%');
      scope.style.setProperty('--ly', ((e.clientY - box.top) / box.height * 100).toFixed(1) + '%');
      scope.style.setProperty('--zoom', '1.6');
      scope.classList.add('on');
    });
    scope.addEventListener('mouseleave', () => {
      scope.style.setProperty('--zoom', '1');
      scope.classList.remove('on');
    });
  });
  document.querySelectorAll('[data-orbit]').forEach((orbit) => {
    const track = orbit.querySelector('.track');
    const ring = orbit.querySelector('[data-ring]');
    const ticks = orbit.querySelector('[data-ticks]');
    const panel = orbit.querySelector('[data-panel]');
    const nodes = [...orbit.querySelectorAll('.node')];
    const readout = document.querySelector('[data-readout]');
    const bar = document.querySelector('[data-progress]');
    const count = nodes.length;
    const step = 24;
    const marks = nodes.map(() => {
      const m = document.createElement('span');
      m.style.cssText = 'position:absolute;top:0;width:1px;height:1px;scroll-snap-align:start';
      track.appendChild(m);
      return m;
    });
    orbit.style.scrollSnapType = 'x proximity';
    let active = -1;
    let frame = 0;
    const maxScroll = () => Math.max(1, orbit.scrollWidth - orbit.clientWidth);
    const render = () => {
      frame = 0;
      const w = orbit.clientWidth;
      const h = orbit.clientHeight;
      const p = Math.min(1, Math.max(0, orbit.scrollLeft / maxScroll()));
      const pos = p * (count - 1);
      const r = Math.max(700, w * 0.62);
      const cx = w / 2;
      const cy = h * 0.4 + r;
      ring.style.width = ring.style.height = 2 * r + 'px';
      ring.style.transform = `translate(${cx - r}px, ${cy - r}px)`;
      ticks.setAttribute('transform', `rotate(${-pos * step})`);
      let best = 0;
      let bestAngle = Infinity;
      nodes.forEach((node, i) => {
        const a = (i - pos) * step;
        const rad = a * Math.PI / 180;
        const k = Math.min(Math.abs(a), 80) / 80;
        node.style.transform = `translate(${cx + r * Math.sin(rad)}px, ${cy - r * Math.cos(rad)}px) scale(${1 - k * 0.45})`;
        node.style.opacity = (1 - k * 0.75).toFixed(3);
        node.style.zIndex = String(100 - Math.round(Math.abs(a)));
        if (Math.abs(a) < bestAngle) { bestAngle = Math.abs(a); best = i; }
      });
      if (best !== active) {
        active = best;
        nodes.forEach((node, i) => node.classList.toggle('active', i === best));
        panel.innerHTML = nodes[best].querySelector('.detail').innerHTML;
        if (readout) readout.textContent = String(best + 1).padStart(2, '0');
      }
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    };
    const layout = () => {
      const w = orbit.clientWidth;
      const gap = Math.max(w * 0.45, 320);
      orbit.style.setProperty('--vw', w + 'px');
      track.style.setProperty('--track', w + (count - 1) * gap + 'px');
      orbit.style.setProperty('--d', Math.round(Math.min(300, Math.max(190, w * 0.24))) + 'px');
      marks.forEach((m, i) => { m.style.left = i * gap + 'px'; });
      render();
    };
    const go = (i) => {
      const target = Math.max(0, Math.min(count - 1, i));
      orbit.scrollTo({ left: maxScroll() * target / (count - 1), behavior: calm ? 'auto' : 'smooth' });
    };
    orbit.addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(render); }, { passive: true });
    orbit.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const atStart = orbit.scrollLeft <= 0 && e.deltaY < 0;
      const atEnd = orbit.scrollLeft >= maxScroll() - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      orbit.scrollLeft += e.deltaY;
    }, { passive: false });
    orbit.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1); }
    });
    nodes.forEach((node, i) => node.addEventListener('click', () => go(i)));
    panel.style.zIndex = '200';
    addEventListener('resize', layout);
    layout();
  });
})();

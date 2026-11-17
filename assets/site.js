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
})();

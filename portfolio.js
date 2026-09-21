(() => {
  'use strict';
  const root = document.documentElement;
  const button = document.getElementById('themeBtn');
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : preference.matches;
  function updateThemeButton() {
    document.querySelector('meta[name="theme-color"]').content = isDark() ? '#111b2b' : '#f8f5f0';
    const label = `Switch to ${isDark() ? 'light' : 'dark'} theme`;
    button.setAttribute('aria-label', label);
    button.title = label;
    document.getElementById('themeIcon').innerHTML = isDark()
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2"/>'
      : '<path d="M20 14.5A8.2 8.2 0 0 1 9.5 4 8.3 8.3 0 1 0 20 14.5z"/>';
  }
  button.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (_) {}
    updateThemeButton();
  });
  preference.addEventListener('change', updateThemeButton);
  updateThemeButton();
  const links = [...document.querySelectorAll('.site-nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function updateNavigation() {
    let active = -1;
    sections.forEach((section, index) => {
      if (section.getBoundingClientRect().top <= 160) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    root.style.setProperty('--reading-progress', distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0);
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();

  const panel = document.querySelector('.network-panel');
  const explanations = {
    network: 'Each node represents a gene. Connections represent possible regulatory relationships.',
    regulation: 'A transcription factor can influence other genes. The highlighted connections show a simplified example.',
    prediction: 'Graph models help infer connections from biological data. Dashed lines show candidate links, not confirmed findings.'
  };
  const viewButtons = [...document.querySelectorAll('.network-controls button')];
  viewButtons.forEach(control => control.addEventListener('click', () => {
    panel.dataset.view = control.dataset.view;
    viewButtons.forEach(item => item.setAttribute('aria-pressed', String(item === control)));
    document.getElementById('network-note').textContent = explanations[control.dataset.view];
  }));
  document.querySelector('.network-controls').hidden = false;

  const filters = [...document.querySelectorAll('.project-filters button')];
  const cards = [...document.querySelectorAll('.project-grid .card')];
  filters.forEach(control => control.addEventListener('click', () => {
    filters.forEach(item => item.setAttribute('aria-pressed', String(item === control)));
    cards.forEach(card => {
      card.hidden = control.dataset.filter !== 'all' && !card.dataset.category.split(' ').includes(control.dataset.filter);
    });
    const count = cards.filter(card => !card.hidden).length;
    document.querySelector('.project-count').textContent = `${count} projects`;
    updateNavigation();
  }));
  document.querySelector('.project-toolbar').hidden = false;
})();

// Theme toggle logic. Requires just-the-docs.js (defines window.jtd).
jtd.onReady(function () {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function systemPref() {
    try {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch (e) { return 'dark'; }
  }

  function currentTheme() {
    try { return window.localStorage.getItem('jtd-theme') || systemPref(); }
    catch (e) { return systemPref(); }
  }

  function applyTheme(theme, persist) {
    document.documentElement.setAttribute('data-theme', theme);
    jtd.setTheme(theme);
    if (persist) {
      try { window.localStorage.setItem('jtd-theme', theme); } catch (e) {}
    }
  }

  function renderIcon(theme) {
    var sun = toggle.querySelector('[data-icon="sun"]');
    var moon = toggle.querySelector('[data-icon="moon"]');
    if (sun) sun.style.display = theme === 'light' ? 'inline-block' : 'none';
    if (moon) moon.style.display = theme === 'dark' ? 'inline-block' : 'none';
  }

  renderIcon(currentTheme());

  toggle.addEventListener('click', function () {
    var next = currentTheme() === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
    renderIcon(next);
  });
});

// Rewrite relative .md links to .html so cross-page links work on the built site.
jtd.onReady(function () {
  document.querySelectorAll('a[href]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (/^(https?:|mailto:|tel:|#|\/)/i.test(href)) return;
    if (href.indexOf('.md') === -1) return;
    a.setAttribute('href', href.replace(/\.md(?=#|$)/i, '.html'));
  });
});

// Floating back-to-top button.
jtd.onReady(function () {
  var btn = document.createElement('a');
  btn.href = '#top';
  btn.className = 'back-to-top-btn';
  btn.setAttribute('aria-label', 'Back to top');
  btn.textContent = 'Back to top \u2191';
  document.body.appendChild(btn);

  function onScroll() {
    var show = window.scrollY > 400;
    btn.classList.toggle('visible', show);
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
});

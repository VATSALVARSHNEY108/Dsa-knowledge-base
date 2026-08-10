// Theme toggle logic. Requires just-the-docs.js (defines window.jtd).
jtd.onReady(function () {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  function currentTheme() {
    try { return window.localStorage.getItem('jtd-theme') || 'dark'; }
    catch (e) { return 'dark'; }
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

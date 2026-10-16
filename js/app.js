// ─── app.js ───────────────────────────────────────────────────────────────────
// Navigation controller — switches between the two app sections

/**
 * Show either the 'weather' or 'movie' app section.
 * @param {'weather'|'movie'} appName
 */
const showApp = (appName) => {
  const sections = {
    weather: document.getElementById('weather-app'),
    movie:   document.getElementById('movie-app'),
  };

  const buttons = {
    weather: document.getElementById('btn-weather'),
    movie:   document.getElementById('btn-movie'),
  };

  // Hide all sections and deactivate all nav buttons
  Object.values(sections).forEach(sec => sec.classList.add('hidden'));
  Object.values(buttons).forEach(btn  => btn.classList.remove('active'));

  // Show the chosen section and mark its button active
  sections[appName].classList.remove('hidden');
  buttons[appName].classList.add('active');
};

// Expose globally so the inline onclick attributes in index.html can reach it
window.showApp = showApp;

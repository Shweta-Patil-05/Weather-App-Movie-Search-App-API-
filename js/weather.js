// ─── weather.js ───────────────────────────────────────────────────────────────
// Weather App — uses OpenWeatherMap free API
//
// Free API key registration: https://openweathermap.org/appid
// The key below is a demo key; replace it with your own if it stops working.

// 🔑 GET YOUR FREE KEY → https://openweathermap.org/appid  (takes ~10 min, free account)
// Replace the string below with your key after registering.
const WEATHER_API_KEY = '7cc9b83a80012a06ef20a0383848fbb8';

// Map OWM condition codes to emoji icons
const getWeatherEmoji = (code) => {
  if (code >= 200 && code < 300) return '⛈️';   // Thunderstorm
  if (code >= 300 && code < 400) return '🌦️';   // Drizzle
  if (code >= 500 && code < 600) return '🌧️';   // Rain
  if (code >= 600 && code < 700) return '❄️';   // Snow
  if (code >= 700 && code < 800) return '🌫️';   // Atmosphere (fog, haze…)
  if (code === 800)               return '☀️';   // Clear sky
  if (code > 800)                 return '☁️';   // Clouds
  return '🌡️';
};

// Render weather data into the card element
const renderWeather = ({ name, sys, main, weather, wind }) => {
  const [{ id, description }] = weather;
  const card = document.getElementById('weather-card');

  card.innerHTML = `
    <div class="weather-city">${name}</div>
    <div class="weather-country">${sys.country}</div>
    <div class="weather-icon">${getWeatherEmoji(id)}</div>
    <div class="weather-temp">${Math.round(main.temp)}°C</div>
    <div class="weather-desc">${description}</div>

    <div class="weather-stats">
      <div class="stat-box">
        <div class="stat-label">Feels Like</div>
        <div class="stat-value">${Math.round(main.feels_like)}°C</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Humidity</div>
        <div class="stat-value">${main.humidity}%</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Wind Speed</div>
        <div class="stat-value">${(wind.speed * 3.6).toFixed(1)} km/h</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Min Temp</div>
        <div class="stat-value">${Math.round(main.temp_min)}°C</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Max Temp</div>
        <div class="stat-value">${Math.round(main.temp_max)}°C</div>
      </div>
      <div class="stat-box">
        <div class="stat-label">Pressure</div>
        <div class="stat-value">${main.pressure} hPa</div>
      </div>
    </div>

    <div class="weather-updated">
      Last updated: ${new Date().toLocaleTimeString()}
    </div>
  `;
};

// Show / hide helpers
const showWeatherError = (msg) => {
  const el = document.getElementById('weather-error');
  el.textContent = msg;
  el.classList.remove('hidden');
};

const hideWeatherError = () =>
  document.getElementById('weather-error').classList.add('hidden');

const showWeatherLoader = () =>
  document.getElementById('weather-loader').classList.remove('hidden');

const hideWeatherLoader = () =>
  document.getElementById('weather-loader').classList.add('hidden');

const showWeatherCard = () =>
  document.getElementById('weather-card').classList.remove('hidden');

const hideWeatherCard = () =>
  document.getElementById('weather-card').classList.add('hidden');

// Fetch weather for a given city name
const fetchWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

  const response = await fetch(url);

  if (!response.ok) {
    const { message } = await response.json();
    // Capitalise first letter for friendlier error message
    throw new Error(message.charAt(0).toUpperCase() + message.slice(1));
  }

  return response.json();
};

// Main search handler
const handleWeatherSearch = async () => {
  const input = document.getElementById('city-input');
  const city  = input.value.trim();

  if (!city) {
    showWeatherError('Please enter a city name.');
    return;
  }

  hideWeatherError();
  hideWeatherCard();
  showWeatherLoader();

  try {
    const data = await fetchWeather(city);
    renderWeather(data);
    showWeatherCard();
  } catch (err) {
    showWeatherError(`❌ ${err.message || 'Something went wrong. Please try again.'}`);
  } finally {
    hideWeatherLoader();
  }
};

// ─── Event Listeners ──────────────────────────────────────────────────────────
document.getElementById('weather-search-btn')
  .addEventListener('click', handleWeatherSearch);

document.getElementById('city-input')
  .addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleWeatherSearch();
  });

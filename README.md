# Weather App + Movie Search App (API)

> Minor Project 03 — Interactive web applications using public REST APIs.

## Live Preview
Open `index.html` directly in a browser (no server required for static assets).

---

## Project Structure

```
├── index.html          # Single-page entry point (both apps)
├── css/
│   └── style.css       # All styles — responsive, dark theme
├── js/
│   ├── app.js          # Navigation controller (module)
│   ├── weather.js      # Weather App logic (module)
│   └── movie.js        # Movie Search App logic (module)
└── README.md
```

---

## APIs Used

| App     | API                        | Free Tier                  | Registration |
|---------|---------------------------|----------------------------|--------------|
| Weather | [OpenWeatherMap](https://openweathermap.org/appid) | 60 calls/min, unlimited days | Free account |
| Movies  | [OMDB API](https://www.omdbapi.com/apikey.aspx)  | 1,000 requests/day         | Free account |

### How to get your API keys (free, no credit card)

**OpenWeatherMap:**
1. Go to https://openweathermap.org/appid
2. Sign up for a free account
3. Your API key will be emailed and visible under *My API Keys*
4. Paste it in [`js/weather.js`](js/weather.js) — line 7:
   ```js
   const WEATHER_API_KEY = 'YOUR_KEY_HERE';
   ```

**OMDB:**
1. Go to https://www.omdbapi.com/apikey.aspx
2. Choose the **FREE** tier and enter your email
3. Activate the key from the email you receive
4. Paste it in [`js/movie.js`](js/movie.js) — line 9:
   ```js
   const OMDB_API_KEY = 'YOUR_KEY_HERE';
   ```

---

## Features

### 🌤 Weather App
- Search current weather by **city name**
- Displays **temperature**, **feels like**, **min/max**, **humidity**, **wind speed**, **pressure**
- Weather **emoji icons** mapped from OpenWeatherMap condition codes
- **Error handling** — invalid city, network failures, missing input
- **Responsive** layout (stacks to 2-column on mobile)

### 🎬 Movie Search App
- Search movies, series, and episodes via the **OMDB API**
- Displays **movie poster**, **title**, **year**, **type badge**
- Fetches and shows **IMDb ratings** (parallel `Promise.allSettled`)
- Handles missing posters with a fallback placeholder
- **Error handling** — empty input, no results, invalid API key, network errors
- **Responsive** grid (auto-fill, min 160 px per card)

---

## ES6+ Concepts Demonstrated

| Concept | Where used |
|---|---|
| Arrow functions | Every function in all JS files |
| Template literals | `renderWeather()`, `createMovieCard()`, all HTML strings |
| Destructuring | `renderWeather({ name, sys, main, weather, wind })`, `createMovieCard({ Title, Year, … })` |
| Async / Await | `fetchWeather()`, `fetchMovies()`, `enrichWithRatings()`, all handlers |
| Promises | `Promise.allSettled()` for parallel rating fetch in `movie.js` |
| Fetch API | `fetch()` used in both apps |
| ES Modules | `type="module"` on all script tags, clean separation of concerns |
| Spread operator | `{ ...movie, imdbRating }` when enriching movie objects |

---

## How to Run

```bash
# Option 1: Open directly
# Double-click index.html — works in any modern browser.

# Option 2: Local dev server (avoids CORS issues in some browsers)
npx serve .
# or
python -m http.server 8080
```

> **Note:** Because the JS files use ES Modules (`type="module"`), open the project via a local server or directly by file — do **not** open via `file://` in Firefox (modules are blocked by default in that context).

---

## Screenshots

| Weather App | Movie Search App |
|---|---|
| Enter any city → get live weather | Enter any movie title → get poster grid |

---

## Technology Stack
- **HTML5** — Semantic markup, single-page structure
- **CSS3** — Custom properties, Grid, Flexbox, responsive breakpoints
- **JavaScript ES6+** — Modules, async/await, destructuring, fetch
- **OpenWeatherMap API** — Real-time weather data
- **OMDB API** — Movie metadata, posters, IMDb ratings

---

## Author
Submitted for Minor Project 03 | Deadline: 20/06/2026

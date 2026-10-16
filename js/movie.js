// ─── movie.js ─────────────────────────────────────────────────────────────────
// Movie Search App — uses OMDB free API
//
// Free API key registration: https://www.omdbapi.com/apikey.aspx
// Free tier: 1,000 requests/day  (no credit card required)
// The key below is a publicly shared demo key from the OMDB docs.
// Replace it with your own key from https://www.omdbapi.com/apikey.aspx

// 🔑 GET YOUR FREE KEY → https://www.omdbapi.com/apikey.aspx  (instant email activation, free)
// Replace the string below with your key after registering.
const OMDB_API_KEY = '9b35addd';


// Build a single movie card element using template literals + destructuring
const createMovieCard = ({ Title, Year, Poster, Type, imdbRating, imdbID }) => {
  const card = document.createElement('article');
  card.className = 'movie-card';

  const hasPoster = Poster && Poster !== 'N/A';
  const posterHTML = hasPoster
    ? `<img class="movie-poster" src="${Poster}" alt="Poster for ${Title}" loading="lazy">`
      + `<div class="movie-poster-placeholder" style="display:none">🎬</div>`
    : `<div class="movie-poster-placeholder">🎬</div>`;

  const ratingHTML =
    imdbRating && imdbRating !== 'N/A'
      ? `<span class="movie-rating">⭐ ${imdbRating}</span>`
      : '';

  card.innerHTML = `
    ${posterHTML}
    <div class="movie-info">
      <div class="movie-title">${Title}</div>
      <div class="movie-meta">
        <span class="movie-year">${Year !== 'N/A' ? Year : '—'}</span>
        ${ratingHTML}
      </div>
      <span class="movie-type-badge">${Type}</span>
    </div>
  `;

  // Fallback: if the <img> fails to load, hide it and show the placeholder
  if (hasPoster) {
    const img         = card.querySelector('.movie-poster');
    const placeholder = card.querySelector('.movie-poster-placeholder');
    img.addEventListener('error', () => {
      img.style.display         = 'none';
      placeholder.style.display = 'flex';
    });
  }

  return card;
};

// Render all search results (array of movie objects)
const renderMovies = (movies) => {
  const grid = document.getElementById('movie-results');
  grid.innerHTML = '';

  if (!movies.length) {
    grid.innerHTML = `<p style="color:var(--muted);grid-column:1/-1;text-align:center;">No results found.</p>`;
    return;
  }

  // Use a DocumentFragment for efficient DOM insertion
  const fragment = document.createDocumentFragment();
  movies.forEach(movie => fragment.appendChild(createMovieCard(movie)));
  grid.appendChild(fragment);
};

// Show / hide helpers
const showMovieError = (msg) => {
  const el = document.getElementById('movie-error');
  el.textContent = msg;
  el.classList.remove('hidden');
};

const hideMovieError = () =>
  document.getElementById('movie-error').classList.add('hidden');

const showMovieLoader = () =>
  document.getElementById('movie-loader').classList.remove('hidden');

const hideMovieLoader = () =>
  document.getElementById('movie-loader').classList.add('hidden');

// Search OMDB by title query
const fetchMovies = async (query) => {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) throw new Error('Network error. Please check your connection.');

  const data = await response.json();

  // OMDB returns { Response: "False", Error: "..." } on no results / bad key
  if (data.Response === 'False') throw new Error(data.Error || 'No results found.');

  return data.Search; // array of movie objects
};

// Enrich results with imdbRating by fetching each movie detail
// (optional extra detail pass — skipped for brevity; OMDB search results
//  don't include imdbRating, so we mark it N/A unless you call the detail endpoint)
const enrichWithRatings = async (movies) => {
  // Limit to first 8 results to avoid burning free API quota
  const subset = movies.slice(0, 8);

  const enriched = await Promise.allSettled(
    subset.map(async (movie) => {
      const url = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=${OMDB_API_KEY}`;
      const res  = await fetch(url);
      const data = await res.json();
      return { ...movie, imdbRating: data.imdbRating ?? 'N/A' };
    })
  );

  // fulfilled → use enriched data; rejected → fall back to original
  return enriched.map((result, i) =>
    result.status === 'fulfilled' ? result.value : { ...subset[i], imdbRating: 'N/A' }
  );
};

// Main search handler
const handleMovieSearch = async () => {
  const input = document.getElementById('movie-input');
  const query = input.value.trim();

  if (!query) {
    showMovieError('Please enter a movie title to search.');
    return;
  }

  hideMovieError();
  document.getElementById('movie-results').innerHTML = '';
  showMovieLoader();

  try {
    const movies  = await fetchMovies(query);
    const enriched = await enrichWithRatings(movies);
    renderMovies(enriched);
  } catch (err) {
    showMovieError(`❌ ${err.message || 'Something went wrong. Please try again.'}`);
    document.getElementById('movie-results').innerHTML = '';
  } finally {
    hideMovieLoader();
  }
};

// ─── Event Listeners ──────────────────────────────────────────────────────────
document.getElementById('movie-search-btn')
  .addEventListener('click', handleMovieSearch);

document.getElementById('movie-input')
  .addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleMovieSearch();
  });

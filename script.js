// ===============================
// Movie Review Finder
// ===============================

// Replace with your OMDb API Key
const OMDB_API_KEY = "58e044e4";
const OMDB_BASE_URL = "https://www.omdbapi.com/";

// Cache for movie details
const movieCache = new Map();

// ===============================
// DOM Elements
// ===============================
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const loader = document.getElementById("loader");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const resultsSection = document.getElementById("resultsSection");
const resultsGrid = document.getElementById("resultsGrid");
const emptyState = document.getElementById("emptyState");

// Modal
const modal = document.getElementById("movieModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalLoader = document.getElementById("modalLoader");
const modalPoster = document.getElementById("modalPoster");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const modalRated = document.getElementById("modalRated");
const modalRuntime = document.getElementById("modalRuntime");
const modalRating = document.getElementById("modalRating");
const modalGenre = document.getElementById("modalGenre");
const modalPlot = document.getElementById("modalPlot");
const modalDirector = document.getElementById("modalDirector");
const modalActors = document.getElementById("modalActors");

// ===============================
// Event Listeners
// ===============================
searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (e) => { if (e.key === "Enter") handleSearch(); });
modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });

// ===============================
// Fetch Helper
// ===============================
async function fetchMovie(params) {
  const url = `${OMDB_BASE_URL}?apikey=${OMDB_API_KEY}&${params}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Network request failed.");
  const data = await response.json();
  if (data.Response === "False") throw new Error(data.Error);
  return data;
}

// ===============================
// Search Movies
// ===============================
async function handleSearch() {
  const query = searchInput.value.trim();
  if (!query) { showError("Please enter a movie title."); return; }

  hideError(); hideResults(); resultsGrid.innerHTML = ""; hideEmptyState(); showLoader();
  searchButton.disabled = true; searchButton.textContent = "Searching...";

  try {
    const data = await fetchMovie(`s=${encodeURIComponent(query)}&type=movie`);
    displayResults(data.Search);
  } catch (error) {
    console.error(error); showError(error.message);
  } finally {
    hideLoader(); searchButton.disabled = false;
    searchButton.innerHTML = `<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg> Search`;
  }
}

// ===============================
// Display Results
// ===============================
function displayResults(movies) {
  resultsGrid.innerHTML = "";
  movies.forEach((movie, index) => {
    const card = createMovieCard(movie, index);
    resultsGrid.appendChild(card);
  });
  showResults();
}

// ===============================
// Create Movie Card
// ===============================
function createMovieCard(movie, index) {
  const card = document.createElement("div");
  card.className = "movie-card";
  card.dataset.imdbId = movie.imdbID;
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View details for ${movie.Title}`);
  card.style.animationDelay = `${index * 0.05}s`;

  const hasPoster = movie.Poster && movie.Poster !== "N/A";
  if (hasPoster) {
    card.innerHTML = `
      <img src="${movie.Poster}" alt="${escapeHtml(movie.Title)} poster"
           loading="lazy" decoding="async"
           onerror="this.src='https://placehold.co/300x450?text=No+Image'">
      <div class="movie-card-overlay">
        <div class="movie-card-title">${escapeHtml(movie.Title)}</div>
        <div class="movie-card-year">${movie.Year}</div>
      </div>`;
  } else {
    card.innerHTML = `
      <div class="movie-card-no-poster">🎬</div>
      <div class="movie-card-overlay" style="opacity:1;">
        <div class="movie-card-title">${escapeHtml(movie.Title)}</div>
        <div class="movie-card-year">${movie.Year}</div>
      </div>`;
  }

  card.addEventListener("click", () => openMovieDetails(movie.imdbID));
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openMovieDetails(movie.imdbID); }
  });

  return card;
}

// ===============================
// Open Movie Details
// ===============================
async function openMovieDetails(imdbId) {
  showModalLoader();
  try {
    let movie;
    if (movieCache.has(imdbId)) {
      movie = movieCache.get(imdbId);
    } else {
      movie = await fetchMovie(`i=${encodeURIComponent(imdbId)}&plot=full`);
      movieCache.set(imdbId, movie);
    }
    populateModal(movie);
    showModal();
  } catch (error) {
    console.error(error); showError(error.message);
  } finally {
    hideModalLoader();
  }
}

// ===============================
// Populate Modal
// ===============================
function populateModal(movie) {
  modalPoster.src = (movie.Poster && movie.Poster !== "N/A") ? movie.Poster : "https://placehold.co/300x450?text=No+Poster";
  modalPoster.alt = `${movie.Title} Poster`;

  modalTitle.textContent = movie.Title;
  modalYear.textContent = movie.Year || "N/A";
  modalRated.textContent = movie.Rated || "N/A";
  modalRuntime.textContent = movie.Runtime || "N/A";

  modalRating.innerHTML = (movie.imdbRating && movie.imdbRating !== "N/A")
    ? `⭐ <strong>${movie.imdbRating}/10</strong> <span class="rating-source">IMDb (${movie.imdbVotes})</span>`
    : "No rating available.";

  modalGenre.innerHTML = (movie.Genre && movie.Genre !== "N/A")
    ? movie.Genre.split(", ").map(genre => `<span class="genre-tag">${genre}</span>`).join("")
    : "";

  modalPlot.textContent = movie.Plot !== "N/A" ? movie.Plot : "No plot available.";
  modalDirector.innerHTML = movie.Director !== "N/A" ? `<strong>Director:</strong> ${escapeHtml(movie.Director)}` : "";
  modalActors.innerHTML = movie.Actors !== "N/A" ? `<strong>Cast:</strong> ${escapeHtml(movie.Actors)}` : "";
}

// ===============================
// Modal Controls
// ===============================
function showModal() {
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  modalClose.focus();
}
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
  modalPoster.src = ""; modalTitle.textContent = ""; modalYear.textContent = "";
  modalRated.textContent = ""; modalRuntime.textContent = ""; modalRating.innerHTML = "";
  modalGenre.innerHTML = ""; modalPlot.textContent = ""; modalDirector.innerHTML = ""; modalActors.innerHTML = "";
  searchInput.focus();
}
function showModalLoader() { modalLoader.classList.remove("hidden"); }
function hideModalLoader() { modalLoader.classList.add("hidden"); }

// ===============================
// Utility Functions
// ===============================
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===============================
// Loading Helpers
// ===============================
function showLoader() { loader.classList.remove("hidden"); }
function hideLoader() { loader.classList.add("hidden"); }

// ===============================
// Error Helpers
// ===============================
function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove("hidden");
  errorMessage.scrollIntoView({ behavior: "smooth", block: "center" });
}
function hideError() { errorMessage.classList.add("hidden"); }

// ===============================
// Results Helpers
// ===============================
function showResults() {
  resultsSection.classList.remove("hidden");
}
function hideResults() {
  resultsSection.classList.add("hidden");
}

// ===============================
// Empty State
// ===============================
function showEmptyState() {
  emptyState.classList.remove("hidden");
}
function hideEmptyState() {
  emptyState.classList.add("hidden");
}

// ===============================
// Debounce
// ===============================
function debounce(callback, delay = 500) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => { callback(...args); }, delay);
  };
}

// ===============================
// Live Search
// ===============================
const debouncedSearch = debounce(() => {
  const value = searchInput.value.trim();
  if (value.length >= 3) {
    handleSearch();
  }
}, 600);

searchInput.addEventListener("input", debouncedSearch);

// ===============================
// Initial Page Setup
// ===============================
window.addEventListener("DOMContentLoaded", () => {
  searchInput.focus();
  showEmptyState();
});

// ===============================
// Network Status
// ===============================
window.addEventListener("offline", () => {
  showError("You are offline. Please check your internet connection.");
});
window.addEventListener("online", () => {
  hideError();
});

// ===============================
// Clear Search (Ctrl + Backspace)
// ===============================
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "Backspace") {
    searchInput.value = "";
    resultsGrid.innerHTML = "";
    hideResults();
    showEmptyState();
    hideError();
    searchInput.focus();
  }
});

// ===============================
// Image Error Fallback
// ===============================
document.addEventListener("error", (e) => {
  const target = e.target;
  if (target.tagName === "IMG") {
    target.src = "https://placehold.co/300x450?text=No+Image";
  }
}, true);

// ===============================
// End of Script
// ===============================

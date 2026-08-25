function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}

function createMovieCard(movie, index, openMovieDetails) {
  const card = document.createElement("div");

  card.className = "movie-card";
  card.style.animationDelay = `${index * 0.05}s`;

  const hasPoster = movie.Poster && movie.Poster !== "N/A";

  if (hasPoster) {
    card.innerHTML = `
      <img 
        src="${movie.Poster}" 
        alt="${escapeHtml(movie.Title)} poster"
        loading="lazy"
        onerror="this.src='assets/images/no-poster.png'"
      >
      <div class="movie-card-overlay">
        <div class="movie-card-title">
          ${escapeHtml(movie.Title)}
        </div>
        <div class="movie-card-year">
          ${escapeHtml(movie.Year)}
        </div>
      </div>
    `;
  } else {
    card.innerHTML = `
      <div class="movie-card-no-poster"> 🎬 </div>
      <div class="movie-card-overlay" style="opacity:1;">
        <div class="movie-card-title">
          ${escapeHtml(movie.Title)}
        </div>
        <div class="movie-card-year">
          ${escapeHtml(movie.Year)}
        </div>
      </div>
    `;
  }

  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View details for ${movie.Title}`);

  card.addEventListener("click", () => {
    openMovieDetails(movie.imdbID);
  });

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMovieDetails(movie.imdbID);
    }
  });

  return card;
}

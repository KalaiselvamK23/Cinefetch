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

// Open Movie Details

async function openMovieDetails(imdbID) {
try {
modalLoader.classList.remove("hidden");
modal.classList.remove("hidden");

```
const movie = await getMovieDetails(imdbID);

if (movie.Response === "False") {
  throw new Error(movie.Error || "Unable to load movie details.");
}

displayMovieDetails(movie);
```

} catch (error) {
console.error("Movie details error:", error);

```
modal.classList.add("hidden");

showError(
  error.message || "Unable to load movie details."
);
```

} finally {
modalLoader.classList.add("hidden");
}
}

// Display Movie Details

function displayMovieDetails(movie) {

modalPoster.src =
movie.Poster && movie.Poster !== "N/A"
? movie.Poster
: "assets/images/no-poster.png";

modalPoster.alt = `${movie.Title} poster`;

modalTitle.textContent = movie.Title || "Unknown Title";
modalYear.textContent = movie.Year || "";
modalRated.textContent = movie.Rated || "";
modalRuntime.textContent = movie.Runtime || "";

modalRating.textContent =
movie.imdbRating && movie.imdbRating !== "N/A"
? `⭐ IMDb: ${movie.imdbRating}/10`
: "";

modalGenre.textContent =
movie.Genre && movie.Genre !== "N/A"
? movie.Genre
: "";

modalPlot.textContent =
movie.Plot && movie.Plot !== "N/A"
? movie.Plot
: "Plot information not available.";

modalDirector.textContent =
movie.Director && movie.Director !== "N/A"
? `Director: ${movie.Director}`
: "";

modalActors.textContent =
movie.Actors && movie.Actors !== "N/A"
? `Cast: ${movie.Actors}`
: "";
}

// Close Modal

function closeModal() {
modal.classList.add("hidden");
}

// Close Button

modalClose.addEventListener("click", closeModal);

// Overlay Click

modalOverlay.addEventListener("click", closeModal);

// Escape Key

document.addEventListener("keydown", (event) => {
if (event.key === "Escape" && !modal.classList.contains("hidden")) {
closeModal();
}
});

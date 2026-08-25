const OMDB_BASE_URL = "https://www.omdbapi.com/";

async function searchMovies(query) {
  if (
    !CONFIG.OMDB_API_KEY ||
    CONFIG.OMDB_API_KEY === "YOUR_API_KEY_HERE"
  ) {
    throw new Error(
      "API key is missing. Please add your OMDb API key."
    );
  }

  const url =
    `${OMDB_BASE_URL}?apikey=${CONFIG.OMDB_API_KEY}` +
    `&s=${encodeURIComponent(query)}&type=movie`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to reach OMDb server.");
  }

  return await response.json();
}

async function getMovieDetails(id) {
  if (
    !CONFIG.OMDB_API_KEY ||
    CONFIG.OMDB_API_KEY === "YOUR_API_KEY_HERE"
  ) {
    throw new Error(
      "API key is missing. Please add your OMDb API key."
    );
  }

  const url =
    `${OMDB_BASE_URL}?apikey=${CONFIG.OMDB_API_KEY}` +
    `&i=${encodeURIComponent(id)}&plot=full`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to reach OMDb server.");
  }

  return await response.json();
}

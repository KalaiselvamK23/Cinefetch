const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

const loader = document.getElementById('loader');

const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');

const resultsSection = document.getElementById('resultsSection');
const resultsGrid = document.getElementById('resultsGrid');

const emptyState = document.getElementById('emptyState');

let isLoading = false;


// Search Events

searchButton.addEventListener('click', handleSearch);

searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});


// Search Function

async function handleSearch() {

    if (isLoading) {
        return;
    }

    const query = searchInput.value.trim();

    if (!query) {

        showError('Please enter a movie name');

        return;
    }


    isLoading = true;

    hideError();
    hideEmptyState();
    hideResults();

    resultsGrid.innerHTML = '';

    showLoader();


    try {

        const data = await searchMovies(query);


        if (data.Response === 'False') {

            showError(data.Error || 'No movies found');

            return;
        }


        displayResults(data.Search);


    } catch (error) {

        console.error('Search error:', error);

        showError(
            error.message || 'Something went wrong. Please try again.'
        );


    } finally {

        hideLoader();

        isLoading = false;

    }
}


// Display Movie Results

function displayResults(movies) {

    resultsGrid.innerHTML = '';


    movies.forEach((movie, index) => {

        const card = createMovieCard(
            movie,
            index,
            openMovieDetails
        );


        resultsGrid.appendChild(card);

    });


    resultsSection.classList.remove('hidden');
}


// Loader Functions

function showLoader() {

    loader.classList.remove('hidden');

}


function hideLoader() {

    loader.classList.add('hidden');

}


// Error Functions

function showError(message) {

    errorText.textContent = message;

    errorMessage.classList.remove('hidden');

}


function hideError() {

    errorMessage.classList.add('hidden');

}


// Section Visibility Functions

function hideEmptyState() {

    emptyState.classList.add('hidden');

}


function hideResults() {

    resultsSection.classList.add('hidden');

}
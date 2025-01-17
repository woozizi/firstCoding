import { fetchMovies, fetchMovieDetail, fetchAllMovies } from "./api.js";
import { renderMovies, renderBookmark, openModal } from "./ui.js";

let currentStatus = 'main';
let currentMovies = [];

//시작하기
async function start() {
  currentStatus = 'main';
  currentMovies = await fetchMovies();
  renderMovies(currentMovies);
}

start();

//검색하기
async function handleSearchInput(e) {
  const searchText = e.target.value.trim().toLowerCase();
  if (searchText === '') {
    renderMovies(currentMovies);
  } else {
    const searchResults = await fetchAllMovies(searchText);
    renderMovies(searchResults || []);
  }
};

//검색창
document.getElementById('search-input').addEventListener('input', handleSearchInput);

//메인 가기
document.getElementById('main').addEventListener('click', (e) => {
  currentStatus = 'main';
  start()
});

//상세정보
document.getElementById('movies-container').addEventListener('click', async (e) => {
  const movieCard = e.target.closest('.movie-card');
  if (movieCard) {
    const details = await fetchMovieDetail(movieCard.dataset.id);
    openModal(details, currentStatus, start, renderBookmark);
  }
});

//북마크보기로 가기
document.getElementById('bookmark').addEventListener('click', () => {
  currentStatus = 'bookmark';
  renderBookmark();
});


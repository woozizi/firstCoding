import { addBookMark, removeBookmark, getBookmark } from "./storage.js";

const noImage = "https://via.placeholder.com/200";

//랜더링
export async function renderMovies(movies) {
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';
  console.log("랜더링할 영화 : ", movies);

  movies.forEach((movie) => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : noImage;

    const movieCard = `
      <div class="movie-card" data-id=${movie.id}>
        <img src="${posterUrl}" alt="${movie.title}" />
        <h2>${movie.title}</h2>
        <p>평점:${movie.vote_average}</p>
      </div>
    `;

    moviesContainer.innerHTML += movieCard;
  });
}

//모달창열기
export function openModal(details, currentStatus, start, renderBookmark) {
  const modal = document.getElementById('movie-modal');
  const modalDetails = document.getElementById('modal-details');
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : noImage;

  const bookmark = getBookmark();
  const isBookmarked = bookmark.some(movie => movie.id === details.id);

  modalDetails.innerHTML = `
    <img src="${posterUrl}" alt="${details.title}" />
    <h2>${details.title}</h2>
    <p> ${details.overview}</p>
    <p><span style="font-weight: bold;">개봉일:</span> ${details.release_date}</p>
    <p><span style="font-weight: bold;">평점:</span> ${details.vote_average}</p>
    <button class= "bookmarkAdd-button">${isBookmarked ? '북마크 삭제' : '북마크 추가'}</button>
  `;
  modal.style.display = 'flex';

  //북마크 추가 삭제 버튼
  modal.querySelector('.bookmarkAdd-button').addEventListener('click', () => {
    if (isBookmarked) {
      removeBookmark(details.id);
      alert('북마크에서 삭제되었습니다.');
    } else {
      addBookMark(details);
      alert('북마크에 추가되었습니다.');
    }
    if (currentStatus === 'bookmark') {
      renderBookmark();
    } else if (currentStatus === 'main') {
      start();
    }

    openModal(details, currentStatus, start, renderBookmark);
  });

  //닫기 버튼
  const closeButton = modal.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    if(currentStatus === 'bookmark') {
      renderBookmark();
    }
  });
}

//북마크보기
export function renderBookmark() {
  const bookmark = getBookmark();
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';

  if (bookmark.length === 0) {
    alert("북마크한 영화가 없습니다");
    return;
  }
  bookmark.forEach((movie) => {
    const movieCard = `
      <div class="movie-card" data-id=${movie.id}>
        <img src="${movie.poster}" alt="${movie.title}" />
        <h2>${movie.title}</h2>
        <p>평점: ${movie.vote_average}</p>
      </div>
    `;
    moviesContainer.innerHTML += movieCard;
  });
};
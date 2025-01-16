
const noImage = "https://via.placeholder.com/200";

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNDY5YWJiMDBjZDY2M2M4NjQ5ZjU5MmE3MDJhZjYwZSIsIm5iZiI6MTczNjI5OTgzMi40NzksInN1YiI6IjY3N2RkNTM4MTI2Njc5Njg4NTRlNTY1MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7zSxWoUEq4McxfgUNwxRFnt5diGifWmQZ3a9LDbt2O0'
  }
};

let currentStatus = 'main';
//메인 가기
document.getElementById('main').addEventListener('click', (e) => { start() });

//영화 가져오기
async function fetchMovies() {
  const url = 'https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1&region=KO';
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(`오류 발생: ${res.status}`);
    }

    return data.results;
  } catch (err) {
    console.log('오류 발생 : ', err);
    alert('데이터 불러오기에 실패입니다.')
    return null;
  }
}

//상세정보
async function fetchMovieDetail(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}?language=ko-KR`;
  try {
    const res = await fetch(url, options)
    const data = await res.json();

    console.log("데이터확인 : ", data);
    if (!res.ok) {
      throw new Error(`오류 발생: ${res.status}`);
    }
    return data;

  } catch (err) {
    console.log('오류 발생 : ', err);
    alert('데이터 불러오기 실패입니다.')
    return null;
  }

}

//모달창열기
function openModal(details) {
  const modal = document.getElementById('movie-modal');
  const modalDetails = document.getElementById('modal-details');
  const posterUrl = details.poster_path
    ? `https://image.tmdb.org/t/p/w500${details.poster_path}`
    : noImage;

  const bookmark = JSON.parse(localStorage.getItem('bookmark')) || [];
  const isBookmarked = bookmark.some(movie => movie.id === details.id);

  modalDetails.innerHTML = `
    <img src="${posterUrl}" alt="${details.title}" />
    <h2>${details.title}</h2>
    <p> ${details.overview}</p>
    <p><span style="font-weight: bold;">개봉일:</span> ${details.release_date}</p>
    <p><span style="font-weight: bold;">평점:</span> ${details.vote_average}</p>
    <button class= "bmAdd-button">${isBookmarked ? '북마크 삭제' : '북마크 추가'}</button>
  `;
  modal.style.display = 'flex';

  //북마크 추가 삭제 버튼
  const bookmarkAdd = modal.querySelector('.bmAdd-button');
  bookmarkAdd.addEventListener('click', () => {
    
    if (bookmarkAdd.textContent === '북마크 추가') {
      addBookMark(details);
      bookmarkAdd.textContent = '북마크 삭제'; 
      alert('북마크에 추가되었습니다.');
    } else if (bookmarkAdd.textContent === '북마크 삭제') {
      removeBookmark(details.id);
      bookmarkAdd.textContent = '북마크 추가'; 
      alert('북마크에서 삭제되었습니다.');
    }
  });

  //닫기 버튼
  const closeButton = modal.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    modalDetails.innerHTML = '';
  });
}

//북마크추가
function addBookMark(movie) {
  const bookmark = JSON.parse(localStorage.getItem('bookmark') || '[]');

  if (!bookmark.some(item => item.id === movie.id)) {
    bookmark.push({
      id: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      vote_average: movie.vote_average
    });
    localStorage.setItem('bookmark', JSON.stringify(bookmark));
  }
};


//북마크 삭제
function removeBookmark(id) {
  const bookmark = JSON.parse(localStorage.getItem('bookmark')) || [];
  const updateBookmark = bookmark.filter(movie => movie.id !== id);
  localStorage.setItem('bookmark', JSON.stringify(updateBookmark));

  if (currentStatus === 'main') {
    start();
  } else if (currentStatus === 'bookmark') {
    renderBookmark();
  };
};


//북마크보기
function renderBookmark() {
  currentStatus = 'bookmark';
  const bookmark = JSON.parse(localStorage.getItem('bookmark')) || [];
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';

  if (bookmark.length === 0) {
    alert("북마크한 영화가 없습니다");
    start();
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

document.getElementById('bookmark').addEventListener('click', () => { renderBookmark() })



//랜더링
async function renderMovies(movies) {
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';

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



//상세정보 가져오기
async function clickMovie(e) {
  const movieCard = e.target.closest('.movie-card');
  if (!movieCard) return;

  const movieId = movieCard.dataset.id;
  console.log("영화 ID : ", movieId)
  try {
    const details = await fetchMovieDetail(movieId);
    openModal(details);
  } catch (err) {
    console.log('오류 발생 : ', err);
    alert('데이터 불러오기 실패입니다.')
  }
}

document.getElementById('movies-container').addEventListener('click', clickMovie);



//영화 검색 
function filterMovies(movies, searchText) {
  return movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );
}

//시작
async function start() {
  currentStatus = 'main';
  const movies = await fetchMovies();
  const searchInput = document.getElementById('search-input');

  renderMovies(movies);

  document.getElementById('search-input').addEventListener('input', () => {
    const filteredMovies = filterMovies(movies, searchInput.value);
    renderMovies(filteredMovies);
  });

}

start();
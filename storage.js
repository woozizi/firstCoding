//북마크추가
export function addBookMark(movie) {
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
export function removeBookmark(id) {
  const bookmark = JSON.parse(localStorage.getItem('bookmark')) || [];
  const updateBookmark = bookmark.filter(movie => movie.id !== id);
  localStorage.setItem('bookmark', JSON.stringify(updateBookmark));
};

//북마크 가져오기
export function getBookmark() {
  return JSON.parse(localStorage.getItem('bookmark') || '[]');
};
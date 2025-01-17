const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNDY5YWJiMDBjZDY2M2M4NjQ5ZjU5MmE3MDJhZjYwZSIsIm5iZiI6MTczNjI5OTgzMi40NzksInN1YiI6IjY3N2RkNTM4MTI2Njc5Njg4NTRlNTY1MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.7zSxWoUEq4McxfgUNwxRFnt5diGifWmQZ3a9LDbt2O0'
  }
};

//영화 가져오기
export async function fetchMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?language=ko-KR`;
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
//검색영화 가져오기
export async function fetchAllMovies(query) {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&language=ko-KR`;
  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(data);
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
export async function fetchMovieDetail(id) {
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
    throw err;
  }

}
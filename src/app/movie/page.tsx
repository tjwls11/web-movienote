'use client'
import { useState, useEffect } from 'react'

interface Movie {
  id: number
  title: string
  release_date: string
  vote_average: number
  poster_path: string
  genres: { id: number; name: string }[] // 장르 정보
  original_language: string // 원본 언어 (한국어, 영어 등)
}

type Genre = 28 | 35 | 18 | 878 | 16 | 53 | 27 | 10749 | 14 | null // 장르 타입 정의

export default function MoviePage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]) // 필터링된 영화 리스트
  const [error, setError] = useState<string | null>(null)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('') // 검색어 상태
  const [sortOption, setSortOption] = useState<string>('rating') // 정렬 옵션 (별점순)
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null) // 장르 선택 (string | null 타입)
  const [selectedOTT, setSelectedOTT] = useState<string | null>(null) // OTT 선택

  const API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY
  const BASE_URL = 'https://api.themoviedb.org/3/movie/now_playing'

  useEffect(() => {
    const fetchMovies = async () => {
      if (!API_KEY) {
        setError('API 키가 없습니다.')
        return
      }
      try {
        const response = await fetch(
          `${BASE_URL}?api_key=${API_KEY}&language=ko-KR&page=${pageNumber}`
        )
        if (!response.ok) {
          throw new Error('영화 데이터를 가져오는 중 오류가 발생했습니다.')
        }
        const data = await response.json()
        setMovies(data.results)
      } catch (err) {
        setError('영화 데이터를 가져오는 중 오류가 발생했습니다.')
      }
    }
    fetchMovies()
  }, [pageNumber, API_KEY])

  useEffect(() => {
    let filtered = [...movies]

    // 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 장르 필터링
    if (selectedGenre !== null) {
      // selectedGenre를 숫자로 변환하여 필터링
      const genreId = Number(selectedGenre)
      filtered = filtered.filter((movie) =>
        movie.genres.some((genre) => genre.id === genreId)
      )
    }

    // OTT 필터링 (OTT 정보는 API에서 제공되지 않으므로 예시로 구현)
    if (selectedOTT) {
      filtered = filtered.filter((movie) =>
        movie.title.toLowerCase().includes(selectedOTT.toLowerCase())
      )
    }

    // 정렬 (별점순)
    if (sortOption === 'rating') {
      filtered = filtered.sort((a, b) => b.vote_average - a.vote_average)
    }

    // 한국영화 필터링
    if (sortOption === 'korean' || selectedGenre === null) {
      filtered = filtered.filter((movie) => movie.original_language === 'ko')
    }

    // 외국영화 필터링
    if (sortOption === 'foreign') {
      filtered = filtered.filter((movie) => movie.original_language !== 'ko')
    }

    setFilteredMovies(filtered)
  }, [movies, searchTerm, sortOption, selectedGenre, selectedOTT, pageNumber])

  const handlePageChange = (page: number) => {
    setPageNumber(page)
  }

  // 장르 목록
  const genres = {
    28: '액션',
    35: '코미디',
    18: '드라마',
    878: 'SF',
    16: '애니메이션',
    53: '스릴러',
    27: '공포',
    10749: '로맨스',
    14: '판타지',
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-semibold text-center mb-8">영화 목록</h1>

      {error && <div className="text-red-500 text-center">{error}</div>}

      {/* 검색 기능 */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="영화 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        />
      </div>

      {/* 정렬 기능 */}
      <div className="flex justify-center gap-4 mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="rating">별점순</option>
          <option value="korean">한국영화</option>
          <option value="foreign">외국영화</option>
        </select>
      </div>

      {/* 장르 선택 */}
      <div className="flex justify-center gap-4 mb-4">
        <select
          value={selectedGenre || ''}
          onChange={(e) => setSelectedGenre(e.target.value)} // selectedGenre를 string으로 다룸
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">모든 장르</option>
          {Object.keys(genres).map((genreId) => (
            <option key={genreId} value={genreId}>
              {genres[genreId as unknown as keyof typeof genres]}
            </option>
          ))}
        </select>
      </div>

      {/* OTT 선택 (예시로 구현) */}
      <div className="flex justify-center gap-4 mb-4">
        <select
          value={selectedOTT ?? ''}
          onChange={(e) => setSelectedOTT(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">모든 OTT</option>
          <option value="netflix">넷플릭스</option>
          <option value="disneyplus">디즈니+</option>
        </select>
      </div>

      {/* 영화 카드 출력 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredMovies.length > 0 ? (
          filteredMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition duration-300"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2">{movie.title}</h2>
                <p className="text-sm text-gray-600">
                  개봉일: {movie.release_date}
                </p>
                <p className="text-sm text-gray-800 font-semibold">
                  평점: {movie.vote_average}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">
            영화를 로딩 중입니다...
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-8">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="px-4 py-2 mx-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
        >
          이전
        </button>
        <span className="text-xl font-semibold">{pageNumber}</span>
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          className="px-4 py-2 mx-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          다음
        </button>
      </div>
    </div>
  )
}

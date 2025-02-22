'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Movie 컴포넌트에서 사용될 타입 정의
interface Movie {
  id: number
  title: string
  vote_average: number
  poster_path: string
}

const genreTranslations: { [key: number]: string } = {
  28: '액션',
  12: '모험',
  16: '애니메이션',
  35: '코미디',
  80: '범죄',
  99: '다큐멘터리',
  18: '드라마',
  10751: '가족',
  14: '판타지',
  36: '역사',
  27: '공포',
  10402: '음악',
  9648: '미스터리',
  10749: '로맨스',
  878: 'SF',
  10770: 'TV 영화',
  53: '스릴러',
  10752: '전쟁',
  37: '서부',
}

export default function Movie() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const router = useRouter()

  const [allMovies, setAllMovies] = useState<Movie[]>([]) // 전체 영화 상태 추가
  const [movies, setMovies] = useState<Movie[]>([]) // 현재 페이지에 표시할 영화 상태
  const [page, setPage] = useState<number>(1)
  const [genre, setGenre] = useState<string>('all')
  const [totalPages, setTotalPages] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>('') // 검색 쿼리 상태 추가

  const apiKey = process.env.NEXT_PUBLIC_MOVIE_API_KEY

  // 영화 목록 불러오기
  const fetchMovies = async (
    newPage: number,
    newGenre: string,
    query: string
  ) => {
    try {
      let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${newPage}&sort_by=popularity.desc&adult=false&region=KR&language=ko-KR`

      if (newGenre !== 'all') {
        url += `&with_genres=${newGenre}`
      }

      if (query) {
        // 검색 쿼리가 있을 경우 search/movie 엔드포인트 사용
        url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&page=${newPage}&language=ko-KR`
      }

      const response = await axios.get(url)
      setAllMovies(response.data.results) // 전체 영화 저장
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.error('영화 목록을 불러오는 데 실패했습니다:', error)
    }
  }

  // 컴포넌트가 마운트될 때, 또는 페이지나 장르가 변경될 때 영화 목록을 불러옴
  useEffect(() => {
    fetchMovies(page, genre, searchQuery)
  }, [page, genre, searchQuery])

  // 장르 변경 시 드롭다운으로 변경
  const handleGenreChange = (newGenre: string) => {
    setGenre(newGenre)
    setPage(1) // 페이지를 1로 초기화
  }

  // 영화 카드 컴포넌트
  const MovieCard = ({ movie }: { movie: Movie }) => {
    const handleMovieClick = async () => {
      try {
        const saveResponse = await fetch(`/api/user/recent-movie`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: session?.user?.name || 'Anonymous',
            movieId: movie.id,
          }),
        })

        const saveData = await saveResponse.json()
        if (saveResponse.ok) {
          console.log('영화가 성공적으로 저장되었습니다.')
          router.push(`/movie/${movie.id}`)
        } else {
          console.error('영화 저장 실패:', saveData.message || 'Unknown error')
        }
      } catch (error) {
        console.error('영화 저장 중 오류 발생:', error)
      }
    }

    return (
      <div
        onClick={handleMovieClick}
        className="bg-white rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer w-64 m-4 flex flex-col items-center border border-gray-300"
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-32 h-48 object-cover mt-5"
        />
        <div className="p-4 h-full flex flex-col justify-between items-center">
          <p className="text-gray-600 text-center">
            평점: {movie.vote_average}
          </p>
          <h3 className="text-xl font-semibold text-center text-black mt-2">
            {movie.title}
          </h3>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-20 py-10">
      <div className="mb-12 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-left mb-6">영화 목록</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="제목으로 검색"
            className="text-lg font-medium p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setSearchQuery(e.target.value)} // 검색 쿼리 업데이트
          />
          <select
            className="text-lg font-medium p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 ml-4"
            onChange={(e) => handleGenreChange(e.target.value)} // 장르 변경
          >
            {Object.entries(genreTranslations).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
            <option value="all">전체</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {allMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-12 space-x-4">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            이전
          </button>
        )}
        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            다음
          </button>
        )}
      </div>
    </div>
  )
}

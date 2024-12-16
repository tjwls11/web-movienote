'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useSession } from 'next-auth/react' // next-auth에서 useSession 가져오기
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
  const { data: session } = useSession() // 세션 정보 가져오기
  const userId = session?.user?.id // 사용자 ID 가져오기
  const router = useRouter() // Next.js의 useRouter 사용

  const [movies, setMovies] = useState<Movie[]>([]) // 타입 명시
  const [page, setPage] = useState<number>(1) // 페이지 타입 명시
  const [genre, setGenre] = useState<string>('all') // 장르 타입 명시
  const [totalPages, setTotalPages] = useState<number>(0)

  const apiKey = process.env.NEXT_PUBLIC_MOVIE_API_KEY

  // 영화 목록 불러오기
  const fetchMovies = async (newPage: number, newGenre: string) => {
    try {
      const genreFilter = newGenre !== 'all' ? `&with_genres=${newGenre}` : ''
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&page=${newPage}&sort_by=popularity.desc&adult=false${genreFilter}&region=KR&language=ko-KR`
      )
      setMovies(response.data.results)
      setTotalPages(response.data.total_pages)
    } catch (error) {
      console.error('Failed to fetch movies:', error)
    }
  }

  // 컴포넌트가 마운트될 때, 또는 페이지나 장르가 변경될 때 영화 목록을 불러옴
  useEffect(() => {
    fetchMovies(page, genre)
  }, [page, genre])

  // 장르 변경 시 드롭다운으로 변경
  const handleGenreChange = (newGenre: string) => {
    setGenre(newGenre)
    setPage(1) // 페이지를 1로 초기화
  }

  // 영화 카드 컴포넌트
  const MovieCard = ({ movie }: { movie: Movie }) => {
    const handleMovieClick = async () => {
      if (!userId) {
        console.error('사용자 ID가 없습니다.')
        return
      }

      try {
        const saveResponse = await fetch(`/api/user/recent-movie`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: session?.user?.name, // 사용자 이름
            movieId: movie.id, // 영화 ID
          }),
        })

        const saveData = await saveResponse.json()
        if (saveResponse.ok) {
          console.log('영화가 성공적으로 저장되었습니다.')
          // 영화 저장 후 상세 페이지로 이동
          router.push(`/movie/${movie.id}`)
        } else {
          console.error('영화 저장 실패:', saveData.message || 'Unknown error')
          console.error('Response:', saveData) // Log the response for debugging
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
          width={100}
          height={150}
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
    <div className="container mx-auto px-20 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-left mb-6">영화 목록</h1>
        <div className="flex justify-start mt-4">
          <select
            className="text-lg font-medium p-2 border rounded"
            onChange={(e) => handleGenreChange(e.target.value)}
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
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-12 space-x-4">
        {page > 1 && (
          <button
            onClick={() => {
              const newPage = page - 1
              setPage(newPage)
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            이전
          </button>
        )}
        {page < totalPages && (
          <button
            onClick={() => {
              const newPage = page + 1
              setPage(newPage)
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            다음
          </button>
        )}
      </div>
    </div>
  )
}

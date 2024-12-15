// src/components/Movie.tsx

'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'

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
    return (
      <Link href={`/movie/${movie.id}`}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} // 포스터 경로 확인
            alt={movie.title}
            className="w-full h-80 object-cover"
          />
          <div className="p-4">
            <p className="text-gray-600 text-center">
              Rating: {movie.vote_average}
            </p>
            <h3 className="text-xl font-semibold text-center">{movie.title}</h3>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-left">영화 목록</h1>
        <div className="flex justify-start mt-4">
          <select
            className="text-lg font-medium"
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

      <div className="grid grid-cols-5 gap-8">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        {page > 1 && (
          <button
            onClick={() => {
              const newPage = page - 1
              setPage(newPage)
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
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
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            다음
          </button>
        )}
      </div>
    </div>
  )
}
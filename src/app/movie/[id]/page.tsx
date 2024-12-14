import React from 'react'

interface MovieDetail {
  id: number
  title: string
  overview: string
  release_date: string
  vote_average: number
  poster_path: string
}

export default async function MoviePage({
  params,
}: {
  params: { id: string }
}) {
  const apiKey = process.env.NEXT_PUBLIC_MOVIE_API_KEY

  // params를 비동기적으로 가져오기
  const { id } = await params // params를 await하여 id를 가져옵니다.

  // TMDB API 호출
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=ko-KR`,
    { next: { revalidate: 60 } } // 캐시 재검증 (60초)
  )

  if (!response.ok) {
    console.error('Failed to fetch movie:', response.statusText)
    return (
      <div className="text-center mt-20 text-gray-600">
        영화를 불러올 수 없습니다. 다시 시도해주세요.
      </div>
    )
  }

  const movie: MovieDetail = await response.json()

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-start">
      {/* 영화 포스터 */}
      <div className="md:w-1/3 mb-6 md:mb-0">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>
      {/* 영화 정보 */}
      <div className="md:w-2/3 md:pl-8">
        <h1 className="text-3xl font-bold text-gray-800">{movie.title}</h1>
        <p className="mt-2 text-gray-600">개봉일: {movie.release_date}</p>
        <p className="mt-2 text-gray-600">
          평점: {movie.vote_average.toFixed(1)}
        </p>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">줄거리</h2>
        <p className="mt-2 text-gray-700">{movie.overview}</p>
      </div>
    </div>
  )
}

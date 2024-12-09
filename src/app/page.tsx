import SiteSlider from '@/components/SiteSlider'

export default async function Home() {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY

  // 현재 상영작과 개봉 예정작 모두 가져오기
  const [
    koreanNowPlaying,
    koreanUpcoming,
    internationalNowPlaying,
    internationalUpcoming,
  ] = await Promise.all([
    // 한국 현재 상영작
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&region=KR`
    ),
    // 한국 개봉 예정작
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=ko-KR&region=KR`
    ),
    // 해외 현재 상영작
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=en-US`
    ),
    // 해외 개봉 예정작
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=en-US`
    ),
  ]).then((responses) => Promise.all(responses.map((res) => res.json())))

  // 모든 영화 합치기
  const allMovies = [
    ...koreanNowPlaying.results,
    ...koreanUpcoming.results,
    ...internationalNowPlaying.results,
    ...internationalUpcoming.results,
  ]

  // 중복 제거 (같은 영화가 여러 리스트에 있을 수 있음)
  const uniqueMovies = Array.from(new Set(allMovies.map((m) => m.id)))
    .map((id) => allMovies.find((m) => m.id === id))
    .filter((movie) => movie?.poster_path) // 포스터가 있는 영화만 선택

  // 랜덤 영화 선택
  const randomMovie =
    uniqueMovies[Math.floor(Math.random() * uniqueMovies.length)]

  // 예고편 가져오기
  const videoResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=${TMDB_API_KEY}`
  )
  const videoData = await videoResponse.json()

  // 예고편 선택 (최신 예고편 우선)
  const trailer =
    videoData.results
      .filter(
        (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
      )
      .sort(
        (a: any, b: any) =>
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
      )[0] || videoData.results[0]

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f5f5f5] to-[#e5e5e5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 상단 섹션 */}
        <h1 className="text-3xl font-bold text-[#2d5a27] mb-8">
          오늘의 추천 영화: {randomMovie.title}
        </h1>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-16">
          {/* 왼쪽: 예고편 */}
          <div className="w-full lg:w-2/3">
            {trailer ? (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-white">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={trailer.name}
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center">
                <p className="text-gray-500">예고편이 준비되지 않았습니다.</p>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 그룹 */}
        <SiteSlider />
      </div>
    </div>
  )
}

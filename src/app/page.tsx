import Image from 'next/image'
import SiteSlider from '@/components/SiteSlider'
import monoImage from '/public/mono.png'

interface Movie {
  id: number
  title: string
  release_date: string
  poster_path: string
}

interface VideoResult {
  id: string
  key: string
  name: string
  site: string
  type: string
  iso_639_1: string
  published_at: string
}

export default async function Home() {
  const TMDB_API_KEY = process.env.NEXT_PUBLIC_MOVIE_API_KEY

  if (!TMDB_API_KEY) {
    throw new Error('API 키가 설정되지 않았습니다')
  }

  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const [nowPlayingRes, upcomingRes] = await Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&region=KR&page=1`,
        options
      ),
      fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=ko-KR&region=KR&page=1`,
        options
      ),
    ])

    if (!nowPlayingRes.ok || !upcomingRes.ok) {
      throw new Error('영화 데이터를 가져오는데 실패했습니다')
    }

    const koreanNowPlaying = await nowPlayingRes.json()
    const koreanUpcoming = await upcomingRes.json()

    const nowPlayingResults = Array.isArray(koreanNowPlaying?.results)
      ? koreanNowPlaying.results
      : []
    const upcomingResults = Array.isArray(koreanUpcoming?.results)
      ? koreanUpcoming.results
      : []

    const allMovies = [...nowPlayingResults, ...upcomingResults]

    if (allMovies.length === 0) {
      return (
        <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              현재 표시할 영화가 없습니다
            </h1>
          </div>
        </div>
      )
    }

    const uniqueMovies = Array.from(new Set(allMovies.map((m: Movie) => m.id)))
      .map((id) => allMovies.find((m: Movie) => m.id === id))
      .filter(
        (movie): movie is Movie =>
          movie !== undefined &&
          movie.poster_path != null &&
          movie.release_date != null
      )
      .sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime()
      )

    const recentMovies = uniqueMovies.slice(0, 10)
    const randomMovie =
      recentMovies[Math.floor(Math.random() * recentMovies.length)]

    const videoResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=${TMDB_API_KEY}&language=ko-KR`,
      options
    )

    if (!videoResponse.ok) {
      throw new Error('비디오 데이터를 가져오는데 실패했습니다')
    }

    const videoData = await videoResponse.json()
    let trailer = videoData?.results
      ?.filter(
        (video: VideoResult) =>
          video.type === 'Trailer' && video.site === 'YouTube'
      )
      .sort((a: VideoResult, b: VideoResult) => {
        if (a.iso_639_1 === 'ko' && b.iso_639_1 !== 'ko') return -1
        if (a.iso_639_1 !== 'ko' && b.iso_639_1 === 'ko') return 1
        return (
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
        )
      })[0]

    if (!trailer) {
      const enVideoResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`,
        options
      )

      if (!enVideoResponse.ok) {
        throw new Error('영어 비디오 데이터를 가져오는데 실패했습니다')
      }

      const enVideoData = await enVideoResponse.json()
      trailer = enVideoData?.results?.find(
        (video: VideoResult) =>
          video.type === 'Trailer' && video.site === 'YouTube'
      )
    }

    const releaseDate = new Date(randomMovie.release_date)
    const formattedDate = new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(releaseDate)

    return (
      <div className="min-h-screen w-full bg-white">
        {/* 메인 섹션 */}
        <div className="w-full bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                오늘의 추천 영화
              </h1>
              <div className="space-y-2">
                <h2 className="text-3xl font-medium bg-gradient-to-r text-[#2d5a27aa] bg-clip-text">
                  {randomMovie.title}
                </h2>
                <p className="text-gray-500 text-sm">{formattedDate} 개봉</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-2/3">
                <div className="rounded-xl overflow-hidden shadow-2xl bg-white">
                  {trailer ? (
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${trailer.key}`}
                        title={trailer.name}
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-50 flex items-center justify-center">
                      <p className="text-gray-400">
                        예고편이 준비되지 않았습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full lg:w-1/3 flex justify-center items-center">
                <Image
                  src={monoImage}
                  alt="Movie Recommender Mascot"
                  width={300}
                  height={400}
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                다른 영화 정보 사이트
              </h3>
              <div className="w-20 h-1 bg-[#2d5a27aa] rounded-full mb-12"></div>
              <SiteSlider />
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('에러 발생:', error)
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            죄송합니다. 데이터를 불러오는 중 문제가 발생했습니다.
          </h1>
          <p className="text-gray-600">잠시 후 다시 시도해 주세요.</p>
        </div>
      </div>
    )
  }
}

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

  const [koreanNowPlaying, koreanUpcoming] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API_KEY}&language=ko-KR&region=KR&page=1`
    ),
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${TMDB_API_KEY}&language=ko-KR&region=KR&page=1`
    ),
  ]).then((responses) => Promise.all(responses.map((res) => res.json())))

  const allMovies = [...koreanNowPlaying.results, ...koreanUpcoming.results]

  const uniqueMovies = Array.from(new Set(allMovies.map((m: Movie) => m.id)))
    .map((id) => allMovies.find((m: Movie) => m.id === id))
    .filter((movie): movie is Movie => movie?.poster_path != null)
    .sort(
      (a, b) =>
        new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
    )

  const recentMovies = uniqueMovies.slice(0, 10)
  const randomMovie =
    recentMovies[Math.floor(Math.random() * recentMovies.length)]

  const videoResponse = await fetch(
    `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=${TMDB_API_KEY}&language=ko-KR`
  )
  const videoData = await videoResponse.json()

  let trailer = videoData.results
    .filter(
      (video: VideoResult) =>
        video.type === 'Trailer' && video.site === 'YouTube'
    )
    .sort((a: VideoResult, b: VideoResult) => {
      if (a.iso_639_1 === 'ko' && b.iso_639_1 !== 'ko') return -1
      if (a.iso_639_1 !== 'ko' && b.iso_639_1 === 'ko') return 1
      return (
        new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      )
    })[0]

  if (!trailer) {
    const enVideoResponse = await fetch(
      `https://api.themoviedb.org/3/movie/${randomMovie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    )
    const enVideoData = await enVideoResponse.json()
    trailer = enVideoData.results.find(
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
    <div className="min-h-screen w-full bg-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
        <div className="text-center mb-16 ">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            오늘의 추천 영화
          </h1>
          <div className="space-y-2">
            <h2 className="text-3xl font-medium text-gray-800">
              {randomMovie.title}
            </h2>
            <p className="text-gray-500">개봉일: {formattedDate}</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          <div className="w-full lg:w-2/3">
            <div className="rounded-lg overflow-hidden shadow-lg">
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
                  <p className="text-gray-400">예고편이 준비되지 않았습니다.</p>
                </div>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex justify-center items-center">
            <div>
              <Image
                src={monoImage}
                alt="Movie Recommender Mascot"
                width={400}
                height={550}
                className="drop-shadow-xl"
                priority
              />
            </div>
          </div>
        </div>

        <div className="relative py-8 mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 text-gray-400 text-sm">
              다른 영화 정보 사이트
            </span>
          </div>
        </div>

        <div>
          <SiteSlider />
        </div>
      </div>
    </div>
  )
}

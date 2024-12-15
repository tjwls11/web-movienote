'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FaHistory, FaHeart, FaComment, FaCamera } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface UserData {
  image: string
  name: string
  email: string
  createdAt?: string
}

interface Movie {
  id: number
  title: string
  poster_path: string
}

export default function MyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentImage, setCurrentImage] = useState('/default-avatar.png')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [recentMovies, setRecentMovies] = useState<Movie[]>([]) // 최근 본 영화 상태 추가

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/user/profile')
          const data = await response.json()

          if (data.success) {
            setUserData(data.user)
            setCurrentImage(data.user.image)
          }
        } catch (error) {
          console.error('Failed to fetch user info:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchUserInfo()
  }, [session])

  // 최근 본 영화 데이터 가져오기
  useEffect(() => {
    const recentMovies = JSON.parse(
      sessionStorage.getItem('recentMovies') || '[]'
    )
    console.log('Recent Movies:', recentMovies)
    if (recentMovies.length > 0) {
      setRecentMovies(recentMovies.slice(-5))
    }
  }, [session])

  // 추가: 최근 본 영화 업데이트 함수
  const updateRecentMovies = (newMovie: Movie) => {
    setRecentMovies((prevMovies) => {
      const updatedMovies = [...prevMovies, newMovie].slice(-5) // 최신 5개 유지
      sessionStorage.setItem('recentMovies', JSON.stringify(updatedMovies)) // 세션 스토리지 업데이트
      return updatedMovies
    })
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('image', file)

      try {
        const response = await fetch('/api/user/profile', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()

        if (data.success) {
          setCurrentImage(data.user.image)
        }
      } catch (error) {
        console.error('Error uploading image:', error)
        alert('이미지 업로드에 실패했습니다.')
      }
    }
  }

  // 예화 클릭 시 포스터 가져오기
  const handleMovieClick = (title: string) => {
    const moviePoster = recentMovies.find(
      (movie) => movie.title === title
    )?.poster_path
    if (moviePoster) {
      // 포스터를 가져오는 로직 추가
      console.log(`포스터 경로: https://image.tmdb.org/t/p/w500${moviePoster}`)
    } else {
      console.log('영화를 찾을 수 없습니다.')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 왼쪽 사이드바: 프로필 섹션 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <Image
                  src={currentImage}
                  alt="Profile"
                  width={120}
                  height={120}
                  priority
                  className="rounded-full mb-4 ring-2 ring-[#2d5a27]"
                />
                <button
                  onClick={handleImageClick}
                  className="absolute bottom-4 right-0 bg-[#2d5a27] p-2 rounded-full text-white hover:bg-[#234620] transition-colors"
                  title="프로필 이미지 변경"
                >
                  <FaCamera />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {userData?.name || session?.user?.name}
              </h2>
              <p className="text-gray-600">
                {userData?.email || session?.user?.email}
              </p>

              <div className="w-full space-y-3 mt-2">
                <div className="text-sm text-gray-600">
                  가입일:{' '}
                  {userData?.createdAt
                    ? new Date(userData.createdAt).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* 계정 관리 섹션 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-bold mb-4">계정 관리</h3>
            <div className="space-y-3">
              <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors">
                이름 변경
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors">
                비밀번호 변경
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <h3 className="text-lg font-bold mb-4">내 활동</h3>
            <div className="space-y-3">
              <Link href="/memo">
                <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors">
                  나의 영화 기록장
                </button>
              </Link>
              <button className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg transition-colors">
                나의 커뮤니티 기록
              </button>
            </div>
          </div>
        </div>

        {/* 오른쪽 메인 컨텐츠 */}
        <div className="lg:col-span-2 space-y-8">
          {/* 활동 내역 섹션들 */}
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
                <FaHistory className="text-[#2d5a27]" /> 최근에 본 영화
              </h3>
              {/* 최근 본 영화 리스트 */}
              {recentMovies.length > 0 ? (
                <div className="flex overflow-x-auto gap-4">
                  {recentMovies.map((movie, index) => (
                    <div
                      key={`${movie.id}-${index}`}
                      className="flex-shrink-0 w-1/5"
                      onClick={() => handleMovieClick(movie.title)}
                    >
                      <Image
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                            : '/default-movie.png'
                        }
                        alt={movie.title ? movie.title : '영화 포스터'}
                        width={500}
                        height={750}
                        className="w-full h-auto"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-center py-4">
                  최근에 본 영화가 없습니다.
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
                <FaHeart className="text-[#2d5a27]" /> 관심있는 영화
              </h3>
              {/* 좋아요한 영화 리스트 */}
              <div className="text-gray-500 text-center py-4">
                관심 표시한 영화가 없습니다.
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="flex items-center gap-2 text-xl font-bold mb-4">
                <FaComment className="text-[#2d5a27]" /> 내 리뷰
              </h3>
              {/* 리뷰 리스트 */}
              <div className="text-gray-500 text-center py-4">
                작성한 리뷰가 없습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
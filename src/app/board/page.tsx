'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import BoardSidebar from '@/components/BoardSidebar'
import Loading from '@/components/Loading'

interface Post {
  _id: string
  title: string
  author: string // 작성자 추가
  date: string // 작성일 추가
}

export default function Board() {
  const router = useRouter()
  const { data: session } = useSession() // 세션 정보 가져오기
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        const errorData = await response.json() // 오류 메시지 가져오기
        throw new Error(
          `게시글을 불러오는 데 실패했습니다: ${
            errorData.error || '알 수 없는 오류'
          }`
        )
      }
      const data = await response.json()
      console.log('Fetched posts:', data) // API 응답 로그 추가

      setPosts(
        data.map((post: any) => ({
          _id: post._id,
          title: post.title,
          author: post.author,
          date: post.date,
        }))
      )
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching posts:', error.message)
      } else {
        console.error('Unexpected error:', error)
      }
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await fetch(`/api/posts/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          setPosts(posts.filter((post) => post._id !== id)) // 삭제 후 상태 업데이트
        } else {
          throw new Error('Failed to delete the post')
        }
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  if (loading) {
    return (
      <div>
        <Loading pageName="커뮤니티" />
      </div>
    )
  }

  return (
    <div className="flex">
      <BoardSidebar />
      <div className="container mx-auto px-4 py-24 flex-1">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">게시판</h1>
            <button
              onClick={() => router.push('/board/add')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              글쓰기
            </button>
          </div>

          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  작업
                </th>
              </tr>
            </thead>
            <tbody>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <tr
                    key={post._id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/board/${post._id}`)}
                  >
                    <td className="px-6 py-4">{post.title}</td>
                    <td className="px-6 py-4">{post.author}</td>
                    <td className="px-6 py-4">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {session?.user?.name === post.author && ( // 작성자 본인일 경우
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation() // 클릭 이벤트 전파 방지
                              router.push(`/board/edit/${post._id}`) // 수정 페이지로 이동
                            }}
                            className="text-blue-600 hover:underline"
                          >
                            수정
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation() // 클릭 이벤트 전파 방지
                              handleDelete(post._id) // 삭제 처리
                            }}
                            className="text-red-600 hover:underline ml-4"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    게시글이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

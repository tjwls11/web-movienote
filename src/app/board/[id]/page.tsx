'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Loading from '@/components/Loading'
import Sidebar from '@/components/Sidebar'

interface Post {
  _id: string
  title: string
  content: string
  author: string
  date: string
  categoryId: number
  categoryName: string
}

type CategoryId = 1 | 2 | 3 | 4
const CATEGORIES: Record<CategoryId, string> = {
  1: '영화토론',
  2: '영화수다',
  3: '후기/리뷰',
  4: '스포',
}

export default function CategoryBoard() {
  const params = useParams()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    const fetchPosts = async () => {
      const categoryId = params?.id

      if (!categoryId) {
        console.error('카테고리 ID가 유효하지 않습니다')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/posts/${categoryId}`)
        if (!response.ok) {
          throw new Error('게시글을 가져오는데 실패했습니다')
        }
        const data = await response.json()
        setPosts(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('게시글 로딩 중 오류:', error)
        setPosts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchPosts()
  }, [params?.id])

  if (isLoading)
    return (
      <div>
        <Loading pageName="게시글" />
      </div>
    )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar categoryId={Number(params?.id) as CategoryId} />

      {/* 메인 컨텐츠 */}
      <div className="flex-1 pl-4 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#2d5a27aa]">
              {Number(params?.id)
                ? CATEGORIES[Number(params?.id) as CategoryId]
                : '전체글'}
            </h1>
            {session && (
              <Link
                href="/board/add"
                className="bg-[#2d5a27aa] text-white px-6 py-3 rounded-lg 
                         hover:bg-[#2d5a27] transition-colors duration-200 
                         shadow-md"
              >
                글쓰기
              </Link>
            )}
          </div>

          <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
            {posts.map((post) => (
              <Link href={`/board/post/${post._id}`} key={post._id}>
                <div className="border-b p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {post.title}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="mr-4">작성자: {post.author}</span>
                    <span>카테고리: {post.categoryName}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center p-8 bg-white rounded-lg shadow-sm mt-4 text-gray-500">
              게시글이 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

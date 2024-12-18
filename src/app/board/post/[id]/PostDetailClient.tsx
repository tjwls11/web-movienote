'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Post {
  _id: string
  title: string
  content: string
  author: string
  authorId: string
  date: string
  categoryId: number
  categoryName: string
}

interface Props {
  postId: string
}

export default function PostDetailClient({ postId }: Props) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}`)
        if (!response.ok) {
          console.error('Response not OK:', await response.text())
          throw new Error('게시글을 불러오는데 실패했습니다')
        }
        const data = await response.json()
        setPost(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [postId])

  if (isLoading) return <div>로딩 중...</div>
  if (!post) return <div>게시글을 찾을 수 없습니다</div>

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex justify-between text-gray-600">
          <div>
            <span className="mr-4">작성자: {post.author}</span>
            <span>카테고리: {post.categoryName}</span>
          </div>
          <div>작성일: {new Date(post.date).toLocaleDateString()}</div>
        </div>
      </div>

      <div className="min-h-[200px] mb-8 whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={() => router.push('/board')}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          목록으로
        </button>

        <div>
          {session?.user?.name === post.author && (
            <button
              onClick={() => router.push(`/board/edit/${post._id}`)}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// 카테고리 타입 정의
type CategoryId = 1 | 2 | 3 | 4

const CATEGORY_MAP: Record<CategoryId, string> = {
  1: '영화토론',
  2: '영화수다',
  3: '후기/리뷰',
  4: '스포',
} as const

export default function AddPost() {
  const router = useRouter()
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState<CategoryId>(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session?.user?.email) {
      alert('로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author: session.user.name,
          authorId: session.user.email,
          date: new Date().toISOString(),
          categoryId: Number(categoryId),
          categoryName: CATEGORY_MAP[categoryId],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/board/${categoryId}`)
      } else {
        throw new Error(data.message || 'Failed to create post')
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert(
        error instanceof Error ? error.message : '게시글 작성에 실패했습니다.'
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">카테고리</label>
            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(Number(e.target.value) as CategoryId)
              }
              className="w-full p-2 border rounded-md"
            >
              {Object.entries(CATEGORY_MAP).map(([id, name]) => (
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded-md min-h-[200px]"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            작성하기
          </button>
        </form>
      </div>
    </div>
  )
}

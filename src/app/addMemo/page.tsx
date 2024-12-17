'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AddMemo() {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = session?.user?.id // 사용자 ID 가져오기
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, userId }), // email 필드 제거
      })

      if (!response.ok) {
        const errorData = await response.json() // JSON 응답을 읽기
        throw new Error(errorData.message || 'Failed to create memo')
      }

      const data = await response.json() // JSON 응답을 읽기
      router.push('/memo') // 메모 페이지로 리다이렉트
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error:', error.message)
        setError(error.message || '메모 생성에 실패했습니다')
      } else {
        console.error('Error:', error)
        setError('메모 생성에 실패했습니다')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
              focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            내용
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2
              focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md
            hover:bg-green-700 transition-colors"
        >
          기록장 추가
        </button>
      </form>
      {error && <p className="text-red-500">{error}</p>}{' '}
      {/* 에러 메시지 표시 */}
    </div>
  )
}

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function AddMemo() {
  const router = useRouter()
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!session?.user?.name) {
        throw new Error('로그인이 필요합니다')
      }

      const memoData = {
        title,
        content,
        author: session.user.name,
      }
      console.log('Sending memo data:', memoData)

      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memoData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create memo')
      }

      const responseData = await response.json()
      console.log('Server response:', responseData)

      router.push('/memo')
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

  if (!session) {
    return <div className="text-center p-8">로그인이 필요합니다.</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        {session.user?.name}님의 새 기록장
      </h1>
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
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
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
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}

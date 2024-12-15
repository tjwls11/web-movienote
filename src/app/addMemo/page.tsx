'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddMemo() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (!res.ok) {
        throw new Error('Failed to create memo')
      }

      // 메모 생성 후 /memo 페이지로 리다이렉션
      router.push('/memo')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
    </div>
  )
}
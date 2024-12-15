'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditMemoForm({ id }: { id: string }) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getMemo = async () => {
      try {
        const res = await fetch(`/api/memos/${id}`)
        if (!res.ok) {
          throw new Error('Failed to fetch memo')
        }
        
        const data = await res.json()
        if (data.memo) {  // memo 객체가 존재하는지 확인
          setTitle(data.memo.title)
          setDescription(data.memo.description)
        }
      } catch (error) {
        console.error('Error fetching memo:', error)
        alert('메모를 불러오는데 실패했습니다')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      getMemo()
    }
  }, [id])

  if (loading) return <div>Loading...</div>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newTitle: title,
          newDescription: description,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update memo')
      }

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
          기록장 수정
        </button>
      </form>
    </div>
  )
}
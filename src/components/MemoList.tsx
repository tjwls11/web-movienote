'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import { FiPlus } from 'react-icons/fi'
import MemoRemoveBtn from './MemoRemoveBtn'

interface Memo {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMemos = async () => {
    try {
      const res = await fetch('/api/memos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      if (!res.ok) {
        throw new Error('Failed to fetch memos')
      }

      const { success, memos: fetchedMemos } = await res.json()
      if (!success) {
        throw new Error('Failed to fetch memos')
      }

      setMemos(fetchedMemos)
      setError(null)
    } catch (error) {
      console.error('Error loading memos:', error)
      setError('메모를 불러오는데 실패했습니다')
      setMemos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!memos.length) return <div>No memos found</div>

  return (
    <div className="relative">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {memos.map((memo) => (
          <div
            key={memo._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-3">{memo.title}</h2>
              <p className="text-gray-600 mb-4">{memo.description}</p>
              <div className="flex gap-4 text-sm text-gray-500">
                <p>Created: {new Date(memo.createdAt).toLocaleDateString()}</p>
                <p>Updated: {new Date(memo.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <MemoRemoveBtn 
                id={memo._id} 
                onDelete={fetchMemos}
              />
              <Link href={`/editMemo/${memo._id}`}>
                <HiPencilAlt size={24} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link
        href="/addMemo"
        className="fixed bottom-8 right-8 bg-green-600 text-white rounded-full p-4
          hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl
          transform hover:-translate-y-1 group flex items-center gap-2"
      >
        <FiPlus className="w-6 h-6" />
        <span className="hidden group-hover:inline whitespace-nowrap pr-2">
          기록장 쓰기
        </span>
      </Link>
    </div>
  )
}

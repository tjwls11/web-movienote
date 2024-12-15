'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function MemoDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [memo, setMemo] = useState<Memo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const res = await fetch(`/api/memos/${params.id}`)
        if (!res.ok) throw new Error('메모를 불러오는데 실패했습니다')
        const data = await res.json()
        setMemo(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchMemo()
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!memo) return <div>메모를 찾을 수 없습니다</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{memo.title}</h1>
          <div className="flex gap-4 text-sm text-gray-500">
            <p>작성일: {new Date(memo.createdAt).toLocaleDateString()}</p>
            <p>수정일: {new Date(memo.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="prose max-w-none mb-8">
          <p className="text-gray-700 whitespace-pre-wrap">{memo.description}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg
            hover:bg-gray-50 transition-colors duration-200"
          >
            뒤로 가기
          </button>
          <Link
            href={`/editMemo/${memo._id}`}
            className="px-4 py-2 bg-green-600 text-white rounded-lg
            hover:bg-green-700 transition-colors duration-200"
          >
            수정하기
          </Link>
        </div>
      </div>
    </div>
  )
}

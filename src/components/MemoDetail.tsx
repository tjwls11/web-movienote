'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import MemoRemoveBtn from './MemoRemoveBtn'
import Loading from './Loading'

interface Memo {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  folderId: string
}

interface Folder {
  id: string
  name: string
  isDefault: boolean
}

export default function MemoDetail({ id }: { id: string }) {
  const router = useRouter()
  const [memo, setMemo] = useState<Memo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: '전체', isDefault: true },
    { id: '2', name: '즐겨찾기', isDefault: true },
  ])

  useEffect(() => {
    const fetchMemo = async () => {
      try {
        const res = await fetch(`/api/memos/${id}`)
        if (!res.ok) throw new Error('Failed to fetch memo')
        const data = await res.json()
        setMemo(data.memo)
        setError(null)
      } catch (error) {
        console.error(error)
        setError('메모를 불러오는데 실패했습니다')
      } finally {
        setLoading(false)
      }
    }

    fetchMemo()
  }, [id])

  const handleFolderChange = async (folderId: string) => {
    try {
      const res = await fetch(`/api/memos/${memo?._id}/folder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderId }),
      })

      if (!res.ok) throw new Error('Failed to update folder')

      const updatedMemo = await res.json()
      setMemo(updatedMemo.memo)
    } catch (error) {
      console.error('Error updating folder:', error)
      alert('폴더 변경에 실패했습니다')
    }
  }

  if (loading) {
    return (
      <div>
        <Loading pageName="기록장" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            기록장을 불러오는데 실패했습니다
          </div>
          <div className="text-gray-500">{error}</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  if (!memo) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">🔍</div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            기록장을 찾을 수 없습니다
          </div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{memo?.title}</h1>
          <div className="flex items-center gap-4">
            <select
              value={memo?.folderId || '전체'}
              onChange={(e) => handleFolderChange(e.target.value)}
              className="px-3 py-2 border rounded-md text-sm text-gray-600 focus:outline-none focus:border-green-500"
            >
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>

            <div className="flex gap-4">
              <MemoRemoveBtn
                id={memo?._id}
                onDelete={() => router.push('/memo')}
              />
              <Link
                href={`/editMemo/${memo?._id}`}
                className="text-green-600 hover:text-green-700 transition-colors"
              >
                <HiPencilAlt size={24} />
              </Link>
            </div>
          </div>
        </div>
        <div className="prose max-w-none mb-8">
          <h1>{memo.title}</h1>
          <p className="text-gray-600 whitespace-pre-wrap">
            {memo.description}
          </p>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
          <p>작성일: {new Date(memo.createdAt).toLocaleDateString()}</p>
          <p>수정일: {new Date(memo.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

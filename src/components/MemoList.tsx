'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { HiPencilAlt } from 'react-icons/hi'
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

  useEffect(() => {
    async function fetchMemos() {
      try {
        const res = await fetch('/api/memos')
        if (!res.ok) {
          throw new Error('Failed to fetch memos')
        }
        const data = await res.json()
        setMemos(data.memos)
      } catch (error) {
        console.error('Error loading memos: ', error)
        setError('Failed to load memos')
      } finally {
        setLoading(false)
      }
    }
    fetchMemos()
  }, [])

  if (loading) {
    return <p className="text-center text-gray-500">Loading memos...</p>
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>
  }

  if (memos.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 text-xl">
          작성된 기록장이 아직 없습니다. 작성해보세요!
        </p>
      </div>
    )
  }

  return (
    <div>
      {memos.map((memo: Memo) => (
        <div
          key={memo._id}
          className="p-4 border border-green-700 my-3 flex justify-between gap-5 items-start"
        >
          <div>
            <h2 className="text-3xl font-bold">{memo.title}</h2>
            <div className="flex gap-4">
              <p>작성일: {memo.createdAt}</p>
            </div>
            <div className="flex gap-4">
              <p>수정일: {memo.updatedAt}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <MemoRemoveBtn id={memo._id} />
            <Link href={`/editMemo/${memo._id}`}>
              <HiPencilAlt size={24} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

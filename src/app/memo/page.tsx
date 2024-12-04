import React from 'react'
import MemoList from '@/components/MemoList'
import Link from 'next/link'

export default function MemoPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-green-800">영화 기록장</h1>
        <Link
          href="/addMemo"
          className="bg-green-800 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          기록장 쓰기
        </Link>
      </div>
      <MemoList />
    </div>
  )
}

import React from 'react'
import MemoList from '@/components/MemoList'

export default function MemoPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-green-800 mb-8">영화 기록장</h1>
      <MemoList />
      <MemoList />
    </div>
  )
}

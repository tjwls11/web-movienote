'use client'

import { useState, useEffect } from 'react'
import { FiPlus } from 'react-icons/fi'
import Link from 'next/link'
import { Memo } from '@/types/memo'
import Loading from './Loading'

interface MemoListProps {
  memos: Memo[]
}

export default function MemoList({ memos }: MemoListProps) {
  const [isLoading, setIsLoading] = useState(true)
  const filteredMemos = memos

  useEffect(() => {
    if (memos) {
      setIsLoading(false)
    }
  }, [memos])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loading pageName="기록장" />
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1">
        <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
          {filteredMemos.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg mb-4">기록이 없습니다</p>
              <Link
                href="/addMemo"
                className="bg-[#2d5a27aa] text-white px-6 py-3 rounded-md
                hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
              >
                <FiPlus className="w-5 h-5" />첫 영화기록장 작성하기
              </Link>
            </div>
          ) : (
            filteredMemos.map((memo) => (
              <div
                key={memo._id}
                className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full"
              >
                <Link href={`/memo/${memo._id}`}>
                  <div className="p-6">
                    <div className="text-xl font-bold text-gray-800 mb-2">
                      {memo.content}
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <p>
                        작성일: {new Date(memo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>

        <Link
          href="/addMemo"
          className=" fixed bottom-8 right-8 bg-[#2d5a27aa] text-white rounded-full p-4
              hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl
              transform hover:-translate-y-1 group flex items-center gap-2"
        >
          <FiPlus className="w-6 h-6" />
          <span className="hidden group-hover:inline whitespace-nowrap pr-2">
            메모 작성
          </span>
        </Link>
      </div>
    </div>
  )
}

import React from 'react'
import MemoList from '@/components/MemoList'
import { FiFilm } from 'react-icons/fi'

export default function MemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center space-x-3 mb-8">
          <FiFilm className="w-8 h-8 text-green-600" />
          <h1 className="text-4xl font-bold text-green-600">
            영화 기록장
          </h1>
        </div>

        <MemoList />
      </div>
    </div>
  )
}
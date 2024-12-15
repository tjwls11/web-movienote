import React from 'react'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="text-lg font-bold mb-4">카테고리</h2>
      <ul className="space-y-2">
        <li>
          <Link
            href="/board/category1"
            className="text-gray-700 hover:text-blue-500"
          >
            카테고리 1
          </Link>
        </li>
        <li>
          <Link
            href="/board/category2"
            className="text-gray-700 hover:text-blue-500"
          >
            카테고리 2
          </Link>
        </li>
        <li>
          <Link
            href="/board/category3"
            className="text-gray-700 hover:text-blue-500"
          >
            카테고리 3
          </Link>
        </li>
        {/* 추가 카테고리 링크 */}
      </ul>
    </div>
  )
}

export default Sidebar
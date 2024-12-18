'use client'

import Link from 'next/link'

type CategoryId = 1 | 2 | 3 | 4
const CATEGORIES: Record<CategoryId, string> = {
  1: '영화토론',
  2: '영화수다',
  3: '후기/리뷰',
  4: '스포',
}

interface SidebarProps {
  categoryId: number | null
}

export default function Sidebar({ categoryId }: SidebarProps) {
  return (
    <div className="w-72 bg-white shadow-sm p-6 h-screen">
      <h2 className="text-3xl font-bold mb-4 text-[#2d5a27aa]">게시판</h2>
      <nav className="space-y-2">
        <Link
          href="/board"
          className={`block p-3 rounded-lg transition-all duration-200 ${
            !categoryId
              ? 'bg-[#2d5a27aa] text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          전체글
        </Link>
        {Object.entries(CATEGORIES).map(([id, name]) => (
          <Link
            key={id}
            href={`/board/${id}`}
            className={`block p-2 rounded-lg transition-all duration-200 ${
              categoryId === Number(id)
                ? 'bg-[#2d5a27aa] text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {name}
          </Link>
        ))}
      </nav>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface Post {
  id: number
  title: string
  author: string
  date: string
  views: number
  content: string
}

// 더미 데이터
const dummyPost: Post = {
  id: 1,
  title: '첫 번째 게시글입니다',
  author: '홍길동',
  date: '2024-03-20',
  views: 0,
  content: '첫 번째 게시글의 내용입니다. 반갑습니다.',
}

export default function PostDetail() {
  const router = useRouter()
  const post = dummyPost

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h1>

        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div className="text-gray-600">
            <span>작성자: {post.author}</span>
            <span className="mx-2">|</span>
            <span>작성일: {post.date}</span>
          </div>
          <div className="text-gray-600">조회수: {post.views}</div>
        </div>

        <div className="text-gray-800 mb-6 min-h-[200px] whitespace-pre-wrap">
          {post.content}
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={() => router.push('/board')}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            목록으로
          </button>
          <button
            onClick={() => router.push(`/board/edit/${post.id}`)}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            수정
          </button>
          <button
            onClick={() => {
              if (confirm('정말 삭제하시겠습니까?')) {
                // 삭제 로직 구현
                router.push('/board')
              }
            }}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}

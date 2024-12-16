'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

// API에서 게시글을 가져오는 함수 추가
const fetchPost = async (id: string) => {
  const response = await fetch(`/api/posts/${id}`) // 게시글 ID에 따라 API 호출
  if (!response.ok) {
    throw new Error('게시글을 가져오는 데 실패했습니다.')
  }
  return response.json()
}

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [post, setPost] = useState({
    title: '',
    content: '',
  })

  useEffect(() => {
    const loadPost = async () => {
      try {
        const existingPost = await fetchPost(params.id) // 게시글 데이터 가져오기
        setPost({
          title: existingPost.title,
          content: existingPost.content,
        })
      } catch (error) {
        console.error(error)
      }
    }
    loadPost()
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 여기에 실제 데이터 수정 로직 구현
    console.log('수정된 게시글:', post)
    // 수정 완료 후 상세 페이지로 돌아가기
    router.push(`/board/${params.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">게시글 수정</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-gray-700 font-medium mb-2"
            >
              내용
            </label>
            <textarea
              id="content"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              required
            />
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              수정하기
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

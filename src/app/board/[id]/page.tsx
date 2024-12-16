'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Loading from '@/components/Loading'

interface Post {
  _id: string
  title: string
  author: string // 작성자 이름
  date: string // 작성일 추가
  content: string // 본문 추가
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession() // 세션 정보 가져오기
  const [post, setPost] = useState<Post | null>(null) // post 상태 추가
  const [id, setId] = useState<string | null>(null) // id 상태 추가

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params // params 언랩
      setId(resolvedParams.id) // id 상태 업데이트
    }

    fetchParams()
  }, [params])

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const response = await fetch(`/api/posts/${id}`) // API 호출
        const data = await response.json()
        setPost(data.post) // post 상태 업데이트
      }

      fetchPost()
    }
  }, [id]) // id가 변경될 때마다 호출

  if (!post) {
    return (
      <div>
        <Loading pageName="게시물" />
      </div>
    ) // 로딩 중 표시
  }

  // 날짜 형식 변환
  const formattedDate = new Date(post.date).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg h-96 overflow-hidden">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        작성자: <span className="font-semibold">{post.author}</span>
      </p>
      <p className="text-sm text-gray-600 mb-4">
        작성일: <span className="font-semibold">{formattedDate}</span>
      </p>
      <div className="text-gray-800 leading-relaxed h-48 overflow-y-auto">
        {post.content}
      </div>
    </div>
  )
}

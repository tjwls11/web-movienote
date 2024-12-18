'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import PostDetailClient from './PostDetailClient'
import Comments from '@/components/Comments'
import Loading from '@/components/Loading'

interface Comment {
  _id: string
  postId: string
  content: string
  author: string
  date: string
}

export default function PostPage() {
  const params = useParams() as { id: string }
  const { data: session } = useSession()
  const [initialComments, setInitialComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comments?postId=${params.id}`)
        if (!response.ok) {
          throw new Error('댓글을 불러오는데 실패했습니다')
        }
        const data = await response.json()
        setInitialComments(data)
      } catch (error) {
        console.error('댓글 로딩 중 오류:', error)
        setInitialComments([])
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchComments()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/30">
        <Loading pageName="댓글" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/30 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20 text-[#2d5a27aa]">
              로딩 중...
            </div>
          }
        >
          <div className="mb-12">
            <PostDetailClient postId={params.id as string} />
          </div>
          <div>
            <Comments
              postId={params.id as string}
              initialComments={initialComments}
              session={session}
            />
          </div>
        </Suspense>
      </div>
    </div>
  )
}

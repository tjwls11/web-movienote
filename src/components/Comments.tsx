'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from 'next-auth'

interface Comment {
  _id: string
  postId: string
  content: string
  author: string
  date: string
}

interface CommentsProps {
  postId: string
  initialComments: Comment[]
  session: Session | null
}

export default function Comments({
  postId,
  initialComments,
  session,
}: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const router = useRouter()

  const handleCommentSubmit = async () => {
    if (!session) {
      alert('댓글을 작성하려면 로그인이 필요합니다.')
      return
    }

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId,
          content: newComment,
          author: session.user?.name,
        }),
      })

      if (!response.ok) {
        throw new Error('댓글 작성에 실패했습니다.')
      }

      const comment = await response.json()
      setComments([...comments, comment])
      setNewComment('')
      router.refresh()
    } catch (error) {
      console.error('댓글 작성 중 오류:', error)
      alert('댓글 작성에 실패했습니다.')
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[#2d5a27]">
          댓글 {comments.length}개
        </h3>
      </div>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="p-6 bg-white rounded-lg shadow-sm border border-[#2d5a27aa]/20 hover:border-[#2d5a27aa]/40 transition-colors"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium text-[#2d5a27] text-lg">
                {comment.author}
              </span>
              <span className="text-sm text-[#2d5a27aa]">
                {new Date(comment.date).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {comment.content}
            </p>
          </div>
        ))}
      </div>

      {/* 댓글이 없을 때 메시지 */}
      {comments.length === 0 && (
        <div className="text-center py-12 text-[#2d5a27aa] text-lg">
          첫 댓글을 작성해보세요!
        </div>
      )}

      {/* 댓글 작성 폼 */}
      {session && (
        <div className="mt-8">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-4 border border-[#2d5a27aa]/30 rounded-lg resize-none 
                     focus:outline-none focus:ring-2 focus:ring-[#2d5a27aa] 
                     text-gray-700 bg-white/50"
            placeholder="댓글을 작성하세요..."
            rows={4}
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
            className="mt-4 bg-[#2d5a27aa] text-white px-6 py-3 rounded-lg 
                     hover:bg-[#2d5a27] transition-colors duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed
                     text-lg font-medium"
          >
            댓글 작성
          </button>
        </div>
      )}
    </div>
  )
}

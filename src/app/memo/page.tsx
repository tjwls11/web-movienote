'use client'

import MemoList from '@/components/MemoList'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Memo } from '@/types/memo'

export default function MemoPage() {
  const { data: session, update: updateSession } = useSession()
  const userName = session?.user?.name
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState(userName || '')

  const fetchMemos = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/memos?userName=${userName}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || '메모를 불러오는데 실패했습니다')
      }

      if (data.success && Array.isArray(data.memos)) {
        setMemos(data.memos)
      }
    } catch (err) {
      console.error('Error fetching memos:', err)
      setError('메모를 불러오는데 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          author: author || userName,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create memo')
      }

      setTitle('')
      setContent('')
      setAuthor(userName || '')
      setShowForm(false)

      fetchMemos()

      alert('메모가 성공적으로 저장되었습니다!')
    } catch (error) {
      console.error('Failed to create memo:', error)
      alert('메모 저장에 실패했습니다.')
    }
  }

  const refreshSession = async () => {
    await updateSession()
  }

  useEffect(() => {
    refreshSession()
    const intervalId = setInterval(refreshSession, 5000)

    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (userName) {
      fetchMemos()
      setAuthor(userName)
    }
  }, [userName])

  if (!session) {
    return <div className="text-center p-8">로그인이 필요합니다.</div>
  }

  if (loading) {
    return <div className="text-center p-8">로딩 중...</div>
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">
        {session.user?.name}님의 메모 목록
      </h1>

      {showForm ? (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-4">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 mb-2">
              제목:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-gray-700 mb-2">
              내용:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="author" className="block text-gray-700 mb-2">
              작성자:
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            메모 저장
          </button>
        </form>
      ) : (
        <MemoList memos={memos} />
      )}
    </div>
  )
}

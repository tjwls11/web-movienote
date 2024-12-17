'use client'

import { useState } from 'react'

interface EditMemoFormProps {
  id: string
  title: string
  description: string
}

export default function EditMemoForm({
  id,
  title: initialTitle,
  description: initialDescription,
}: EditMemoFormProps) {
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })

      if (!res.ok) {
        throw new Error('메모 업데이트에 실패했습니다')
      }

      window.location.href = `/memo/${id}`
    } catch (error) {
      console.error('오류 발생:', error)
    }

    console.log('Title:', title, 'Description:', description)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목"
      />
      <textarea
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="내용"
      />
      <button type="submit">메모 수정</button>
    </form>
  )
}

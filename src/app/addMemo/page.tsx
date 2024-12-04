'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function AddMemo() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!title || !description) {
      alert('Title and descripiton are required.')
    }
    try {
      const res = await fetch('api/memos', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })
      if (res.ok) {
        router.push('/memo')
        router.refresh()
      } else {
        throw new Error('Failed to create a memo')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input
        className="border border-gray-500 p-4 rounded-md"
        type="text"
        placeholder="기록장 제목"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        value={title}
      />
      <textarea
        className="border border-gray-500 p-4 h-32 rounded-md"
        placeholder="기록장 내용"
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setDescription(e.target.value)
        }
        value={description}
      />
      <button
        className="bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-3 w-fit rounded-md"
        type="submit"
      >
        기록장 등록
      </button>
    </form>
  )
}

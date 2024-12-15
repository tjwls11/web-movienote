'use client'

import React from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

interface MemoRemoveBtnProps {
  id: string;
  onDelete: () => void;
}

export default function MemoRemoveBtn({ id, onDelete }: MemoRemoveBtnProps) {
  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: 'DELETE',
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || '메모 삭제에 실패했습니다')
      }

      if (data.success) {
        onDelete()  // 삭제 성공 시 목록 새로고침
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('메모 삭제에 실패했습니다')
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-600 transition-colors"
      aria-label="메모 삭제"
    >
      <HiOutlineTrash size={24} />
    </button>
  )
}
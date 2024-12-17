import React from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

interface MemoRemoveBtnProps {
  id: string
  onDelete: () => void
}

export default function MemoRemoveBtn({ id, onDelete }: MemoRemoveBtnProps) {
  const handleDelete = async () => {
    if (window.confirm('정말로 이 메모를 삭제하시겠습니까?')) {
      try {
        const res = await fetch(`/api/memos/${id}`, {
          method: 'DELETE',
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(`Failed to delete memo: ${errorData.message}`)
        }

        onDelete() // 삭제 후 부모 컴포넌트에서 상태 업데이트
      } catch (error) {
        console.error('메모 삭제 오류:', error)
        alert('메모 삭제에 실패했습니다.')
      }
    }
  }

  return (
    <button className="text-red-400" onClick={handleDelete}>
      <HiOutlineTrash size={24} />
    </button>
  )
}

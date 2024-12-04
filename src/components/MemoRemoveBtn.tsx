'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { HiOutlineTrash } from 'react-icons/hi'

export default function MemoRemoveBtn({ id }: { id: string }) {
  const router = useRouter()

  async function removeMemo() {
    const confirmed = confirm(`${id} - 이 기록장을 지울까요?`)
    if (confirmed) {
      const res = await fetch(`/api/memos?id=${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.refresh()
      }
    }
  }

  return (
    <button className="text-red-500" onClick={removeMemo}>
      <HiOutlineTrash size={24} />
    </button>
  )
}

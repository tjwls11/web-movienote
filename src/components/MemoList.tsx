import React from 'react'
import { HiPencilAlt } from 'react-icons/hi'
import MemoRemoveBtn from '@/components/MemoRemoveBtn'
import Link from 'next/link'

export default function MemoList() {
  return (
    <>
      <div className="p-8 border border-slate-300 my-8 flex justify-between gap-3 items-start rounded-lg">
        <div>
          <h1 className="text-3xl font-bold">기록장 제목</h1>
        </div>
        <div className="flex gap-2">
          <MemoRemoveBtn />
          <Link href={'/editMemo/123'}>
            <HiPencilAlt size={24} />
          </Link>
        </div>
      </div>
    </>
  )
}

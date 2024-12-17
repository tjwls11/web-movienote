import React from 'react'

export default function EditMemoForm() {
  return (
    <form className="flex flex-col gap-3">
      <input
        className="border border-gray-500 p-4 rounded-md"
        type="text"
        placeholder="기록장 제목"
      />
      <textarea
        className="border border-gray-500 p-4 h-32 rounded-md"
        placeholder="기록장 내용"
      />
      <button className="bg-green-800 hover:bg-green-900 text-white font-bold px-6 py-3 w-fit rounded-md">
        기록장 수정
      </button>
    </form>
  )
}

import React, { useState } from 'react'

interface ChangeNameProps {
  currentName: string
  onNameChange: (newName: string) => void
  onClose: () => void
}

const ChangeName: React.FC<ChangeNameProps> = ({
  currentName,
  onNameChange,
  onClose,
}) => {
  const [newName, setNewName] = useState<string>(currentName)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newName.trim() !== '') {
      await onNameChange(newName)
      setNewName(newName)
    }
  }

  const handleCancel = () => {
    setNewName(currentName)
    onClose()
  }

  return (
    <div className="flex flex-col space-y-4 p-4 bg-gray-100 rounded shadow-md">
      <label htmlFor="name" className="text-lg font-bold text-gray-700">
        이름 변경
      </label>
      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <input
          id="name"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="border border-gray-300 rounded p-2 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="새 이름을 입력하세요"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 transition duration-200"
        >
          변경
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="bg-gray-300 hover:bg-gray-400 text-black rounded px-4 py-2 transition duration-200"
        >
          취소
        </button>
      </form>
    </div>
  )
}

export default ChangeName

'use client'

import { useState, useEffect } from 'react'
import { FiPlus, FiStar, FiFolderPlus, FiMoreVertical } from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import Link from 'next/link'

interface Memo {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  isStarred?: boolean
  folderId: string
}

interface Folder {
  id: string;
  name: string;
  isDefault: boolean;
}

export default function MemoList() {
  const [memos, setMemos] = useState<Memo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [folders, setFolders] = useState<Folder[]>([
    { id: '1', name: '전체', isDefault: true },
    { id: '2', name: '즐겨찾기', isDefault: true }
  ])
  const [activeFolder, setActiveFolder] = useState('전체')
  const [isAddingFolder, setIsAddingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const fetchMemos = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/memos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error('서버 연결에 실패했습니다')
      }

      if (!data.memos) {
        throw new Error('데이터 형식이 올바르지 않습니다')
      }

      setMemos(data.memos)
      setError(null)
    } catch (error: any) {
      console.error('Error loading memos:', error)
      setError(error.message || '메모를 불러오는데 실패했습니다')
      setMemos([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMemos()
  }, [])

  const toggleStar = async (memoId: string) => {
    try {
      const res = await fetch(`/api/memos/${memoId}/star`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to toggle star')
      }

      await fetchMemos()
      
      if (data.memo?.isStarred) {
        setActiveFolder('즐겨찾기')
      }
    } catch (error) {
      console.error('Error toggling star:', error)
      alert('즐겨찾기 설정에 실패했습니다')
    }
  }

  const filteredMemos = memos.filter(memo => {
    switch (activeFolder) {
      case '즐겨찾기':
        return memo.isStarred
      case '전체':
        return true
      default:
        return memo.folderId === activeFolder
    }
  })

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      setFolders(prev => [...prev, {
        id: Date.now().toString(),
        name: newFolderName.trim(),
        isDefault: false
      }])
      setNewFolderName('')
      setIsAddingFolder(false)
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    setFolders(prev => prev.filter(folder => 
      folder.id !== folderId || folder.isDefault
    ))
    if (activeFolder === folderId) {
      setActiveFolder('전체')
    }
  }

  const toggleMenu = (folderId: string) => {
    setActiveMenu(activeMenu === folderId ? null : folderId)
  }

  const startEditing = (folder: Folder) => {
    setEditingFolderId(folder.id)
    setEditingName(folder.name)
    setActiveMenu(null)
  }

  const handleEditComplete = (folderId: string) => {
    if (editingName.trim() && editingName !== folders.find(f => f.id === folderId)?.name) {
      setFolders(prev => prev.map(folder => 
        folder.id === folderId ? { ...folder, name: editingName.trim() } : folder
      ))
    }
    setEditingFolderId(null)
    setEditingName('')
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <div className="mt-4 text-lg font-medium text-gray-700">
              기록장을 불러오는 중...
            </div>
            <div className="mt-2 text-sm text-gray-500">
              잠시만 기다려주세요
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            기록장을 불러오는데 실패했습니다
          </div>
          <div className="text-gray-500">{error}</div>
          <button
            onClick={() => fetchMemos()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  if (!memos.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-2">📝</div>
          <div className="text-lg font-medium text-gray-700 mb-2">
            아직 작성된 기록장이 없습니다
          </div>
          <Link
            href="/addMemo"
            className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            첫 기록장 작성하기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <div className="w-64 bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-700">폴더</h2>
          <button 
            className="text-green-600 hover:text-green-700"
            onClick={() => setIsAddingFolder(true)}
          >
            <FiFolderPlus size={20} />
          </button>
        </div>

        {isAddingFolder && (
          <div className="mb-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="폴더 이름"
              className="w-full px-3 py-2 border rounded-md mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddFolder}
                className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setIsAddingFolder(false)
                  setNewFolderName('')
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
              >
                취소
              </button>
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {folders.map((folder) => (
            <li
              key={folder.id}
              className={`flex justify-between items-center px-3 py-2 rounded-md ${
                activeFolder === folder.name
                  ? 'bg-green-50 text-green-700'
                  : 'hover:bg-gray-50'
              }`}
            >
              {editingFolderId === folder.id ? (
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onBlur={() => handleEditComplete(folder.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEditComplete(folder.id)
                    if (e.key === 'Escape') {
                      setEditingFolderId(null)
                      setEditingName('')
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:border-green-500"
                  autoFocus
                />
              ) : (
                <span 
                  onClick={() => setActiveFolder(folder.name)}
                  className="cursor-pointer"
                >
                  {folder.name}
                </span>
              )}
              {!folder.isDefault && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleMenu(folder.id)
                    }}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <FiMoreVertical size={16} />
                  </button>

                  {activeMenu === folder.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(folder)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          이름 수정
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('정말 삭제하시겠습니까?')) {
                              handleDeleteFolder(folder.id)
                            }
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1">
        <div className="flex flex-col space-y-4 max-w-2xl mx-auto">
          {filteredMemos.map((memo) => (
            <div
              key={memo._id}
              className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 w-full"
            >
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-100 rounded-br-lg transform rotate-12"></div>
              
              <Link href={`/memo/${memo._id}`}>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">{memo.title}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(memo.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleStar(memo._id)
                }}
                className="absolute bottom-4 right-4 text-gray-400 hover:text-yellow-400 
                  transition-colors duration-200"
              >
                {memo.isStarred ? (
                  <FaStar className="text-yellow-400" size={20} />
                ) : (
                  <FiStar size={20} />
                )}
              </button>
            </div>
          ))}
        </div>

        <Link
          href="/addMemo"
          className="fixed bottom-8 right-8 bg-green-600 text-white rounded-full p-4
            hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl
            transform hover:-translate-y-1 group flex items-center gap-2"
        >
          <FiPlus className="w-6 h-6" />
          <span className="hidden group-hover:inline whitespace-nowrap pr-2">
            기록장 쓰기
          </span>
        </Link>
      </div>
    </div>
  )
}

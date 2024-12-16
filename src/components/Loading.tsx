import React from 'react'

interface LoadingProps {
  pageName: string
}

export default function Loading({ pageName }: LoadingProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
      <div className="text-center">
        <div className="relative flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <div className="mt-4 text-lg font-medium text-gray-700">
            {pageName} 로딩 중입니다...
          </div>
          <div className="mt-2 text-sm text-gray-500">잠시만 기다려주세요</div>
        </div>
      </div>
    </div>
  )
}

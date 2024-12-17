'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import EditMemoForm from '@/components/EditMemoForm'

export default function EditMemoPage() {
  const params = useParams()
  const id = params?.id as string | undefined // URL에서 id 가져오기
  const [memo, setMemo] = useState<{
    title: string
    description: string
  } | null>(null)

  useEffect(() => {
    const fetchMemo = async () => {
      if (!id) {
        console.error('ID가 정의되지 않았습니다.') // ID가 undefined일 때 로그 출력
        return // id가 없으면 함수 종료
      }

      try {
        const response = await fetch(`/api/memos/${id}`)
        if (!response.ok) {
          throw new Error('메모를 불러오는 데 실패했습니다')
        }
        const data = await response.json()
        setMemo(data.memo) // 메모 정보를 상태에 저장
      } catch (error) {
        console.error('Error fetching memo:', error)
      }
    }

    fetchMemo()
  }, [id])

  if (!memo) {
    return <div>로딩 중...</div> // 메모가 로딩 중일 때 표시
  }

  return (
    <EditMemoForm
      id={id!} // id가 undefined가 아님을 보장
      title={memo.title} // 메모 제목
      description={memo.description} // 메모 내용
    />
  )
}

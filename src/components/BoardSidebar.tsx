import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Sidebar() {
  return (
    <Card className="h-fit w-full p-6 bg-white">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">커뮤니티</h2>
        <div className="flex flex-col space-y-2">
          <Link href="/board/notice">
            <Button variant="ghost" className="w-full justify-start">
              공지사항
            </Button>
          </Link>
          <Link href="/board/free">
            <Button variant="ghost" className="w-full justify-start">
              자유게시판
            </Button>
          </Link>
          <Link href="/board/review">
            <Button variant="ghost" className="w-full justify-start">
              영화리뷰
            </Button>
          </Link>
          <Link href="/board/recommend">
            <Button variant="ghost" className="w-full justify-start">
              영화추천
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
}

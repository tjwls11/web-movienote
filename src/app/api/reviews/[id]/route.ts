// src/app/api/reviews/[id]/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'
import { ObjectId } from 'mongodb'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // params를 await로 처리
    const { id } = await params

    const db = await connectToDatabase()
    const reviewsCollection = db.collection('reviews')

    const result = await reviewsCollection.deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: '리뷰를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('리뷰 삭제 중 오류:', error)
    return NextResponse.json(
      { error: '리뷰 삭제에 실패했습니다.' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categoryId = Number(params.id)
    const db = await connectToDatabase()

    const posts = await db
      .collection('posts')
      .find({ categoryId })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET /api/posts/category/[id] error:', error)
    return NextResponse.json(
      { message: '게시글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

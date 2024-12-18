import { connectToDatabase } from '@/libs/mongodb'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, author, date, categoryId, categoryName } = body

    // 데이터 유효성 검사
    if (!title || !content || !author || !categoryId) {
      return NextResponse.json(
        { message: '필수 항목이 누락되었습니다.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const result = await db.collection('posts').insertOne({
      title,
      content,
      author,
      date: date || new Date(),
      categoryId,
      categoryName,
      createdAt: new Date(),
    })

    return NextResponse.json({ _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('POST /api/posts error:', error)
    return NextResponse.json(
      { message: '게시글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('API: Starting to fetch posts')
    const db = await connectToDatabase()
    console.log('API: Database connected')

    const posts = await db
      .collection('posts')
      .find({})
      .sort({ date: -1 })
      .toArray()

    console.log('API: Posts found:', posts)

    if (!posts || posts.length === 0) {
      console.log('API: No posts found')
      return NextResponse.json({ posts: [] })
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET /api/posts error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { message: '게시글을 불러오는데 실패했습니다.', error: errorMessage },
      { status: 500 }
    )
  }
}

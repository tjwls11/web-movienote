import { NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/libs/mongodb'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: '게시글 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const comments = await db
      .collection('comments')
      .find({ postId: new ObjectId(postId) })
      .sort({ date: -1 })
      .toArray()

    return NextResponse.json(comments)
  } catch (error) {
    console.error('댓글 조회 중 오류:', error)
    return NextResponse.json(
      { error: '댓글을 불러오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { postId, content, author } = await request.json()
    const db = await connectToDatabase()

    const comment = {
      postId: new ObjectId(postId),
      content,
      author,
      date: new Date().toISOString(),
    }

    const result = await db.collection('comments').insertOne(comment)

    return NextResponse.json({
      _id: result.insertedId,
      ...comment,
    })
  } catch (error) {
    console.error('댓글 작성 중 오류:', error)
    return NextResponse.json(
      { error: '댓글 작성에 실패했습니다.' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { connectToDatabase } from '@/libs/mongodb'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const db = await connectToDatabase()

    // 숫자인 경우 (카테고리 ID)
    if (!isNaN(Number(id))) {
      const result = await db
        .collection('posts')
        .find({ categoryId: Number(id) }) // category -> categoryId로 수정
        .toArray()
      return Response.json(result)
    }

    // ObjectId인 경우 (게시글 ID)
    if (ObjectId.isValid(id)) {
      const result = await db
        .collection('posts')
        .findOne({ _id: new ObjectId(id) })

      if (!result) {
        return Response.json(
          { error: '게시글을 찾을 수 없습니다.' },
          { status: 404 }
        )
      }

      return Response.json(result)
    }

    return Response.json({ error: '유효하지 않은 ID입니다' }, { status: 400 })
  } catch (error) {
    console.error('Error:', error)
    return Response.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// 게시글 수정을 위한 PUT 요청 핸들러
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const db = await connectToDatabase()

    // 먼저 게시글을 조회하여 작성자 확인
    const existingPost = await db
      .collection('posts')
      .findOne({ _id: new ObjectId(id) })

    if (!existingPost) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 작성자 검증 (author로 비교)
    if (existingPost.author !== body.author) {
      return NextResponse.json(
        { message: '게시글 수정 권한이 없습니다.' },
        { status: 403 }
      )
    }

    // 권한이 확인된 경우에만 수정 진행
    const result = await db
      .collection('posts')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { title: body.title, content: body.content } }
      )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: '게시글을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: '게시글이 수정되었습니다.' })
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error)
    return NextResponse.json(
      { message: '게시글 수정에 실패했습니다.' },
      { status: 500 }
    )
  }
}

import connectMongoDB from '@/libs/mongodb'
import Post from '@/models/post'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

// 특정 게시글 조회
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await connectMongoDB() // MongoDB 연결

    // ID를 ObjectId로 변환
    const objectId = mongoose.Types.ObjectId.isValid(id)
      ? new mongoose.Types.ObjectId(id)
      : null
    if (!objectId) {
      return NextResponse.json(
        { message: 'Invalid ID format' },
        { status: 400 }
      )
    }

    const post = await Post.findById(objectId) // ID로 게시글 조회

    if (!post) {
      return NextResponse.json({ message: 'Post not found!' }, { status: 404 })
    }

    // MongoDB에서 불러온 게시글의 내용을 반환
    return NextResponse.json({ post }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/posts/[id]:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
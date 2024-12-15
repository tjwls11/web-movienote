import connectMongoDB from '@/libs/mongodb'
import Post from '@/models/post'
import { NextResponse } from 'next/server'

// 게시글 목록 조회 및 작성
export async function GET(request: Request) {
  try {
    await connectMongoDB()
    const posts = await Post.find() // 모든 게시글 조회
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error in GET posts:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// 게시글 작성
export async function POST(request: Request) {
  try {
    await connectMongoDB()
    const data = await request.json()
    const post = await Post.create(data)
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error in POST posts:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
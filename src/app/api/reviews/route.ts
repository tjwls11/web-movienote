// src/app/api/reviews/route.ts
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'

export async function POST(req: Request) {
  try {
    const { movieId, content, userName } = await req.json()

    if (!movieId || !content || !userName) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const reviewsCollection = db.collection('reviews')

    const result = await reviewsCollection.insertOne({
      movieId,
      content,
      userName,
      createdAt: new Date(),
    })

    return NextResponse.json({
      success: true,
      reviewId: result.insertedId,
    })
  } catch (error) {
    console.error('리뷰 저장 중 오류:', error)
    return NextResponse.json(
      { error: '리뷰 저장에 실패했습니다.' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const movieId = searchParams.get('movieId')

    if (!movieId) {
      return NextResponse.json(
        { error: '영화 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const reviews = await db
      .collection('reviews')
      .find({ movieId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('리뷰 조회 중 오류:', error)
    return NextResponse.json(
      { error: '리뷰 조회에 실패했습니다.' },
      { status: 500 }
    )
  }
}

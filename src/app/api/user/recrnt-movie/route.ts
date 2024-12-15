import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb' // MongoDB 연결 함수 가져오기

// POST 요청 처리
export async function POST(req: Request) {
  const { movieId } = await req.json() // 요청 본문에서 movieId 가져오기

  // ID가 없으면 에러 처리
  if (!movieId) {
    return NextResponse.json(
      { error: '영화 ID가 필요합니다.' },
      { status: 400 }
    )
  }

  // 데이터베이스에 영화 정보 저장
  const db = await connectToDatabase() // MongoDB에 연결
  await db.collection('recentMovies').insertOne({ id: movieId }) // 영화 ID 저장

  return NextResponse.json({ success: true })
}
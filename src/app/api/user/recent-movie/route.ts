import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb' // MongoDB 연결 함수 가져오기

// POST 요청 처리
export async function POST(req: Request) {
  const { user, movieId } = await req.json() // 요청 본문에서 user와 movieId 가져오기

  // ID가 없으면 에러 처리
  if (!user || !movieId) {
    return NextResponse.json(
      { error: '사용자와 영화 ID가 필요합니다.' },
      { status: 400 }
    )
  }

  // 데이터베이스에 연결
  const db = await connectToDatabase()

  // 사용자 문서 찾기
  const userDoc = await db.collection('recentMovies').findOne({ user })

  if (userDoc) {
    // 기존 영화 목록 업데이트
    const updatedMovies = [...userDoc.movies, movieId].slice(-5) // 최대 5개로 제한
    await db
      .collection('recentMovies')
      .updateOne({ user }, { $set: { movies: updatedMovies } })
  } else {
    // 새로운 사용자 문서 생성
    await db.collection('recentMovies').insertOne({
      user,
      movies: [movieId],
    })
  }

  return NextResponse.json({ success: true })
}

// GET 요청 처리
export async function GET(req: Request) {
  const url = new URL(req.url)
  const user = url.searchParams.get('user') // 쿼리 파라미터에서 user 가져오기

  // 사용자 이름이 없으면 에러 처리
  if (!user) {
    return NextResponse.json(
      { error: '사용자 이름이 필요합니다.' },
      { status: 400 }
    )
  }

  const db = await connectToDatabase()
  const userMovies = await db.collection('recentMovies').findOne({ user })

  return NextResponse.json({ movies: userMovies?.movies || [] })
}

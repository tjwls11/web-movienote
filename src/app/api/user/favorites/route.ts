import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'

// POST 요청 처리 (찜하기)
export async function POST(req: Request) {
  const { user, movieId } = await req.json()

  if (!user || !movieId) {
    return NextResponse.json(
      { error: '사용자와 영화 ID가 필요합니다.' },
      { status: 400 }
    )
  }

  const db = await connectToDatabase()
  const userDoc = await db.collection('favorites').findOne({ user })

  if (userDoc) {
    // 이미 찜한 영화인지 확인
    if (!userDoc.movies.includes(movieId)) {
      const updatedMovies = [...userDoc.movies, movieId]
      await db
        .collection('favorites')
        .updateOne({ user }, { $set: { movies: updatedMovies } })
    }
  } else {
    await db.collection('favorites').insertOne({
      user,
      movies: [movieId],
    })
  }

  return NextResponse.json({ success: true })
}

// DELETE 요청 처리 (찜 해제)
export async function DELETE(req: Request) {
  const { user, movieId } = await req.json()

  if (!user || !movieId) {
    return NextResponse.json(
      { error: '사용자와 영화 ID가 필요합니다.' },
      { status: 400 }
    )
  }

  const db = await connectToDatabase()
  await db
    .collection('favorites')
    .updateOne({ user }, { $pull: { movies: movieId } })

  return NextResponse.json({ success: true })
}

// GET 요청 처리 (찜한 영화 조회)
export async function GET(req: Request) {
  const url = new URL(req.url)
  const user = url.searchParams.get('user')

  if (!user) {
    return NextResponse.json(
      { error: '사용자 이름이 필요합니다.' },
      { status: 400 }
    )
  }

  const db = await connectToDatabase()
  const userFavorites = await db.collection('favorites').findOne({ user })

  return NextResponse.json({ movies: userFavorites?.movies || [] })
}

import { connectToDatabase } from '@/libs/mongodb'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // params를 비동기적으로 사용
  const { id } = await params // await 추가

  const db = await connectToDatabase()
  const recentMoviesCollection = db.collection('recentMovies')

  try {
    // ID를 숫자로 변환하여 검색
    const movie = await recentMoviesCollection.findOne({ movies: parseInt(id) })

    if (!movie) {
      return NextResponse.json(
        { success: false, message: 'Movie not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, movie }) // 영화 정보 반환
  } catch (error) {
    console.error('Error fetching movie:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

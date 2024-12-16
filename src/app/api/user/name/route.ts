import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'

// 이름 변경 요청 처리
export async function POST(request: Request) {
  const session = await auth()
  const { name } = await request.json()

  if (!session?.user?.email) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const db = await connectToDatabase()

  // 이름 변경 처리
  const result = await db
    .collection('users')
    .updateOne({ email: session.user.email }, { $set: { name } })

  if (result.modifiedCount === 0) {
    return NextResponse.json({ error: '이름 변경 실패' }, { status: 400 })
  }

  return NextResponse.json({ success: true, name }, { status: 200 })
}

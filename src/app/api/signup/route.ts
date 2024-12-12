import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('로그인 시도:', { email }) // 로깅 추가

    // 필수 항목 검사
    if (!email || !password) {
      return NextResponse.json(
        { message: '이메일과 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const db = await connectToDatabase()
    const usersCollection = db.collection('users')

    // 사용자 찾기
    const user = await usersCollection.findOne({ email })
    console.log('찾은 사용자:', user) // 로깅 추가

    if (!user) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    // 비밀번호 확인 (실제로는 암호화된 비밀번호를 비교해야 함)
    if (user.password !== password) {
      return NextResponse.json(
        { message: '이메일 또는 비밀번호가 일치하지 않습니다.' },
        { status: 401 }
      )
    }

    // 로그인 성공
    return NextResponse.json({
      message: '로그인 성공',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    console.error('로그인 에러:', error) // 로깅 추가
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

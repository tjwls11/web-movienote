import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    console.log('로그인 시도:', { email })

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
    const existingUser = await usersCollection.findOne({ email })
    if (!existingUser) {
      return NextResponse.json(
        { message: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    )
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: '비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // 로그인 성공
    return NextResponse.json({
      message: '로그인 성공',
    })
  } catch (error) {
    console.error('로그인 에러:', error)
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

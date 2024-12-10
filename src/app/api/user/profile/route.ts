import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'
import { ObjectId } from 'mongodb'

// GET 요청 처리 - 사용자 정보 조회
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const db = await connectToDatabase()

    const user = await db
      .collection('users')
      .findOne({ _id: new ObjectId(session.user.id) })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        id: user._id.toString(),
      },
    })
  } catch (error) {
    console.error('Get user info error:', error)
    return NextResponse.json(
      { error: '사용자 정보를 가져오는데 실패했습니다.' },
      { status: 500 }
    )
  }
}

// POST 요청 처리 - 프로필 이미지 업데이트
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      )
    }

    const formData = await req.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: '이미지가 필요합니다.' },
        { status: 400 }
      )
    }

    // 이미지를 Base64로 변환
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${imageFile.type};base64,${buffer.toString(
      'base64'
    )}`

    const db = await connectToDatabase()

    // MongoDB에서 사용자 찾기 및 업데이트
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          image: base64Image,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        ...session.user,
        image: base64Image,
      },
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: '프로필 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

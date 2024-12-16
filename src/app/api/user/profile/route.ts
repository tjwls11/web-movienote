import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/libs/mongodb'

// 프로필조회 요청 처리
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

    // 사용자 ID가 없는 경우 처리
    if (!session.user.id) {
      return NextResponse.json(
        { error: '유효하지 않은 사용자입니다.' },
        { status: 400 }
      )
    }

    const user = await db
      .collection('users')
      .findOne({ email: session.user.email })

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
        image: user.image || session.user.image || '/default-avatar.png',
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

// 프로필 업데이트 요청 처리
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

    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = `data:${imageFile.type};base64,${buffer.toString(
      'base64'
    )}`

    const db = await connectToDatabase()

    // 이메일로 사용자 찾기
    const user = await db
      .collection('users')
      .findOne({ email: session.user.email })

    if (!user) {
      return NextResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    // 소셜 로그인 사용자인 경우 원본 이미지 저장
    const updateData: any = {
      image: base64Image,
      updatedAt: new Date(),
    }

    if (!user.originalSocialImage && session.user.image) {
      updateData.originalSocialImage = session.user.image
    }

    const result = await db
      .collection('users')
      .findOneAndUpdate(
        { email: session.user.email },
        { $set: updateData },
        { returnDocument: 'after' }
      )

    if (!result) {
      return NextResponse.json({ error: '업데이트 실패' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        ...result,
        id: result._id.toString(),
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

// 프로필 복원 요청 처리
export async function PUT() {
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
      .findOne({ email: session.user.email })

    if (!user?.originalSocialImage) {
      return NextResponse.json(
        { error: '복원할 소셜 이미지가 없습니다.' },
        { status: 400 }
      )
    }

    const result = await db.collection('users').findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          image: user.originalSocialImage,
        },
        $unset: { originalSocialImage: '' },
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json(
        { error: '프로필 복원에 실패했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        ...result,
        id: result._id.toString(),
        image: user.originalSocialImage,
      },
    })
  } catch (error) {
    console.error('Profile restore error:', error)
    return NextResponse.json(
      { error: '프로필 복원에 실패했습니다.' },
      { status: 500 }
    )
  }
}

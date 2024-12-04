import connectMongoDB from '@/libs/mongodb'
import Memo from '@/models/memo'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json() // 클라이언트가 보낸 데이터 받기

    // 요청 본문에 title이나 description이 없으면 에러 반환
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      )
    }

    // MongoDB 연결
    await connectMongoDB()

    // Memo 생성
    await Memo.create({ title, description })

    // 성공적으로 생성된 경우, 성공 메시지 반환
    return NextResponse.json({ message: 'Memo created' }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/memos:', error)

    // 에러 발생 메시지
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectMongoDB()
    const memos = await Memo.find()
    return NextResponse.json({ memos })
  } catch (error) {
    console.error('Error in GET /api/memos:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 })
    }
    await connectMongoDB()
    const deletedMemo = await Memo.findByIdAndDelete(id)
    if (!deletedMemo) {
      return NextResponse.json({ message: 'Memo not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Memo deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/memos', error)
    return NextResponse.json(
      { message: 'internal Server Error' },
      { status: 500 }
    )
  }
}

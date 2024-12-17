import connectMongoDB from '@/libs/mongodb'
import Memo from '@/models/memo'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    await connectMongoDB()

    // 요청 데이터 로깅
    const requestData = await request.json()
    console.log('Received data:', requestData)

    const { title, content, author } = requestData

    // 필드 값 로깅
    console.log('Extracted fields:', { title, content, author })

    if (!title || !content || !author) {
      return NextResponse.json(
        { message: '제목, 내용, 작성자는 필수 항목입니다.' },
        { status: 400 }
      )
    }

    const newMemo = await Memo.create({
      title,
      content,
      author,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // 생성된 메모 로깅
    console.log('Created memo:', newMemo)

    return NextResponse.json(
      { message: 'Memo created successfully', memo: newMemo },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/memos:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectMongoDB()

    const memos = await Memo.find({}).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, memos })
  } catch (error) {
    console.error('Error in GET /api/memos:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch memos' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectMongoDB()

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      // id가 없으면 전체 삭제
      await Memo.deleteMany({})
      return NextResponse.json({ message: 'All memos deleted' })
    }

    // id가 있으면 해당 메모만 삭제
    const deletedMemo = await Memo.findByIdAndDelete(id)
    if (!deletedMemo) {
      return NextResponse.json({ message: 'Memo not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Memo deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete memos' },
      { status: 500 }
    )
  }
}

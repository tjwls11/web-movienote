import connectMongoDB from '@/libs/mongodb'
import Memo from '@/models/memo'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json()
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      )
    }
    await connectMongoDB()
    await Memo.create({ title, description })
    return NextResponse.json({ message: 'Memo created' }, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/memos:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectMongoDB()
    const memos = await Memo.find().sort({ createdAt: -1 })
    
    return NextResponse.json({
      success: true,
      memos: memos
    })
  } catch (error) {
    console.error('Error in GET /api/memos:', error)
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch memos',
      memos: []
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectMongoDB()

    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      // id가 없으면 전체 삭제
      await Memo.deleteMany({})
      return NextResponse.json({ message: "All memos deleted" })
    }

    // id가 있으면 해당 메모만 삭제
    const deletedMemo = await Memo.findByIdAndDelete(id)
    if (!deletedMemo) {
      return NextResponse.json({ message: 'Memo not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Memo deleted' }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete memos" }, { status: 500 })
  }
}
    
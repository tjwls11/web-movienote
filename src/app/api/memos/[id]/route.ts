import connectMongoDB from '@/libs/mongodb'
import Memo from '@/models/memo'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params
    const id = params.id
    
    const { newTitle: title, newDescription: description } = await request.json()
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Title and description are required' },
        { status: 400 }
      )
    }
    await connectMongoDB()
    const updatedMemo = await Memo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    )
    if (!updatedMemo) {
      return NextResponse.json({ message: 'Memo not found' }, { status: 404 })
    }
    return NextResponse.json(
      { message: 'Memo updated', memo: updatedMemo },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in PUT /api/memos/[id]:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params
    const id = params.id
    
    await connectMongoDB()
    const memo = await Memo.findOne({ _id: id })
    if (!memo) {
      return NextResponse.json({ message: 'Memo not found' }, { status: 404 })
    }
    return NextResponse.json({ memo }, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/memos/[id]:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    await connectMongoDB()
    const params = await context.params
    const id = params.id

    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { success: false, message: "유효하지 않은 메모 ID입니다" },
        { status: 400 }
      )
    }

    const deletedMemo = await Memo.findByIdAndDelete(id)
    if (!deletedMemo) {
      return NextResponse.json(
        { success: false, message: "메모를 찾을 수 없습니다" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "메모가 삭제되었습니다"
    })
  } catch (error) {
    console.error('Delete memo error:', error)
    return NextResponse.json(
      { success: false, message: "메모 삭제에 실패했습니다" },
      { status: 500 }
    )
  }
}

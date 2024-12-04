import connectMongoDB from '@/libs/mongodb'
import Memo from '@/models/memo'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } } // context에서 params를 비동기적으로 추출
) {
  try {
    const { id } = await context.params // params를 비동기적으로 접근

    const { newTitle: title, newDescription: description } =
      await request.json()

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    await connectMongoDB()
    const memo = await Memo.findOne({ _id: id })
    if (!memo) {
      return NextResponse.json({ message: 'Memo not found!' }, { status: 404 })
    }
    return NextResponse.json({ memo })
  } catch (error) {
    console.error('Error in GET /api/memos/[id]', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

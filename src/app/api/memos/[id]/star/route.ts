import { NextRequest, NextResponse } from 'next/server'
import connectMongoDB from '@/libs/mongodb'
import Memo from '@/models/memo'

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params
    const id = params.id
    await connectMongoDB()

    const memo = await Memo.findById(id)
    if (!memo) {
      return NextResponse.json(
        { success: false, message: '메모를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    memo.isStarred = !memo.isStarred
    await memo.save()

    return NextResponse.json({
      success: true,
      message: memo.isStarred
        ? '즐겨찾기에 추가되었습니다'
        : '즐겨찾기가 해제되었습니다',
      memo,
    })
  } catch (error) {
    console.error('Star toggle error:', error)
    return NextResponse.json(
      { success: false, message: '작업에 실패했습니다' },
      { status: 500 }
    )
  }
}

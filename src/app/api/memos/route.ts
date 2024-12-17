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

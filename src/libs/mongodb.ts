import mongoose from 'mongoose'
import { MongoClient } from 'mongodb'

let client: MongoClient | null = null

export default async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('몽고디비에 연결되었습니다')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

export async function connectToDatabase() {
  if (!client) {
    if (!process.env.MONGODB_URI) {
      throw new Error('MongoDB URI가 .env 파일에 없습니다')
    }
    client = new MongoClient(process.env.MONGODB_URI)
    await client.connect()
  }
  return client.db('movienote') // 데이터베이스 이름으로 수정
}

import mongoose from 'mongoose'

export default async function connectMongoDB() {
  try {
    console.log('MongoDB URI:', process.env.MONGODB_URI) // URI 확인
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('Connected to MongoDB. 몽고디비에 연결되었습니다')
  } catch (error) {
    console.error('MongoDB connection error:', error)
  }
}

import mongoose from 'mongoose'
export default async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('Connected to MongoDB.몽고디비에 연결되었습니다')
  } catch (error) {
    console.log(error)
  }
}

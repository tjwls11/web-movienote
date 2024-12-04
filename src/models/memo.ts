import mongoose, { Schema } from 'mongoose'

const memoSchema = new Schema(
  {
    title: { type: String, required: true }, // title 필드를 필수로 설정
    description: { type: String, required: true }, // description 필드를 필수로 설정
  },
  { timestamps: true } // createdAt, updatedAt 자동 추가
)

const Memo = mongoose.models.Memo || mongoose.model('Memo', memoSchema)

export default Memo

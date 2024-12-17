import mongoose, { Schema } from 'mongoose'

// 기존 모델 삭제 (이미 잘못된 스키마로 생성된 경우)
if (mongoose.models.Memo) {
  delete mongoose.models.Memo
}

// 스키마 재정의
const memoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // 스키마 옵션 추가
    timestamps: true,
    strict: true,
  }
)

const Memo = mongoose.model('Memo', memoSchema)

export default Memo

import mongoose, { Schema } from 'mongoose'

const memoScjema = new Schema(
  {
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)
const Memo = mongoose.models.Log || mongoose.model('Memo', memoScjema)

export default Memo

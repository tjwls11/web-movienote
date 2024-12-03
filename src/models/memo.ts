import mongoose, { Schema } from 'mongoose'

const memoSchema = new Schema(
  {
    title: String,
    description: String,
  },
  { timestamps: true }
)

const Memo = mongoose.models.Memo || mongoose.model('Memo', memoSchema)

export default Memo

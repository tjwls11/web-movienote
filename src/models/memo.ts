import mongoose, { Schema } from 'mongoose'

const memoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
)

const Memo = mongoose.models.Memo || mongoose.model('Memo', memoSchema)
export default Memo
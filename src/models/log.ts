import mongoose, { Schema } from 'mongoose'

const logScjema = new Schema(
  {
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)
const Log = mongoose.models.Log || mongoose.model('Log', logScjema)

export default Log

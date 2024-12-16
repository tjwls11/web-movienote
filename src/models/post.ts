import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Number,
    default: 0,
  },
})

<<<<<<< HEAD
export default mongoose.models.Post || mongoose.model('Post', PostSchema)
=======
export default mongoose.models.Post || mongoose.model('Post', PostSchema)
>>>>>>> 8b58a51f450a16dbb4e61ab94f14dbfd431baa47

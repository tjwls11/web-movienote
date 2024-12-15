import mongoose, { Schema } from 'mongoose'

interface IUser {
  name: string
  email: string
  authProvider: 'github' | 'google'
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  authProvider: { type: String, enum: ['github', 'google'], required: true },
})

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User
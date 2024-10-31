import { Schema, model } from 'mongoose'
import { IUser } from '../interfaces'

const userShema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      required: true
    },
    email: String,
    phone: String
  },
  { timestamps: true }
)

userShema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
  virtuals: true
})

export default model<IUser>('User', userShema)

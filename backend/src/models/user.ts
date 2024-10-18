import { Schema, model } from "mongoose";
import { IUser } from "../interfaces";

const userShema = new Schema<IUser>({
  username: {
    type: String,
    required: true
  },
  password_hash: {
    type: String,
    required: true
  },
  email: String,
  phone: String
})

userShema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
  virtuals: true,
})


export default model<IUser>('User', userShema)
import { Schema, model } from "mongoose"
import { IAdvertisement } from "../interfaces"

const advertisementSchema = new Schema<IAdvertisement>({
  file: {
    data: Buffer,
    type: String
  }
}, { timestamps: true})

advertisementSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
  virtuals: true,
})


export default model<IAdvertisement>('Advertisement', advertisementSchema)
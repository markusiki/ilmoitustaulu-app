import { Schema, model } from "mongoose"
import { IAnnouncement } from "../interfaces"

const announcementShema = new Schema<IAnnouncement>({
  category: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  contact_info: String,
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true
  },
  picture: String
}, { timestamps: true})

announcementShema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
  virtuals: true,
})


export default model<IAnnouncement>('Announcement', announcementShema)
import { ObjectId } from "mongoose"

export interface IAnnouncement {
  _id: ObjectId
  category: "asiakastoive" | "myynti-ilmoitus" 
  poster: string
  contact_info?: string
  title: string
  content: string
  picture?: string
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  username: string
  password_hash: string
  email?: string
  phone?: string
}

export interface IAdvertisement {
  file: {
    data: BinaryData
    type: string
  }
}
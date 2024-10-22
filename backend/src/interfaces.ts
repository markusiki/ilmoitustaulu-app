export interface IAnnouncement {
  category: "asiakastoive" | "myynti-ilmoitus" 
  poster: string
  contact_info?: string
  title: string
  content: string
  picture?: string
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
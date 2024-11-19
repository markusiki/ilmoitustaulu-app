import { JwtPayload } from "jsonwebtoken"
import { IncomingMessage } from "http"

export interface IAnnouncement {
  id: string
  category: 'asiakastoive' | 'myynti-ilmoitus'
  poster: string
  contact_info?: string
  title: string
  content: string
  file?: BinaryData
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface IUser {
  username: string
  passwordHash: string
  role: 'client' | 'admin'
  email?: string
  phone?: string
}

export interface IAdvertisement {
  id: string
  file: BinaryData
}

export interface DataToClients {
  initialData: {
    type: 'initialdata'
    data: {
      announcements: IAnnouncement[]
      advertisements: IAdvertisement[]
      newAnnouncementId: string
    }
  }
  advertisementAdd: {
    type: 'advertisementadd'
    data: {
      advertisement: IAdvertisement
    }
  }
  advertisementDelete: {
    type: 'advertisementdelete'
    data: {
      id: string
    }
  }
  announcementAdd: {
    type: 'announcementadd'
    data: {
      announcement: IAnnouncement | IAnnouncement[]
    }
  }
  announcementDelete: {
    type: 'announcementdelete'
    data: {
      id: string | string[]
    }
  }
  newAnnouncementId: {
    type: 'newannouncementid'
    data: {
      id: string
    }
  }
  types: DataToClients[
  | 'initialData'
  | 'advertisementAdd'
  | 'advertisementDelete'
  | 'announcementAdd'
  | 'announcementDelete'
  | 'newAnnouncementId']
}

export interface CustomJwtPayload extends JwtPayload {
  role?: "admin" | "client"
}

export interface CustomRequest extends Request {
  user?: string | JwtPayload
  access_token?: string | undefined
}

export interface CustomHttpRequest extends IncomingMessage {
  user?: string | CustomJwtPayload
  access_token: string | undefined
}

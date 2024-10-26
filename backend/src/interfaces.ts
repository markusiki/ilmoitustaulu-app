import { ObjectId } from 'mongoose'

export interface IAnnouncement {
  _id: ObjectId
  category: 'asiakastoive' | 'myynti-ilmoitus'
  poster: string
  contact_info?: string
  title: string
  content: string
  file?: {
    data: BinaryData
    type: string
  }
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
  _id: ObjectId
  file: {
    data: BinaryData
    type: string
  }
}

export interface DataToClients {
  advertisementAdd: {
    type: 'advertisementadd'
    data: {
      advertisement: IAdvertisement
    }
  }
  advertisementDelete: {
    type: 'advertisementdelete'
    data: {
      id: ObjectId
    }
  }
  annnouncementAdd: {
    type: 'announcementadd'
    data: {
      announcement: IAnnouncement
    }
  }
  announcementDelete: {
    type: 'announcementdelete'
    data: {
      id: ObjectId
    }
  }
  newAnnouncementId: {
    type: 'newannouncementid'
    data: {
      id: string
    }
  }
  types: DataToClients[
    | 'advertisementAdd'
    | 'advertisementDelete'
    | 'annnouncementAdd'
    | 'announcementDelete'
    | 'newAnnouncementId']
}

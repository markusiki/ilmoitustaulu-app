export interface IAnnouncement {
  id: string;
  category: "asiakastoive" | "myynti-ilmoitus";
  poster: string;
  contact_info?: string;
  title: string;
  content: string;
  file?: string;
}

export interface IAdvertisement {
  id: string;
  file: string;
}

export interface DataFromServer {
  type:
  | "initialdata"
  | "advertisementadd"
  | "advertisementdelete"
  | "announcementadd"
  | "announcementdelete"
  | "newannouncementid";
  data: {
    announcements: IAnnouncement[];
    advertisements: IAdvertisement[];
    announcement: IAnnouncement | IAnnouncement[];
    advertisement: IAdvertisement;
    newAnnouncementId: string;
    id: string;
  };
}

export interface CustomResponse extends Response {
  role: "admin" | "client"
  message: string
}

export interface IAnnouncement {
  id: string;
  category: "asiakastoive" | "myynti-ilmoitus";
  poster: string;
  contact_info?: string;
  title: string;
  content: string;
  file?: {
    data: BinaryData;
    type: string;
  };
}

export interface IAdvertisement {
  id: string;
  file: BinaryData;
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
    newAnnouncmentId: string;
    id: string;
  };
}

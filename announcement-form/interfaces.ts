export interface IAnnouncement {
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

export interface AnnouncementFormProps {
  handleNewAnnouncement: any;
}

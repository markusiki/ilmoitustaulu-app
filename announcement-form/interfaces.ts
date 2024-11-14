export interface IAnnouncement {
  category: "asiakastoive" | "myynti-ilmoitus"
  poster: string
  contact_info?: string
  title: string
  content: string
  file?: string
}

export interface AnnouncementFormProps {
  handleNewAnnouncement: any
}

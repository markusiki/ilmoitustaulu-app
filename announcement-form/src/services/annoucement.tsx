import axios from 'axios'
import { IAnnouncement } from '../../interfaces'
const id = window.location.pathname.split('/')[2]
const url = `${window.location.origin}/api/announcements/add/${id}`
interface ServerResponse {
  message: string
}

const sendAnnouncement = async (announcement: IAnnouncement) => {
  console.log(url)
  const response = await axios.post<ServerResponse>(url, announcement)

  return response
}

export default sendAnnouncement

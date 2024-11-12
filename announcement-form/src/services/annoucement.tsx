import axios from 'axios'
import { IAnnouncement } from '../../interfaces'
const id = window.location.pathname.split('/')[2]
const url = 'http://192.168.1.103:5000/api/announcements/add/' + id

interface ServerResponse {
  message: string
}

const sendAnnouncement = async (announcement: IAnnouncement) => {
  console.log(url)
  const response = await axios.post<ServerResponse>(url, announcement)

  return response
}

export default sendAnnouncement

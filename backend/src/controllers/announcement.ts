import express, { Express } from "express";
import { IAnnouncement } from "../interfaces";
import Announcement from '../models/announcement'

const announcementRouter = express.Router()

announcementRouter.get('/getall', async (req, res) => {
  try {
    const announcements = await Announcement.find({})
    res.status(200).json(announcements)
  } catch (error) {
    console.log(error)
    res.status(400).json()
  }
})

announcementRouter.post('/add', async (req, res) => {
  try {
    const body: IAnnouncement = req.body

    const newAnnouncement = new Announcement({
      category: body.category,
      poster: body.poster,
      contact_info: body.contact_info,
      title: body.title,
      content: body.content,
      picture: body.picture
    })

    const savedAnnouncement = await newAnnouncement.save()
    res.status(200).json(savedAnnouncement)

  } catch(error) {
    console.log(error)
    res.status(400).json()
  }
})

export default announcementRouter
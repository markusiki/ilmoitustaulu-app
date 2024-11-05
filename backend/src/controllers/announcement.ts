import express from 'express'
import { DataToClients, IAnnouncement } from '../interfaces'
import Announcement from '../models/announcement'
import { sendContentToAllClients } from './webSocketController'
import mongoose, { HydratedDocument } from 'mongoose'
import { clearIdTTL, IdValidator, removeIdFromList } from '../utils/idManager'
import { authorization, CustomRequest } from '../utils/middleware'

const announcementRouter = express.Router()

announcementRouter.get('/getall', authorization, async (req, res, next) => {
  try {
    const announcements = await Announcement.find({})
    res.status(200).json(announcements)
  } catch (error) {
    console.log(error)
    res.status(400).json()
  }
})

announcementRouter.post('/add/:id', IdValidator, async (req, res) => {
  try {
    const body: IAnnouncement = req.body
    const id = req.params.id

    const newAnnouncement: HydratedDocument<IAnnouncement> = new Announcement({
      _id: new mongoose.Types.ObjectId(req.params.id),
      category: body.category,
      poster: body.poster,
      contact_info: body.contact_info,
      title: body.title,
      content: body.content,
      file: body.file
    })
    console.log(newAnnouncement)
    const savedAnnouncement = await newAnnouncement.save()
    const announcementToSend: DataToClients['annnouncementAdd'] = {
      type: 'announcementadd',
      data: {
        announcement: savedAnnouncement
      }
    }
    res.status(200).json({ message: 'Saved successfully' })
    clearIdTTL(id)
    removeIdFromList(id)
    sendContentToAllClients(announcementToSend)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error in saving announcement' })
  }
})

export default announcementRouter

import express from 'express'
import { IAnnouncement } from '../interfaces'
import Announcement from '../models/announcement'
import mongoose, { HydratedDocument } from 'mongoose'
import {
  clearIdTimeout,
  IdValidator,
  removeIdFromList
} from '../utils/idManager'
import { handleNewAnnoucement } from '../utils/announcementManager'

const announcementRouter = express.Router()

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

    const status = await handleNewAnnoucement(newAnnouncement)
    res.status(200).json({
      message: status
        ? status.message
        : 'New announcement could not be handeled'
    })
    clearIdTimeout(id)
    removeIdFromList(id)
  } catch (error) {
    console.log(error)
    res.status(400).json({ error: 'Error in saving announcement' })
  }
})

export default announcementRouter

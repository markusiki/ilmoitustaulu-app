import express from 'express'
import { IAnnouncement } from '../interfaces'
import Announcement from '../models/announcement'
import { sendContentToAllClients } from './webSocketController'
import mongoose, { HydratedDocument } from 'mongoose'
import { IdValidator, removeIdFromList } from '../utils/idManager'

const announcementRouter = express.Router()

announcementRouter.get('/getall', async (req, res) => {
  console.log('called')
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
      picture: body.picture
    })

    const savedAnnouncement = await newAnnouncement.save()
    res.status(200).json(savedAnnouncement)
    removeIdFromList(id)
    sendContentToAllClients()
  } catch (error) {
    console.log(error)
    res.status(400).json()
  }
})

export default announcementRouter

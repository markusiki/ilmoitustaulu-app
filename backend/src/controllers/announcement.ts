import express, { Express } from "express";
import wss from '../index'
import { IAnnouncement } from "../interfaces";
import Announcement from '../models/announcement'
import {sendContentToAllClients} from './webSocketController'
import { HydratedDocument } from "mongoose";

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

announcementRouter.post('/add', async (req, res) => {
  try {
    const body: IAnnouncement = req.body

    const newAnnouncement: HydratedDocument<IAnnouncement> = new Announcement({
      category: body.category,
      poster: body.poster,
      contact_info: body.contact_info,
      title: body.title,
      content: body.content,
      picture: body.picture
    })

    const savedAnnouncement = await newAnnouncement.save()
    res.status(200).json(savedAnnouncement)
    sendContentToAllClients()

  } catch(error) {
    console.log(error)
    res.status(400).json()
  }
})

export default announcementRouter
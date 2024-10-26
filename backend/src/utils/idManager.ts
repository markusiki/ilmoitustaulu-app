import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import Announcement from '../models/announcement'
import { sendContentToAllClients } from '../controllers/webSocketController'
import { DataToClients } from '../interfaces'

let idList: string[] = []

export const IdValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id
  console.log('id: ', id)
  if (!idList.includes(id)) {
    res.status(401).json({ error: 'invalid id' })
    return
  }
  if (await Announcement.exists({ _id: id })) {
    res.status(401).json({ error: 'announcement with the id exists already' })
    return
  }
  next()
}

export const createNewId = () => {
  const id = new mongoose.Types.ObjectId()
  idList.push(id.toString())
  return id.toString()
}

export const removeIdFromList = (id: string) => {
  idList.splice(
    idList.findIndex((element) => element === id),
    1
  )
}

export const sendNewAnnouncementIdToClients = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newAnnouncementId: DataToClients['newAnnouncementId'] = {
    type: 'newannouncementid',
    data: {
      id: createNewId()
    }
  }
  sendContentToAllClients(newAnnouncementId)
  next()
}

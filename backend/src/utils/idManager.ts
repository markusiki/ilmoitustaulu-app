import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { sendContentToAllClients } from '../controllers/webSocketController'
import { DataToClients } from '../interfaces'

class Id {
  id
  timeout: null | NodeJS.Timeout
  constructor(id: mongoose.Types.ObjectId) {
    this.id = id
    this.timeout = null
  }
  setTimeout() {
    const delayToRemove =
      this.id.getTimestamp().getMilliseconds() +
      TTL -
      this.id.getTimestamp().getMilliseconds()

    this.timeout = setTimeout(() => {
      removeIdFromList(this.id.toString())
    }, delayToRemove)
  }

  clearTimeout() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}

const announcementIdExpiration = 0.5 //minutes
const TTL = announcementIdExpiration * 60000
let idList: Id[] = []

export const IdValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id

  if (
    !idList.some((element) => {
      return element.id.toString() === id
    })
  ) {
    res.status(401).json({ error: 'invalid id' })
    return
  }
  next()
}

const createNewId = () => {
  const ObjectId = new mongoose.Types.ObjectId()
  const idObject = new Id(ObjectId)
  idList.push(idObject)
  return idObject.id
}

export const getAnnouncementId = () => {
  if (idList.length > 1) {
    return idList[0].id.toString()
  } else {
    return createNewId().toString()
  }
}

export const removeIdFromList = (id: string) => {
  const idToDelete = idList.findIndex((element) => element.id.toString() === id)
  if (idToDelete !== -1) {
    idList.splice(idToDelete, 1)
    console.log('deleted id ', id)
  }
}

export const sendNewAnnouncementIdToClients = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const newAnnouncementId: DataToClients['newAnnouncementId'] = {
    type: 'newannouncementid',
    data: {
      id: createNewId().toString()
    }
  }
  sendContentToAllClients(newAnnouncementId)
  next()
}

export const setIdTTL = (req: Request, res: Response, next: NextFunction) => {
  const idObject = idList.find(
    (element) => element.id.toString() === req.params.id
  )
  if (idObject) {
    idObject.setTimeout()
  }
  next()
}

export const clearIdTTL = (id: string) => {
  const idObject = idList.find((element) => element.id.toString() === id)
  if (idObject) {
    idObject.clearTimeout()
  }
}

import { Server as WebSocketServer, WebSocket, RawData } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import Announcement from '../models/announcement'
import Advertisement from '../models/advertisement'
import { CustomHttpRequest, DataToClients, CustomJwtPayload } from '../interfaces'
import { getNewAnnouncementId } from '../utils/idManager'
import { getPublishedAnnouncements } from '../utils/announcementManager'


interface CustomWebSocket extends WebSocket {
  id: string
}

interface Client {
  connection: CustomWebSocket
  user: CustomHttpRequest["user"]
}

interface DataFromClient {
  type: string
  username: string
  content?: string
  id?: string
  data?: {
    file: Blob
  }
}

interface JsonData {
  data?: {
    users?: {
      [userId: string]: DataFromClient
    }
    userContent?: string[]
  }
  type: string
}

// Maintain active connections and users
const clients: { [userId: string]: Client } = {}

// Define event types
const eventTypes = {
  ADVERTISEMENT_ADD: 'advertisementadd',
  ADVERTISEMENT_DELETE: 'advertisementdelete',
  ANNOUNCEMENT_DELETE: 'announcementdelete'
}

// Broadcast announcement to new client
const sendContent = async (connection: WebSocket) => {
  try {
    const announcements = await getPublishedAnnouncements()
    const advertisements = await Advertisement.find({})
    const newAnnouncementId = getNewAnnouncementId()
    const data: DataToClients['initialData'] = {
      type: 'initialdata',
      data: {
        announcements: announcements,
        advertisements: advertisements,
        newAnnouncementId: newAnnouncementId
      }
    }
    connection.send(JSON.stringify(data))
  } catch (error) {
    connection.send('Error: Cannot fetch announcements')
    console.log(error)
  }
}

const sendError = async (connection: WebSocket, message: string) => {
  const errorMessage = {
    type: 'error',
    data: {
      message: message
    }
  }
  try {
    connection.send(JSON.stringify(errorMessage))
  } catch (error) {
    console.log(error)
  }
}

// Broadcast a message to all connected clients
export const sendContentToAllClients = async (data: DataToClients['types']) => {
  for (const userId in clients) {
    const client = clients[userId].connection
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  }
}

// Handle content update
const processReceivedMessage = async (
  message: RawData,
  connection: CustomWebSocket
) => {
  const dataFromClient: DataFromClient = JSON.parse(message.toString())

  if (dataFromClient.type === eventTypes.ADVERTISEMENT_ADD) {
    try {
      const dataFile = dataFromClient.data!.file
      const newAdvertisement = new Advertisement({
        file: dataFile
      })

      const receivedAdvertisement = await newAdvertisement.save()
      if (receivedAdvertisement) {
        const advertisementToSend: DataToClients['advertisementAdd'] = {
          type: 'advertisementadd',
          data: {
            advertisement: {
              id: receivedAdvertisement.toJSON().id,
              file: receivedAdvertisement.file
            }
          }
        }
        sendContentToAllClients(advertisementToSend)
      }
    } catch (error) {
      const message = `Error happened during advertisement saving, error: ${error}`
      sendError(connection, message)
      console.log(error)
    }
  }
  if (dataFromClient.type === eventTypes.ADVERTISEMENT_DELETE) {
    try {
      const deletedAdvertisement = await Advertisement.findByIdAndDelete(
        dataFromClient.id
      )
      if (deletedAdvertisement) {
        const advertisementToDelete: DataToClients['advertisementDelete'] = {
          type: 'advertisementdelete',
          data: {
            id: deletedAdvertisement._id.toString()
          }
        }
        sendContentToAllClients(advertisementToDelete)
      }
    } catch (error) {
      const message = `Error happened during advertisement deletion, error: ${error}`
      sendError(connection, message)
      console.log(error)
    }
  }
  if (dataFromClient.type === eventTypes.ANNOUNCEMENT_DELETE) {
    try {
      const deletedAnnouncement = await Announcement.findByIdAndDelete(
        dataFromClient.id
      )
      if (deletedAnnouncement) {
        const announcementToDelete: DataToClients['announcementDelete'] = {
          type: 'announcementdelete',
          data: {
            id: deletedAnnouncement._id.toString()
          }
        }
        sendContentToAllClients(announcementToDelete)
      }
    } catch (error) {
      const message = `Error happened during announcement deletion, error: ${error}`
      sendError(connection, message)
      console.log(error)
    }
  }
}

// Handle disconnection of a client
const handleClientDisconnection = (userId: string) => {
  console.log(`${userId} disconnected.`)
  delete clients[userId]
}

// Handle new client connections
export const setupWebSocket = (wss: WebSocketServer) => {
  wss.on('connection', async (connection: CustomWebSocket, request: CustomHttpRequest) => {
    const userId = uuidv4()
    console.log('Received a new connection')

    connection.id = userId
    clients[userId] = { connection, user: request.user }
    console.log(`${userId} connected.`)
    sendContent(connection)

    connection.on('message', (message) => {
      const userType = (Object.entries(clients).find(([id]) => id === connection.id)?.[1].user as CustomJwtPayload).role
      if (userType !== 'admin') {
        connection.send(JSON.stringify({ error: 'Unauthorized access' }))
      }

      processReceivedMessage(message, connection)

    })
    connection.on('close', () => handleClientDisconnection(userId))
  })
}

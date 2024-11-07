import { Server as WebSocketServer, WebSocket, RawData } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import Announcement from '../models/announcement'
import Advertisement from '../models/advertisement'
import { DataToClients } from '../interfaces'
import { getNewAnnouncementId } from '../utils/idManager'
import { getPublishedAnnouncements } from '../utils/announcementManager'

interface Client {
  readyState: number
  send(data: string): void
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
const users: { [userId: string]: DataFromClient } = {}

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
    const newAnnouncmentId = getNewAnnouncementId()
    const data: DataToClients['initialData'] = {
      type: 'initialdata',
      data: {
        announcements: announcements,
        advertisements: advertisements,
        newAnnouncmentId: newAnnouncmentId
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
    const client = clients[userId]
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  }
}

// Handle content update
const processReceivedMessage = async (
  message: RawData,
  connection: WebSocket
) => {
  const dataFromClient: DataFromClient = JSON.parse(message.toString())
  const json: JsonData = { type: dataFromClient.type }

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
      const message = `Error happened durin advertisement saving, error: ${error}`
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
  delete users[userId]
}

// Handle new client connections
export const setupWebSocket = (wss: WebSocketServer) => {
  wss.on('connection', async (connection) => {
    const userId = uuidv4()
    console.log('Received a new connection')

    clients[userId] = connection
    console.log(`${userId} connected.`)
    sendContent(connection)

    connection.on('message', (message) =>
      processReceivedMessage(message, connection)
    )
    connection.on('close', () => handleClientDisconnection(userId))
  })
}

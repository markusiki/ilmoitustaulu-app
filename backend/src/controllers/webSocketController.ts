import { Server as WebSocketServer, WebSocket, RawData } from 'ws'
import { v4 as uuidv4 } from 'uuid'
import Announcement from '../models/announcement'
import { IAnnouncement } from '../interfaces'
import { createNewId } from '../utils/idManager'

interface Client {
  readyState: number
  send(data: string): void
}

interface DataFromClient {
  type: string
  username: string
  content?: string
  id?: string
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
  ADVERTISEMENT_ADD: 'advertisementtadd',
  ADVERTISEMENT_DELETE: 'advertisementdelete',
  ANNOUNCEMENT_DELETE: 'announcementdelete'
}

// Broadcast announcement to new client
const sendContent = async (connection: WebSocket) => {
  try {
    const announcements = await Announcement.find({})
    const newAnnouncmentId = createNewId()
    const data = {
      announcements: announcements,
      newAnnouncmentId: newAnnouncmentId
    }
    connection.send(JSON.stringify(data))
  } catch (error) {
    connection.send('Error: Cannot fetch announcements')
    console.log(error)
  }
}

// Broadcast a message to all connected clients
export const sendContentToAllClients = async (newAnnouncmentId?: string) => {
  const announcements = await Announcement.find({})
  const data = newAnnouncmentId
    ? { announcmentId: newAnnouncmentId }
    : { announcements: announcements }
  for (const userId in clients) {
    const client = clients[userId]
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data))
    }
  }
}

// Handle content update
const processReceivedMessage = async (message: RawData, userId: string) => {
  const dataFromClient: DataFromClient = JSON.parse(message.toString())
  const json: JsonData = { type: dataFromClient.type }

  if (dataFromClient.type === eventTypes.ADVERTISEMENT_ADD) {
    // adds advertisement to database
  }
  if (dataFromClient.type === eventTypes.ADVERTISEMENT_DELETE) {
    // deletes advertisement from database
  }
  if (dataFromClient.type === eventTypes.ANNOUNCEMENT_DELETE) {
    try {
      const deletedAnnouncement = await Announcement.findByIdAndDelete(
        dataFromClient.id
      )
    } catch (error) {
      console.log(error)
    }
  }

  sendContentToAllClients()
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
      processReceivedMessage(message, userId)
    )
    connection.on('close', () => handleClientDisconnection(userId))
  })
}

import config from './utils/config'
import express, { Express, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import announcementRouter from './controllers/announcement'
import path from 'path'
import setCleaner from './services/cleaner'
import {
  IdValidator,
  sendNewAnnouncementIdToClients,
  setIdTTL
} from './utils/idManager'
import { checkTrailingSlash } from './utils/middleware'

const app: Express = express()
app.enable('strict routing')

mongoose
  .connect(config.MONGODB_URI!)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connection to MongoDB', error.message)
  })

app.use(express.json())

//APIs
app.use('/api/announcements', announcementRouter)

//Routes
app.use(
  '/new/:id',
  checkTrailingSlash,
  IdValidator,
  setIdTTL,
  sendNewAnnouncementIdToClients,

  express.static(path.join(__dirname, '../build/newannouncement'))
)
app.use(
  '/newannouncement',
  express.static(path.join(__dirname, '../build/newannouncement'))
)
app.use(
  '/controllerview',
  express.static(path.join(__dirname, '../build/controllerview'))
)
app.use(express.static(path.join(__dirname, '../build/ws')))

setCleaner()

export default app

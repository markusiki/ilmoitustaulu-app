import config from './utils/config'
import express, { Express, Request, Response } from 'express'
import mongoose from 'mongoose'
import announcementRouter from './controllers/announcement'
import path from 'path'
import setCleaner from './services/cleaner'
import { sendNewAnnouncementIdToClients } from './utils/idManager'

const app: Express = express()

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
app.use('/', (req, res, next) => {
  if (req.url.startsWith('/new')) {
    app.use(express.static(path.join(__dirname, '../build/new')))
  }
  if (req.url.startsWith('/announcements')) {
    app.use(express.static(path.join(__dirname, '../build/ws')))
  }
  if (req.url.startsWith('/controller')) {
    app.use(express.static(path.join(__dirname, '../build/controller')))
  }
  next()
})

app.use('/announcements', express.static('build/ws'))
app.use('/new', sendNewAnnouncementIdToClients, express.static('build/new'))
app.use('/controller', express.static('build/controller'))

setCleaner()

export default app

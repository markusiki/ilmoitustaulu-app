import config from './utils/config'
import express, { Express, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import announcementRouter from './controllers/announcement'
import path from 'path'
import { setAnnouncementManager } from './utils/announcementManager'
import { IdValidator, handleId } from './utils/idManager'
import { checkTrailingSlash } from './utils/middleware'
import loginRouter from './controllers/login'

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

app.use(cors())
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ limit: '20mb', extended: true }))
app.use(cookieParser())

//APIs
app.use('/api/login', loginRouter)
app.use('/api/announcements', announcementRouter)

//Routes
app.use(
  '/new/:id',
  checkTrailingSlash,
  IdValidator,
  handleId,

  express.static(path.join(__dirname, '../build/form'))
)
// Serves form's satatic files
app.use(
  '/newannouncement',
  express.static(path.join(__dirname, '../build/form'))
)
//for testing
app.use(
  '/controllerview',
  express.static(path.join(__dirname, '../build/controllerview'))
)
app.use(express.static(path.join(__dirname, '../build/client')))

setAnnouncementManager()

export default app

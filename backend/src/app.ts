import config from './utils/config'
import express, { Express, NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import announcementRouter from './controllers/announcement'
import path from 'path'
import setCleaner from './services/cleaner'
import { IdValidator, sendNewAnnouncementIdToClients } from './utils/idManager'
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
/* app.use((req, res, next) => {
  console.log('url: ', req.url)
  console.log('path: ', req.path)
  console.log('baseURL: ', req.baseUrl)
  console.log(req.params.id)
  if (req.url.startsWith('/new')) {
    console.log('called')
    app.use(
      [
        IdValidator,
        sendNewAnnouncementIdToClients,
        (req: Request, res: Response, next: NextFunction) => {
          console.log('second called')
          next()
        }
      ],
      express.static(path.join(__dirname, '../build/new'), { redirect: false })
    )
  }
  if (req.url.startsWith('/announcements')) {
    app.use(express.static(path.join(__dirname, '../build/ws')))
  }
  if (req.url.startsWith('/controller')) {
    app.use(
      express.static(path.join(__dirname, '../build/controller'), {
        redirect: false
      })
    )
  }
  next()
}) */

app.use(
  '/new/:id',
  checkTrailingSlash,
  IdValidator,
  sendNewAnnouncementIdToClients,
  express.static(path.join(__dirname, '../build/newannouncement'))
)
app.use(
  '/newannouncement',
  express.static(path.join(__dirname, '../build/newannouncement'))
)
app.use(
  '/controller',
  express.static(path.join(__dirname, '../build/controllerview'))
)
app.use(express.static(path.join(__dirname, '../build/ws')))

setCleaner()

export default app

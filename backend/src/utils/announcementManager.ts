import { HydratedDocument } from 'mongoose'
import { DataToClients, IAnnouncement } from '../interfaces'
import Announcement from '../models/announcement'
import { setInterval } from 'timers'
import { sendContentToAllClients } from '../controllers/webSocketController'

const maxAgeDays = 14 * 86400000
const maxCustomerWishCount = 18
const maxSaleAnnouncementCount = 18
const intervalDays = 1
const delay = intervalDays * 86400000

const deleteOldAnnouncements = async (
  category: IAnnouncement['category'],
  limit: number
) => {
  const ageLimit = new Date()
  ageLimit.setSeconds(ageLimit.getSeconds() - maxAgeDays)
  try {
    const documentsToDelete = await Announcement.find({
      category: category,
      publishedAt: { $lt: ageLimit }
    })
      .limit(limit)
      .exec()

    if (documentsToDelete.length > 0) {
      const deleteIds = documentsToDelete.map((doc) => doc._id)
      const deletedAnnouncements = await Announcement.deleteMany({
        _id: { $in: deleteIds }
      }).exec()
      sendContentToAllClients({
        type: 'announcementdelete',
        data: { id: deleteIds.toString() }
      })

      return deletedAnnouncements.deletedCount
    }
  } catch (error) {
    console.log('error deleting old announcements: ', error)
  }
}

const getAnnouncementsFromQueue = async (
  category: IAnnouncement['category'],
  count: number
) => {
  const announcementsFromQueue = await Announcement.find({
    category: category,
    publishedAt: { $exists: false }
  })
    .sort({ createdAt: 1 })
    .limit(count)

  const ids = announcementsFromQueue.map((announcement) => announcement._id)

  const result = await Announcement.updateMany(
    { _id: { $in: ids } },
    { $set: { publishedAt: new Date() } }
  )
  if (result.acknowledged) {
    const announcementsToPublish = await Announcement.find({
      _id: { $in: ids }
    })
    sendContentToAllClients({
      type: 'announcementadd',
      data: {
        announcement: announcementsToPublish
      }
    })
  }
}

const changeAnnouncements = async () => {
  const customerWishesCount = await Announcement.countDocuments({
    category: 'asiakastoive'
  }).exec()
  const saleAnnouncementsCount = await Announcement.countDocuments({
    category: 'myynti-ilmoitus'
  }).exec()

  if (customerWishesCount > maxCustomerWishCount) {
    const limit = customerWishesCount - maxCustomerWishCount
    const deletedCount = await deleteOldAnnouncements('asiakastoive', limit)
    if (deletedCount) {
      getAnnouncementsFromQueue('asiakastoive', deletedCount)
    }
  }
  if (saleAnnouncementsCount > maxSaleAnnouncementCount) {
    const limit = saleAnnouncementsCount - maxSaleAnnouncementCount
    const deletedCount = await deleteOldAnnouncements('myynti-ilmoitus', limit)
    if (deletedCount) {
      getAnnouncementsFromQueue('myynti-ilmoitus', deletedCount)
    }
  }
}

const maxCount = (category: IAnnouncement['category']) => {
  switch (category) {
    case 'asiakastoive':
      return maxCustomerWishCount
    case 'myynti-ilmoitus':
      return maxSaleAnnouncementCount
  }
}

export const handleNewAnnoucement = async (
  newAnnouncement: HydratedDocument<IAnnouncement>
) => {
  try {
    const publishedAnnouncementsCount = await Announcement.where('publishedAt')
      .exists(true)
      .find({ category: newAnnouncement.category })
      .countDocuments()

    // Publish announcement
    if (publishedAnnouncementsCount < maxCount(newAnnouncement.category)) {
      newAnnouncement.publishedAt = new Date()
      const savedAnnouncement = await newAnnouncement.save()
      const announcementToSend: DataToClients['annnouncementAdd'] = {
        type: 'announcementadd',
        data: {
          announcement: savedAnnouncement
        }
      }
      sendContentToAllClients(announcementToSend)
      return { message: 'Announcement saved and published succesfully' }
    }
    // Put announcement to queue
    else {
      await newAnnouncement.save()
      return { message: 'Announcement saved succesfully and put to queue' }
    }
  } catch (error) {
    console.log(error)
  }
}

export const setAnnouncementManager = () => {
  setInterval(async () => {
    await changeAnnouncements()
  }, delay)
}
export const getPublishedAnnouncements = async () => {
  const publishedAnnouncements = await Announcement.find({
    publishedAt: { $exists: true }
  })

  return publishedAnnouncements
}

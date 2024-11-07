import { HydratedDocument } from 'mongoose'
import { DataToClients, IAnnouncement } from '../interfaces'
import Announcement from '../models/announcement'
import { setInterval } from 'timers'
import { sendContentToAllClients } from '../controllers/webSocketController'

const maxAgeDays = 14
const maxCustomerWishCount = 18
const maxSaleAnnouncementCount = 18
const intervalDays = 1
const delay = intervalDays * 86400000

const deleteOldAnnouncements = async (
  category: IAnnouncement['category'],
  limit: number
) => {
  const ageLimit = new Date()
  ageLimit.setDate(ageLimit.getDate() - maxAgeDays)

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

const publishAnnouncementsFromQueue = async (
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
    return true
  }
  return false
}

const countAnnouncements = async (category: IAnnouncement['category']) => {
  return await Announcement.countDocuments({
    category: category
  }).exec()
}

const handleAnnouncementsChange = async (
  category?: IAnnouncement['category']
) => {
  const changeAnnouncements = async (category: IAnnouncement['category']) => {
    const announcementCount = await countAnnouncements(category)
    const maxCount = getMaxCount(category)

    if (announcementCount > maxCount) {
      const limit = announcementCount - maxCount
      const deletedCount = await deleteOldAnnouncements(category, limit)
      if (deletedCount) {
        return await publishAnnouncementsFromQueue(category, deletedCount)
      }
    }
    return false
  }

  if (category) {
    return await changeAnnouncements(category)
  } else {
    changeAnnouncements('asiakastoive')
    changeAnnouncements('myynti-ilmoitus')
  }
}

const getMaxCount = (category: IAnnouncement['category']) => {
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

    const maxCount = getMaxCount(newAnnouncement.category)

    if (publishedAnnouncementsCount < maxCount) {
      newAnnouncement.publishedAt = new Date()
      const savedAnnouncement = await newAnnouncement.save()
      const announcementToSend: DataToClients['announcementAdd'] = {
        type: 'announcementadd',
        data: {
          announcement: savedAnnouncement
        }
      }
      sendContentToAllClients(announcementToSend)
      return { message: 'Announcement saved and published succesfully' }
    } else {
      await newAnnouncement.save()
      const isPublished = await handleAnnouncementsChange(
        newAnnouncement.category
      )
      console.log('published', isPublished)
      return {
        message: isPublished
          ? 'Announcement saved and published succesfully'
          : 'Announcement saved succesfully and put to queue'
      }
    }
  } catch (error) {
    console.log(error)
  }
}

export const getPublishedAnnouncements = async () => {
  const publishedAnnouncements = await Announcement.find({
    publishedAt: { $exists: true }
  })

  return publishedAnnouncements
}

export const setAnnouncementManager = () => {
  setInterval(async () => {
    await handleAnnouncementsChange()
  }, delay)
}

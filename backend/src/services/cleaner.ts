// Removes old announcements

import Announcement from '../models/announcement'
import { IAnnouncement } from '../interfaces'
import { setInterval } from 'timers'

const maxAgeDays = 7
const maxAnnouncementsCount = 18
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
      createdAt: { $lt: ageLimit },
    })
      .limit(limit)
      .exec()

    const deleteIds = documentsToDelete.map((doc) => doc._id)
    await Announcement.deleteMany({
      _id: { $in: deleteIds },
    }).exec()
  } catch (error) {
    console.log('error deleting old announcements: ', error)
  }
}

const cleanAnnouncements = async () => {
  const customerWishesCount = await Announcement.countDocuments({
    category: 'asiakastoive',
  }).exec()
  const saleAnnouncementsCount = await Announcement.countDocuments({
    category: 'myynti-ilmoitus',
  }).exec()
  console.log(
    'customerWishesCount: ',
    customerWishesCount,
    'saleAnnouncementsCount: ',
    saleAnnouncementsCount
  )
  if (customerWishesCount > maxAnnouncementsCount) {
    const limit = customerWishesCount - maxAnnouncementsCount
    deleteOldAnnouncements('asiakastoive', limit)
  }
  if (saleAnnouncementsCount > maxAnnouncementsCount) {
    const limit = saleAnnouncementsCount - maxAnnouncementsCount
    deleteOldAnnouncements('myynti-ilmoitus', limit)
  }
}

const setCleaner = () => {
  setInterval(async () => {
    await cleanAnnouncements()
  }, delay)
}

export default setCleaner

import React, { useState } from 'react'
import './App.css'
import { IAnnouncement } from '../interfaces'
import sendAnnouncement from './services/annoucement'

import AnnouncmentForm from './components/AnnouncmentForm'

const App = () => {
  const [isSent, setIsSent] = useState(false)
  const [message, setMessage] = useState('')

  const handleNewAnnouncement = async (formData: IAnnouncement) => {
    try {
      const response = await sendAnnouncement(formData)
      if (response.status === 200) {
        setMessage(response.data.message)
      }
    } catch (error) {
      setMessage('Virhe ilmoituksen lähettämisessä!')
    } finally {
      setIsSent(true)
    }
  }

  return (
    <>
      {!isSent ? (
        <AnnouncmentForm handleNewAnnouncement={handleNewAnnouncement} />
      ) : (
        <p>{message}</p>
      )}
    </>
  )
}

export default App

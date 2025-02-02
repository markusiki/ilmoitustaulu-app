import React, { useState } from 'react'
import { IAnnouncement } from '../interfaces'
import sendAnnouncement from './services/annoucement'
import 'bootstrap/dist/css/bootstrap.min.css'
import AnnouncmentForm from './components/AnnouncmentForm'
import './styles.css'

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
        <div className="message">
          <p>{message}</p>
        </div>
      )}
    </>
  )
}

export default App

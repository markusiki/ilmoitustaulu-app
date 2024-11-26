import { useState, ChangeEvent, FormEvent } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { AnnouncementFormProps, IAnnouncement } from '../../interfaces'
import Resizer from 'react-image-file-resizer'

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  handleNewAnnouncement
}) => {
  const [formData, setFormData] = useState<IAnnouncement>({
    category: 'asiakastoive',
    poster: '',
    contact_info: '',
    title: '',
    content: '',
    file: ''
  })

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const resizeFile = (image: File) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        image,
        300,
        300,
        'JPEG',
        80,
        0,
        (resizedImage) => {
          resolve(resizedImage)
        },
        'base64'
      )
    })

  const handleImageAdd = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (file) {
      try {
        const image = await resizeFile(file)
        setFormData((prevData) => ({ ...prevData, file: image as string }))
      } catch (err) {
        console.log(err)
      }
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleNewAnnouncement(formData)
    setFormData({
      category: 'asiakastoive',
      poster: '',
      contact_info: '',
      title: '',
      content: ''
    })
  }

  return (
    <Container className="mt-5 mb-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="text-center mb-4">Uusi ilmoitus</h2>
          <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
            <Form.Group controlId="category" className="mb-3">
              <Form.Label>Ilmoitusluokka</Form.Label>
              <Form.Select
                name="category"
                value={formData.category} // Sidottu lomakkeen tilaan
                onChange={handleInputChange} // Päivittää tilan valinnan mukaan
              >
                <option value="asiakastoive">Asiakastoive</option>
                <option value="myynti-ilmoitus">Myynti-ilmoitus</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="poster" className="mt-3">
              <Form.Label>Ilmoittaja</Form.Label>
              <Form.Control
                type="text"
                name="poster"
                placeholder="Ilmoittaja"
                value={formData.poster}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="contact_info" className="mt-3">
              <Form.Label>Yhteystiedot (valinnainen)</Form.Label>
              <Form.Control
                type="text"
                name="contact_info"
                placeholder="Yhteystiedot (valinnainen)"
                value={formData.contact_info}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="title" className="mt-3">
              <Form.Label>Ilmoituksen otsikko</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Ilmoituksen otsikko"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="content" className="mt-3">
              <Form.Label>Ilmoituksen sisältö</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                placeholder="Ilmoituksen sisältö"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={3}
              />
            </Form.Group>

            <Form.Group controlId="file" className="mt-3">
              <Form.Label>Lataa kuva (valinnainen)</Form.Label>
              <Form.Control
                type="file"
                name="file"
                accept=".jpg, .jpeg, .png"
                onChange={handleImageAdd}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-4 w-100">
              Lähetä
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default AnnouncementForm

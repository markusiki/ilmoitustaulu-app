import { useState, ChangeEvent, FormEvent } from 'react'
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { AnnouncementFormProps, IAnnouncement } from '../../interfaces'

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  handleNewAnnouncement
}) => {
  const [formData, setFormData] = useState<IAnnouncement>({
    category: 'asiakastoive',
    poster: '',
    contact_info: '',
    title: '',
    content: '',
    file: undefined
  })

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageAdd = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target as HTMLInputElement
    console.log(input)
    const image = input.files?.[0]
    if (image) {
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result
        if (result) {
          const blob = new Blob([result])
          const blobReader = new FileReader()
          blobReader.onload = () => {
            const base64String = (blobReader.result as string).split(',')[1]
            setFormData((prevData) => ({
              ...prevData,
              file: base64String
            }))
            console.log(base64String)
          }
          blobReader.readAsDataURL(blob)
        }
      }
      reader.readAsArrayBuffer(image)
    } else {
      console.log('No file selected')
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

            <Button
              variant="primary"
              type="submit"
              className="mt-4 w-100"
            >
              Lähetä
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AnnouncementForm;

import { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";

interface AnnouncementFormData {
  category: "asiakastoive" | "myynti-ilmoitus";
  poster: string;
  contact_info: string;
  title: string;
  content: string;
}

interface AddAnnouncementFormProps {
  onAddAnnouncement: (data: AnnouncementFormData) => void;
}

export default function AddAnnouncementForm({ onAddAnnouncement }: AddAnnouncementFormProps) {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    category: "asiakastoive",
    poster: "",
    contact_info: "",
    title: "",
    content: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddAnnouncement(formData);
    setFormData({
      category: "asiakastoive",
      poster: "",
      contact_info: "",
      title: "",
      content: "",
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="category">
        <Form.Label>Ilmoitusluokka</Form.Label>
        <div>
          <Form.Check
            inline
            type="radio"
            name="category"
            label="Asiakastoiveet"
            value="asiakastoive"
            checked={formData.category === "asiakastoive"}
            onChange={handleInputChange}
          />
          <Form.Check
            inline
            type="radio"
            name="category"
            label="Myynti"
            value="myynti-ilmoitus"
            checked={formData.category === "myynti-ilmoitus"}
            onChange={handleInputChange}
          />
        </div>
      </Form.Group>

      <Form.Group controlId="poster">
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

      <Form.Group controlId="contact_info">
        <Form.Label>Yhteystiedot (valinnainen)</Form.Label>
        <Form.Control
          type="text"
          name="contact_info"
          placeholder="Yhteystiedot (valinnainen)"
          value={formData.contact_info}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="title">
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

      <Form.Group controlId="content">
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

      <Button variant="primary" type="submit" className="mt-3">
        Lähetä
      </Button>
    </Form>
  );
}
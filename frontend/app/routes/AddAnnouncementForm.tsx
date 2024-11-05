import { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";

interface AnnouncementFormData {
  category: "asiakastoive" | "myynti-ilmoitus";
  announcer: string;
  contactInfo: string;
  title: string;
  content: string;
}

interface AddAnnouncementFormProps {
  onAddAnnouncement: (data: AnnouncementFormData) => void;
}

export default function AddAnnouncementForm({ onAddAnnouncement }: AddAnnouncementFormProps) {
  const [formData, setFormData] = useState<AnnouncementFormData>({
    category: "asiakastoive",
    announcer: "",
    contactInfo: "",
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
      announcer: "",
      contactInfo: "",
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
            value="Myynti"
            checked={formData.category === "myynti-ilmoitus"}
            onChange={handleInputChange}
          />
        </div>
      </Form.Group>

      <Form.Group controlId="announcer">
        <Form.Label>Ilmoittaja</Form.Label>
        <Form.Control
          type="text"
          name="announcer"
          placeholder="Ilmoittaja"
          value={formData.announcer}
          onChange={handleInputChange}
          required
        />
      </Form.Group>

      <Form.Group controlId="contactInfo">
        <Form.Label>Yhteystiedot (valinnainen)</Form.Label>
        <Form.Control
          type="text"
          name="contactInfo"
          placeholder="Yhteystiedot (valinnainen)"
          value={formData.contactInfo}
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
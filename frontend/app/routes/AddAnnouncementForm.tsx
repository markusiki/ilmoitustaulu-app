import { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";

interface AnnouncementFormData {
  category: "asiakastoive" | "myynti-ilmoitus";
  poster: string;
  contact_info: string;
  title: string;
  content: string;
  file?: BinaryData;
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
    file: undefined,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        if (reader.result) {
          setFormData((prevData) => ({
            ...prevData,
            file: reader.result.toString().split(",")[1],
          }));
        }
      };
  
      reader.onerror = () => {
        console.error("Failed to read file");
        setFormData((prevData) => ({
          ...prevData,
          file: undefined,
        }));
      };
  
      reader.readAsDataURL(file); // Lue tiedosto Base64-muodossa
    } else {
      setFormData((prevData) => ({
        ...prevData,
        file: undefined,
      }));
    }
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
      file: undefined,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="category" style={{ padding: "10px" }}>
        <Form.Label>Ilmoitusluokka</Form.Label>
        <Form.Select aria-label="asiakastoive">
          <option value="asiakastoive">Asiakastoive</option>
          <option value="myynti-ilmoitus" >Myynti-ilmoitus</option>
        </Form.Select>
      </Form.Group>

      <Form.Group controlId="poster" style={{ padding: "10px" }}>
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

      <Form.Group controlId="contact_info" style={{ padding: "10px" }}>
        <Form.Label>Yhteystiedot (valinnainen)</Form.Label>
        <Form.Control
          type="text"
          name="contact_info"
          placeholder="Yhteystiedot (valinnainen)"
          value={formData.contact_info}
          onChange={handleInputChange}
        />
      </Form.Group>

      <Form.Group controlId="title" style={{ padding: "10px" }}>
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

      <Form.Group controlId="content" style={{ padding: "10px" }}>
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

      <Form.Group controlId="file" style={{ padding: "10px" }}>
        <Form.Label>Liitä tiedosto (valinnainen)</Form.Label>
        <Form.Control
          type="file"
          name="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="mt-3" style={{ margin: "10px" }}>
        Lähetä
      </Button>
    </Form>
  );
}
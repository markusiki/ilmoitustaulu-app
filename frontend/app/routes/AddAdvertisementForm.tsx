import { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";

interface IAdvertisement {
  id: string;
  file: BinaryData;
}

interface AddAdvertisementFormProps {
  onAddAdvertisement: (data: Omit<IAdvertisement, "id">) => void;
}

export default function AddAdvertisementForm({ onAddAdvertisement }: AddAdvertisementFormProps) {
  const [file, setFile] = useState<BinaryData | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
  
      reader.onload = () => {
        if (reader.result) {
          setFile(reader.result.toString().split(",")[1]);
        }
      };
  
      reader.onerror = () => {
        console.error("Failed to read file");
        setFile(undefined);
      };
  
      reader.readAsDataURL(file);
    } else {
      setFile(undefined);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      onAddAdvertisement({ file });
      setFile(null);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="file" style={{ padding: "10px" }}>
        <Form.Label>Liitä tiedosto</Form.Label>
        <Form.Control type="file" accept="image/*" onChange={handleFileChange} required />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        Lisää Mainos
      </Button>
    </Form>
  );
}
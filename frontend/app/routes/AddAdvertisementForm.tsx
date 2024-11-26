import { useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";
import resizeFile from "~/utils";

interface IAdvertisement {
  id: string;
  file: string;
}

interface AddAdvertisementFormProps {
  onAddAdvertisement: (data: Omit<IAdvertisement, "id">) => void;
}

export default function AddAdvertisementForm({ onAddAdvertisement }: AddAdvertisementFormProps) {
  const [file, setFile] = useState<IAdvertisement["file"] | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      try {
        const image = await resizeFile(file, 800);
        setFile(image as string);
      } catch (err) {
        console.log(err);
      }
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

import { Card } from "react-bootstrap";

interface NoticeProps {
  title: string;
  content: string;
  poster: string;
  contact_info?: string;
  file?: BinaryData;
}

export default function Notice({ title, content, poster, contact_info, file }: NoticeProps) {
  return (
    <Card className="mb-2" style={{ height: "170px" }}>
      <Card.Body>
        <Card.Title style={{ fontSize: "15px" }}>{title}</Card.Title>
        <Card.Text style={{ fontSize: "10px" }}>{content}</Card.Text>
        <Card.Text style={{ fontSize: "10px" }}>Ilmoittaja: {poster}</Card.Text>
        <Card.Text style={{ fontSize: "10px" }}>Yhteystiedot: {contact_info}</Card.Text>
        {file ? (
          <Card.Img
            style={{ height: "30%", width: "auto" }}
            variant="bottom"
            src={`data:image/jpeg;base64,${file}`}
          />
        ) : null}
      </Card.Body>
    </Card>
  );
}

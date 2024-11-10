import { Card } from "react-bootstrap";

interface NoticeProps {
  title: string;
  content: string;
  poster: string;
  contact_info: string;
}

export default function Notice({ title, content, poster, contact_info }: NoticeProps) {
  return (
    <Card className="mb-2" style={{ height: "170px" }}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{content}</Card.Text>
        <Card.Text>{poster}</Card.Text>
        <Card.Text>{contact_info}</Card.Text>
      </Card.Body>
    </Card>
  );
}
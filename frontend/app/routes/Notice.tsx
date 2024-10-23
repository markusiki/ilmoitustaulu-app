import { Card } from "react-bootstrap";

interface NoticeProps {
  title: string;
  description: string;
}

export default function Notice({ title, description }: NoticeProps) {
  return (
    <Card className="mb-2">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}
import Notice from "./Notice";
import { Card } from "react-bootstrap";

interface Announcement {
  title: string;
  content: string;
}

interface SectionProps {
  title: string;
  announcements: Announcement[];
}

export default function Section({ title, announcements }: SectionProps) {
  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">
        <h2>{title}</h2>
      </Card.Header>
      <Card.Body>
        {announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <Notice key={index} title={announcement.title} description={announcement.content} />
          ))
        ) : (
          <p>No announcements available.</p>
        )}
      </Card.Body>
    </Card>
  );
}
import Notice from "./Notice";
import { Card } from "react-bootstrap";

interface Announcement {
  title: string;
  content: string;
  poster: string;
  contact_info: string;
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
            <Notice key={index} title={announcement.title} content={announcement.content} poster={announcement.poster} contact_info={announcement.contact_info}  />
          ))
        ) : (
          <p>No announcements available.</p>
        )}
      </Card.Body>
    </Card>
  );
}
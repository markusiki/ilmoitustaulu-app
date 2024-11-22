import { IAnnouncement } from "interfaces";
import Notice from "./Notice";
import { Card, Row, Col } from "react-bootstrap";
import "../custom.css";

interface SectionProps {
  title: string;
  announcements: IAnnouncement[];
  onDelete?: () => void;
}

export default function Section({
  title,
  announcements,
  isAdmin,
  onDelete,
}: SectionProps & { isAdmin: boolean; onDelete: (id: string) => void }) {
  return (
    <Card className="mb-4" style={{ border: "none" }}>
      <Card.Header>
        <h1 className="section-title">{title}</h1>
      </Card.Header>
      <Card.Body>
        {announcements.length > 0 ? (
          <Row className="">
            {announcements.map((announcement) => (
              <Col key={announcement.id} xs={12} sm={12} md={8} lg={4} xl={4}>
                <Notice
                  title={announcement.title}
                  content={announcement.content}
                  poster={announcement.poster}
                  contact_info={announcement.contact_info}
                  file={announcement.file}
                  isAdmin={isAdmin}
                  onDelete={() => onDelete(announcement.id)}
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p>No announcements available.</p>
        )}
      </Card.Body>
    </Card>
  );
}

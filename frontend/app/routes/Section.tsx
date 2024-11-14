import { IAnnouncement } from "interfaces";
import Notice from "./Notice";
import { Card, Row, Col } from "react-bootstrap";
import "../custom.css";

interface SectionProps {
  title: string;
  announcements: IAnnouncement[];
}

export default function Section({ title, announcements }: SectionProps) {
  return (
    <Card className="mb-4" style={{ height: "100%" }}>
      <Card.Header>
        <h1 className="section-title">{title}</h1>
      </Card.Header>

      <Card.Body>
        {announcements.length > 0 ? (
          <Row>
            {announcements.map((announcement, index) => (
              <Col key={index} md={2} className="mb-3">
                <Notice
                  title={announcement.title}
                  content={announcement.content}
                  poster={announcement.poster}
                  contact_info={announcement.contact_info}
                  file={announcement.file}
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
